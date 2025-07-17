# desert_ai_module.py

import pandas as pd
import numpy as np
import openai
import os
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report

# Load OpenAI API key from environment
openai.api_key = os.getenv("OPENAI_API_KEY")

# -------------------------
# Step 1: Simulated Dataset
# -------------------------
data = {
    'temperature': [45, 38, 50, 42, 39, 47],
    'hydration_level': [1, 4, 1, 2, 3, 1],  # 1 = low, 5 = high
    'skin_condition': [2, 1, 3, 2, 1, 3],   # 1 = normal, 2 = sunburn, 3 = blisters
    'dizziness': [1, 0, 1, 1, 0, 1],        # 0 = no, 1 = yes
    'urgency_level': ['high', 'low', 'high', 'medium', 'low', 'high']
}

df = pd.DataFrame(data)

# -------------------------
# Step 2: Preprocessing
# -------------------------
X = df[['temperature', 'hydration_level', 'skin_condition', 'dizziness']]
y = df['urgency_level']

le = LabelEncoder()
y_encoded = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.3, random_state=42)

# -------------------------
# Step 3: Train Model
# -------------------------
model = DecisionTreeClassifier(max_depth=3)
model.fit(X_train, y_train)

# -------------------------
# Step 4: Evaluate Model
# -------------------------
y_pred = model.predict(X_test)
print("=== Classification Report ===")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# -------------------------
# Step 5: OpenAI Triage Advice
# -------------------------
def desert_triage_advice(symptom_summary):
    prompt = f"""
    A patient reports: {symptom_summary}
    They are in a desert with extreme heat and limited water supply.
    Give an urgency level, key health risks, and minimal-water treatment advice.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a desert healthcare assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=200
    )

    return response["choices"][0]["message"]["content"]

# -------------------------
# Step 6: Simulated User Input
# -------------------------
user_input = pd.DataFrame([{
    'temperature': 46,
    'hydration_level': 2,
    'skin_condition': 2,
    'dizziness': 1
}])

predicted_label = model.predict(user_input)[0]
urgency = le.inverse_transform([predicted_label])[0]

symptom_text = "Sunburn, signs of dehydration, dizziness at 46°C"

print("\n=== ML Model Prediction ===")
print("Urgency Level:", urgency)

print("\n=== OpenAI Assistant Advice ===")
print(desert_triage_advice(symptom_text))