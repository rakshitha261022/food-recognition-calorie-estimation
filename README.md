# food-recognition-calorie-estimation
# 🍱 Food Recognition and Calorie Estimation Using LLaVA + Ollama

An AI-powered web application that recognizes food items from uploaded images and estimates their calorie content using the **LLaVA multimodal vision-language model** running locally through **Ollama**.

The project provides a simple interface where users can upload a food image, analyze it using a locally running AI model, view the recognized food name, confidence information, and estimated calorie value, and maintain a history of analyzed meals.

---

## 📌 Features

* 🍔 **Food Image Recognition**
* 🔥 **Calorie Estimation**
* 🤖 **LLaVA Vision-Language Model**
* 🖥️ **Local AI Processing using Ollama**
* 🔐 **User Registration and Login**
* 📊 **Food and Calorie Analytics**
* 📖 **Meal Journal / History**
* 💾 **MongoDB Database**
* 🔒 **Password Hashing using Bcrypt**
* ⚡ **React-based Responsive UI**
* 🐍 **Python Flask Backend**
* 🔗 **REST API Integration**

---

## 🏗️ System Architecture

```text
                   ┌─────────────────────┐
                   │       User          │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   React Frontend    │
                   │ React + Vite + CSS  │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │    Flask Backend    │
                   │   Python + Flask    │
                   └──────┬────────┬─────┘
                          │        │
              ┌───────────┘        └────────────┐
              ▼                                 ▼
     ┌─────────────────┐              ┌─────────────────┐
     │     Ollama      │              │    MongoDB      │
     │   Local Server  │              │    Database     │
     └────────┬────────┘              └─────────────────┘
              │
              ▼
     ┌─────────────────┐
     │      LLaVA      │
     │ Vision-Language  │
     │      Model       │
     └────────┬────────┘
              │
              ▼
     ┌──────────────────────────────┐
     │ Food Name + Calories + Info  │
     └──────────────────────────────┘
```

---

## 🧠 How the Project Works

1. The user logs into the application.
2. The user uploads an image of food.
3. The React frontend sends the image to the Flask backend.
4. Flask processes the image and communicates with the locally running Ollama server.
5. Ollama sends the image to the **LLaVA model**.
6. LLaVA analyzes the image and identifies the food.
7. The application estimates the calories based on the AI-generated food information.
8. The result is displayed to the user.
9. The meal information can be stored in MongoDB.
10. Users can view previously analyzed meals through the Journal and Analytics sections.

---

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* Tailwind CSS
* Lucide React Icons
* JavaScript

### Backend

* Python
* Flask
* Flask-CORS
* PyMongo
* Bcrypt

### AI / Deep Learning

* LLaVA
* Ollama
* Vision-Language Model

### Database

* MongoDB

---

## 📂 Project Structure

```text
Food-Recognition-Calorie-Estimation/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Scanner.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Journal.jsx
│   │   │   └── AuthPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── .gitignore
```

---

## ⚙️ Requirements

Before running the project, install:

* Python 3.10+
* Node.js
* npm
* MongoDB
* Ollama
* LLaVA model

---

## 🤖 Install Ollama and LLaVA

Install Ollama on your computer and make sure the Ollama server is running.

Then download the LLaVA model:

```bash
ollama pull llava
```

Check the installed models:

```bash
ollama list
```

Test Ollama:

```bash
curl.exe http://127.0.0.1:11434
```

If Ollama is working correctly, it should respond that the Ollama server is running.

---

## 🐍 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

The backend will normally run at:

```text
http://127.0.0.1:5000
```

---

## ⚛️ Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🗄️ MongoDB

The application uses MongoDB to store:

* User accounts
* User profile information
* Meal records
* Food names
* Calorie information
* Meal timestamps

Example collections:

```text
users
meals
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
MONGO_URI=mongodb://localhost:27017/food_calorie_app
SECRET_KEY=your_secret_key
```

> Do not upload your `.env` file or passwords to GitHub.

Add this to `.gitignore`:

```text
.env
venv/
__pycache__/
node_modules/
```

---

## 🔌 API Endpoints

### User Registration

```text
POST /api/auth/signup
```

Creates a new user account.

### User Login

```text
POST /api/auth/login
```

Authenticates the user.

### Get Meals

```text
GET /api/meals?email=user@example.com
```

Retrieves the user's saved meal history.

### Food Analysis

```text
POST /api/analyze
```

Sends a food image to the backend for AI analysis.

---

## 🍽️ Example Output

After uploading a food image, the application can provide information such as:

```text
Food Name: Dosa

Estimated Calories: 168 kcal

Serving: 1 piece

Analysis: The image appears to contain a dosa,
a South Indian rice and lentil-based food.
```

The exact result depends on the image and the AI model's analysis.

---

## 🧠 About LLaVA

**LLaVA (Large Language and Vision Assistant)** is a multimodal AI model capable of understanding both images and text.

In this project, LLaVA is used to analyze food images and provide textual information about the detected food.

Instead of using a traditional image classification model alone, the project uses a vision-language model that can interpret the image and generate a natural-language response.

---

## 🖥️ About Ollama

**Ollama** is used to run the LLaVA model locally on the computer.

The architecture is:

```text
Food Image
    ↓
Flask Backend
    ↓
Ollama
    ↓
LLaVA
    ↓
AI Analysis
    ↓
Food + Calorie Information
```

Running LLaVA locally allows the project to perform AI processing without depending on a cloud AI API for the model inference.

---

## 📊 Application Modules

### 1. Authentication

Users can:

* Register
* Login
* Securely store passwords
* Access their personal food records

### 2. Food Scanner

Users can upload a food image and analyze it using LLaVA.

### 3. Dashboard

Displays important information about the user's food and calorie records.

### 4. Analytics

Provides an overview of calorie consumption and meal information.

### 5. Journal

Stores and displays previously analyzed meals along with timestamps.

---

## 🔒 Security

The project includes:

* Password hashing using Bcrypt
* Environment variables for sensitive configuration
* User-specific meal records
* CORS configuration
* Local AI inference through Ollama

---

## 🎯 Objectives

The main objectives of this project are:

1. To recognize food items from images.
2. To use AI-based image understanding for food analysis.
3. To estimate calorie values for recognized foods.
4. To provide an easy-to-use web interface.
5. To maintain users' meal history.
6. To demonstrate the practical application of multimodal AI.
7. To run the AI model locally using Ollama.

---

## 🚀 Future Enhancements

Possible future improvements include:

* 📷 Real-time camera-based food recognition
* 🥗 Nutritional information such as protein, carbohydrates and fats
* 📈 Advanced calorie consumption charts
* 🎯 Personalized calorie goals
* 🍎 Personalized meal recommendations
* 🏃 Activity-based calorie tracking
* 👨‍⚕️ Dietitian integration
* 📱 Mobile application
* ☁️ Optional cloud deployment
* 🎯 Improved food-specific calorie estimation using a dedicated nutrition database

---

## ⚠️ Disclaimer

The calorie values generated by the application are **estimates** and should not be considered medically accurate nutritional measurements.

Actual calories can vary depending on:

* Portion size
* Ingredients
* Cooking method
* Recipe
* Food preparation

The application is intended for educational and demonstration purposes.

---

## 👩‍💻 Project Information

**Project Title:**
Food Recognition and Calorie Estimation Using Deep Learning

**AI Model:**
LLaVA

**Local AI Runtime:**
Ollama

**Frontend:**
React.js + Vite

**Backend:**
Python + Flask

**Database:**
MongoDB

**Project Type:**
MCA Academic Project

---

## ⭐ Conclusion

The **Food Recognition and Calorie Estimation** application demonstrates how multimodal artificial intelligence can be integrated into a full-stack web application.

By combining **React, Flask, MongoDB, Ollama, and LLaVA**, the system provides an interactive platform for analyzing food images and maintaining meal information while keeping the AI inference local.

---

## ⭐ If You Like This Project

If this project helped you, consider giving the repository a ⭐ on GitHub.
