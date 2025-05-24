from flask import Blueprint, request, jsonify
from flask_mail import Message
from flask import current_app

# Create a Blueprint for email routes
auth = Blueprint("email", __name__)
# 📌 Route __ Create Email send to user
@auth.route('/api/send_Email', methods=['POST'])
def send_email():
    data = request.json
    recipient = data.get("email")
    subject = data.get("subject")
    message = data.get("message")
    
    if not recipient or not subject or not message:
        return jsonify({"error": "Missing required fields"}), 400
    # Create a message
    msg = Message(subject, sender='talhashafeeq20202@gmail.com', recipients=[recipient])
    msg.body = message
    
    try:
        # Send the message
        
        mail = current_app.extensions['mail']
        mail.send(msg)
        return jsonify({'message': 'Email sent successfully!'}), 200
    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
        return jsonify({'message': str(e)}), 500 