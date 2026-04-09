from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np 
import pandas as pd 
from sklearn.preprocessing import LabelEncoder

app= Flask(__name__)

#loading the saved model, scaler adn feature names
model = joblib.load('model.pkl')
scaler =joblib.load('scaler.pkl')
feature_names = joblib.load('feature_names.pkl')

#categorical cloumns to endcode
ENCODINGS = {
    'Gender' : ['Female', 'Male'],
    'Blood Type' : ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'Medical Condition' : ['Arthritis', 'Asthma', 'Cancer', 'Diabetes', 'Hypertension', 'Obesity'],
    'Admission Type' : ['Emergency', 'Elective', 'Urgent'],
    'Insurance Provider' : ['Blue Cross', 'Cigna', 'Medicare', 'Aetna', 'UnitedHealthcare']
}

def encode_value(column,value):
    """Encode a categorical values to a number using the same order as during training. Returns the index position of the value"""
    if value in ENCODINGS[column]:
        return ENCODINGS[column].index(value)
    return 0                                                                #defaults to 0 if the value is not found

#home route to render the main UI page
@app.route('/')
def home():
    return render_template('index.html')

#API endpoint to handle prediction requests
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)                                           #get JSON data from the frontend
        input_data = {                                                      #build input in the correct feature order
            'Age' : int(data.get('Age',0)),
            'Gender': encode_value('Gender', data.get('Gender', 'Male')),
            'Blood Type': encode_value('Blood Type', data.get('Blood Type', 'O+')),
            'Medical Condition': encode_value('Medical Condition', data.get('Medical Condition', 'Diabetes')),
            'Admission Type':encode_value('Admission Type', data.get('Admission Type', 'Elective')),
            'Insurance Provider': encode_value('Insurance Provider', data.get('Insurance Provider', 'Medicare')),
            'Billing Amount': float(data.get('billing Amount', 0)),
            'Length of Stay': int(data.get('Length of Stay', 0))
        }

        input_df = pd.DataFrame([input_data])[feature_names]                #convert to DataFrame with correct column order
        input_scaled = scaler.transform(input_df)                           #scale the input using the saved scaler

        #get prediction and probability from the model
        prediction = model.predict(input_scaled)[0]         
        probability = model.predict_proba(input_scaled)[0][1]

        risk_level= 'Low' #default
        #risk level determined based on the probability
        if probability >=0.7:
            resk_level = 'High'
        elif probability >= 0.4:
            resk_level = 'Medium'
        else:
            risk_level = 'Low'

        if bool(prediction) == True and risk_level =='Low':
            risk_level = 'Medium'
        
        #returns prediction results as JSON response
        return jsonify({
            'high_risk': bool(prediction),
            'probability' : round(float(probability)*100,1),
            'risk_level': risk_level
        })
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error':str(e)}), 500
    
#run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
