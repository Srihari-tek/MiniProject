from flask import Flask, request, jsonify
import pandas as pd
import joblib

# Load model and encoders using joblib
model = joblib.load('learning_recommender_model.pkl')
input_encoders = joblib.load('input_label_encoders.pkl')
output_encoder = joblib.load('output_label_encoder.pkl')

# Initialize Flask app
app = Flask(__name__)

# Define prediction endpoint
@app.route('/predict', methods=['POST'])
def predict_learning():
    data = request.json

    input_fields = ['Age', 'Gender', 'Diagnosis', 
                    'Memory_Score', 'Memory_Level',
                    'Math_Reasoning_Score', 'Math_Reasoning_Level',
                    'Logical_Thinking_Score', 'Logical_Thinking_Level',
                    'Motor_Skills_Score', 'Motor_Skills_Level',
                    'Social_Understanding_Score', 'Social_Understanding_Level']

    # Check for missing fields
    missing_fields = [field for field in input_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f'Missing fields: {missing_fields}'}), 400

    # Create DataFrame from input
    input_df = pd.DataFrame([data], columns=input_fields)

    # Apply label encoders
    for col in input_df.columns:
        if col in input_encoders:
            le = input_encoders[col]
            try:
                input_df[col] = le.transform([input_df[col][0]])
            except ValueError:
                return jsonify({'error': f'Invalid value for {col}: {input_df[col][0]}'}), 400

    # Make prediction
    prediction = model.predict(input_df)
    predicted_label = output_encoder.inverse_transform(prediction)

    # Return result
    return jsonify({'recommendation': predicted_label[0]})

if __name__ == '__main__':
    app.run(debug=True)
