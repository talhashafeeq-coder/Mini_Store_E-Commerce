from flask import jsonify, Blueprint, request
from models.Config import db
from flask_jwt_extended import  jwt_required
from models.PaymentTable import PaymentTable
from datetime import datetime

auth = Blueprint('payments', __name__)

# 📌 Route __Create a new Payment
@auth.route('/api/payments/v1', methods=['POST'])
# @jwt_required()
def create_payment():
    data= request.get_json()
    
    try:
        if not all(key in data for key in ['order_id', 'amount', 'payment_method']):
            return jsonify({'message': 'Order ID, Amount, and Payment Method are required'}), 400
        
         # Create a new payment instance
        new_payment = PaymentTable(
            order_id=data['order_id'],
            amount=data['amount'],
            payment_method=data['payment_method'],
            payment_date=datetime.now(),
            status=data.get('status', 'pending')  # Default status is 'pending'
        )

        db.session.add(new_payment)
        db.session.commit()

        return jsonify({'message': 'Payment created successfully', 'payment': new_payment.serialize()}), 201
    
    except Exception as e:
     return jsonify({'message': str(e)}), 500

# 📌 Route __Get ALL payments
@auth.route('/api/payments/v1', methods=['GET'])
# @jwt_required()
def get_payments():
    try:
        payments = PaymentTable.query.all()
        return jsonify({'payments': [payment.serialize() for payment in payments]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
# 📌 Route __get payment by id
@auth.route('/api/payments/v1/<int:payment_id>', methods=['GET'])
# @jwt_required()
def get_payment(payment_id):
    try:
        payment = PaymentTable.query.get(payment_id)
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        return jsonify(payment.serialize()), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500