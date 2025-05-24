import os
from flask import jsonify, Blueprint, request, url_for
from models.Config import db , send_email
from models.RetrunTable import ReturnTable, ReturnStatus
from models.CategoriesTable import SizeTable
from models.UserTable import UserTable
# from models.OrdersTable import OrderTable

auth = Blueprint('return', __name__)

# 📌 Route __ Create Return Request
@auth.route('/api/createReturn/v1', methods=['POST'])
def create_return():
    data = request.get_json()
    try:
        if not data or 'order_id' not in data or 'reason' not in data  or 'user_id' not in data:
            return jsonify({'message': 'Order ID, reason and product ID are required'}), 400
        
        new_return = ReturnTable(
            order_id=data['order_id'],
            reason=data['reason'],
            status=ReturnStatus.PENDING.value,  # Default: Pending
            user_id=data['user_id']
        )

        db.session.add(new_return)
        db.session.commit()  # Save return request
        return jsonify(new_return.serialize()), 201
    except KeyError as e:
        return jsonify({'error': f"Missing key: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

# 📌 Route __Get All Return Requests (For Admin)**
@auth.route('/api/returns/v1', methods=['GET'])
def get_returns():
    try:
        return_data = ReturnTable.query.all()
        if not return_data:
            return jsonify({'message': 'No return data found'}), 404

        result = []
        for return_request in return_data:
            user = UserTable.query.get(return_request.user_id)
            # order = OrderTable.query.get(return_request.order_id)

            serialized = return_request.serialize()
            serialized['user'] = user.serialize() if user else None
            # serialized['order'] = order.serialize() if order else None

            result.append(serialized)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500
    
# ✅ 3️⃣ **Update Return Request Status and send email to user (Admin Only)**
# @auth.route('/api/updateReturn/v1/<int:return_id>', methods=['PUT'])
# def update_return_status(return_id):
#     data = request.get_json()
#     try:
#         return_request = ReturnTable.query.get(return_id)
#         if not return_request:
#             return jsonify({'message': 'Return request not found'}), 404

#         # ✅ Check status
#         if 'status' not in data or data['status'].lower() not in [s.value for s in ReturnStatus]:
#             return jsonify({'message': 'Valid status (accepted/rejected/pending) required'}), 400

#         new_status = data['status'].lower()
#         return_request.status = new_status

#         # ✅ Find user
#         user = UserTable.query.get(return_request.user_id)
#         if not user:
#             return jsonify({'message': 'User not found'}), 404

#         # ✅ Update SizeTable if accepted
#         if new_status == ReturnStatus.ACCEPTED:
#             size_entry = SizeTable.query.filter_by(product_id=return_request.product_id).first()
#             if size_entry:
#                 size_entry.quantity += 1
#                 db.session.add(size_entry)

#         db.session.commit()

#         # ✅ Send email after DB commit
#         subject, text_content = generate_return_email_content(new_status, return_request.order_id)
#         send_email(user.email, subject, text_content)

#         return jsonify({'message': 'Return status updated and email sent successfully'}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

# 📌 Route __Accept or Reject Return Request**
@auth.route('/api/updateReturn/v1/<int:return_id>', methods=['PUT'])
def update_return_status(return_id):
    data = request.get_json()
    try:
        return_request = ReturnTable.query.get(return_id)
        if not return_request:
            return jsonify({'message': 'Return request not found'}), 404

        # ✅ Check if status is valid (ACCEPTED / REJECTED)
        if 'status' not in data or data['status'].lower() not in [s.value for s in ReturnStatus]:
         return jsonify({'message': 'Valid status (accepted/rejected) required'}), 400

        return_request.status = data['status'].lower()  # ✅ Convert to lowercase

        
        # ✅ If return is accepted, increase quantity in SizeTable
        if return_request.status == ReturnStatus.ACCEPTED:
            size_entry = SizeTable.query.filter_by(product_id=return_request.product_id).first()
            if size_entry:
                size_entry.quantity += 1  # ✅ Increase size-specific quantity
                db.session.add(size_entry)

        db.session.commit()
        return jsonify({'message': 'Return status updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

# 📌 Route __Delete Return Request (Admin Only)**
@auth.route('/api/deleteReturn/v1/<int:return_id>', methods=['DELETE'])
def delete_return(return_id):
    try:
        return_request = ReturnTable.query.get(return_id)
        if not return_request:
            return jsonify({'message': 'Return request not found'}), 404

        db.session.delete(return_request)
        db.session.commit()
        return jsonify({'message': 'Return request deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500
