import os
import io
import json
import tempfile
import datetime
import bcrypt
import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from PIL import Image

# Load environment configurations
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection Initialization
try:
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database()
    users_collection = db["users"]
    meals_collection = db["meals"]  # New collection for persisting logged meals
    print("🚀 MongoDB is connected! Ready to manage users and dietary logs.")
except Exception as e:
    print(f"❌ MongoDB Connection failed: {e}")


# -------------------------------------------------------------------------
# 🔑 REGISTRATION ENDPOINT (SIGNUP)
# -------------------------------------------------------------------------
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    if not data:
        return jsonify({"error": "No data sent"}), 400

    email = data.get('email', '').strip().lower()
    name = data.get('name', '').strip()
    password = data.get('password', '')

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "An account with this email already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    age = int(data.get('age', 25))
    gender = data.get('gender', 'male')
    height = float(data.get('height', 175))
    weight = float(data.get('weight', 70))
    goal = data.get('goal', 'maintain')
    activity = float(data.get('activity', 1.375))

    if gender == 'male':
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

    tdee = bmr * activity

    if goal == 'lose':
        calorie_cap = round(tdee - 500)
    elif goal == 'gain':
        calorie_cap = round(tdee + 300)
    else:
        calorie_cap = round(tdee)

    protein_cap = round(weight * 1.8)

    user_document = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "calorieCap": calorie_cap,
        "proteinCap": protein_cap,
        "biometrics": {
            "age": age, "gender": gender, "height": height, "weight": weight, "goal": goal
        }
    }
    
    users_collection.insert_one(user_document)
    
    return jsonify({
        "status": "success",
        "user": {
            "name": name, "email": email, "calorieCap": calorie_cap, "proteinCap": protein_cap
        }
    }), 201


# -------------------------------------------------------------------------
# 🔑 LOGIN ENDPOINT (SIGNIN)
# -------------------------------------------------------------------------
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({"error": "No credentials provided"}), 400
        
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = users_collection.find_one({"email": email})
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({
            "status": "success",
            "user": {
                "name": user['name'], "email": user['email'], "calorieCap": user['calorieCap'], "proteinCap": user['proteinCap']
            }
        }), 200
        
    return jsonify({"error": "Invalid email or incorrect password"}), 401


# -------------------------------------------------------------------------
# 🧠 LOCAL COMPUTER VISION ENDPOINT (OLLAMA LLAVA)
# -------------------------------------------------------------------------
@app.route('/api/scan', methods=['POST'])
def scan_plate():
    if 'image' not in request.files:
        return jsonify({"error": "No image file detected in upload request"}), 400
        
    image_file = request.files['image']
    
    # Create a temporary path to store normalized JPEG image
    temp_fd, temp_img_path = tempfile.mkstemp(suffix=".jpg")
    os.close(temp_fd)

    try:
        # Normalize incoming image formats (WEBP, PNG, etc.) into RGB JPEG
        raw_image = Image.open(image_file.stream)
        rgb_image = raw_image.convert('RGB')
        rgb_image.save(temp_img_path, format='JPEG', quality=95)

        prompt = """
        Examine this image carefully. Identify each actual food item visible (e.g., "Burger", "French Fries", "Dipping Sauce").
        Estimate realistic weight in grams and macronutrients (Calories, Protein, Carbohydrates, Fat) for each identified item.

        Respond ONLY with a raw JSON array of objects. Do NOT use placeholder text like "Food Name". Ignore table tops or non-edible objects.
        
        Example format structure:
        [
          {"name": "Actual Food Identified", "weight": 180, "calories": 300, "protein": 15, "carbs": 25, "fat": 10}
        ]
        
        Do not output markdown backticks or extra sentences. Output raw JSON only.
        """

        # Call local Ollama LLaVA model
        response = ollama.chat(
            model='llava',
            messages=[{
                'role': 'user',
                'content': prompt,
                'images': [temp_img_path]
            }]
        )

        clean_text = response['message']['content'].strip()
        clean_text = clean_text.replace("```json", "").replace("```", "").strip()
        parsed_predictions = json.loads(clean_text)

        return jsonify({
            "status": "success",
            "predictions": parsed_predictions,
            "engine": "Local LLaVA Vision Engine"
        }), 200

    except json.JSONDecodeError:
        return jsonify({"error": "Local model output could not be parsed as clean JSON."}), 500
    except Exception as e:
        return jsonify({"error": f"Local Ollama processing error: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)


# -------------------------------------------------------------------------
# 🥗 MEAL LOGGING ENDPOINTS (PERSISTENCE)
# -------------------------------------------------------------------------
@app.route('/api/meals/log', methods=['POST'])
def log_meal():
    data = request.json
    if not data or not data.get('email'):
        return jsonify({"error": "User authentication email required to log meal"}), 400

    user_email = data.get('email').strip().lower()
    items = data.get('items', [])
    total_calories = data.get('totalCalories', 0)
    total_protein = data.get('totalProtein', 0)
    total_carbs = data.get('totalCarbs', 0)
    total_fat = data.get('totalFat', 0)

    # Generate title dynamically based on detected food items
    item_names = [item.get('name') for item in items if item.get('name')]
    meal_title = ", ".join(item_names[:3]) if item_names else "Scanned Meal"

    now = datetime.datetime.now()

    meal_document = {
        "userEmail": user_email,
        "title": meal_title,
        "items": items,
        "totalCalories": total_calories,
        "totalProtein": total_protein,
        "totalCarbs": total_carbs,
        "totalFat": total_fat,
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%I:%M %p"),
        "createdAt": now
    }

    meals_collection.insert_one(meal_document)

    return jsonify({
        "status": "success",
        "message": "Meal logged successfully!"
    }), 201


@app.route('/api/meals', methods=['GET'])
def get_user_meals():
    email = request.args.get('email', '').strip().lower()
    if not email:
        return jsonify({"error": "Email query parameter required"}), 400

    # Query MongoDB for user's meals sorted newest first
    meals_cursor = meals_collection.find({"userEmail": email}).sort("createdAt", -1)
    
    meals_list = []
    for meal in meals_cursor:
        meals_list.append({
            "id": str(meal['_id']),
            "title": meal.get('title', 'Scanned Meal'),
            "items": meal.get('items', []),
            "totalCalories": meal.get('totalCalories', 0),
            "totalProtein": meal.get('totalProtein', 0),
            "totalCarbs": meal.get('totalCarbs', 0),
            "totalFat": meal.get('totalFat', 0),
            "date": meal.get('date', ''),
            "time": meal.get('time', '')
        })

    return jsonify({
        "status": "success",
        "meals": meals_list
    }), 200

@app.route('/api/meals/today', methods=['GET'])
def get_today_summary():
    email = request.args.get('email', '').strip().lower()
    if not email:
        return jsonify({"error": "Email required"}), 400

    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    today_meals = list(meals_collection.find({"userEmail": email, "date": today_str}))

    total_calories = sum(m.get('totalCalories', 0) for m in today_meals)
    total_protein = sum(m.get('totalProtein', 0) for m in today_meals)
    total_carbs = sum(m.get('totalCarbs', 0) for m in today_meals)
    total_fat = sum(m.get('totalFat', 0) for m in today_meals)

    return jsonify({
        "status": "success",
        "date": today_str,
        "consumedCalories": total_calories,
        "consumedProtein": total_protein,
        "consumedCarbs": total_carbs,
        "consumedFat": total_fat,
        "mealCount": len(today_meals)
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)