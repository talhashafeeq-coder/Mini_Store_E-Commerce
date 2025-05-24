from flask import Blueprint, request, jsonify
from models.OrdersTable import OrderTable, OrderDetailTable, PaymentMethod, PaymentStatus, OrderStatus
from models.CategoriesTable import SizeTable
from models.Config import db
from models.ProductTable import ProductTable
from datetime import datetime, timezone
import random
import string
from decimal import Decimal
from sqlalchemy import func


def generate_tracking_number(order_id):
    """Generate a unique tracking number using Order ID + Random String"""
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"TRK-{order_id}-{random_suffix}"

auth = Blueprint('order', __name__)
# 📌  route Create order

@auth.route('/api/order/v1', methods=['POST'])
def create_order():
    data = request.get_json()

    try:
        if not data or 'user_id' not in data or 'order_items' not in data:
            return jsonify({'message': 'User ID and order items are required'}), 400

        new_order = OrderTable(
            user_id=data['user_id'],
            total_amount=Decimal('0.0'),
            status=OrderStatus.PENDING,
            payment_status=PaymentStatus.PENDING,
            shipping_address=data.get('shipping_address', ''),
            billing_address=data.get('billing_address', ''),
            payment_method=data.get('payment_method', PaymentMethod.PAYPAL)
        )

        db.session.add(new_order)
        db.session.flush()

        new_order.tracking_number = generate_tracking_number(new_order.id)
        total_amount = Decimal('0.0')

        for item_data in data['order_items']:
            product = ProductTable.query.get(item_data['product_id'])

            # ✅ Validate Product
            if not product:
                return jsonify({'error': f'Product with ID {item_data["product_id"]} not found'}), 400

            # ✅ Validate Size (Ensure 'size' exists in request)
            if 'size' not in item_data:
                return jsonify({'error': 'Size is required for each order item'}), 400

            size = SizeTable.query.filter_by(product_id=item_data['product_id'], size=item_data['size']).first()

            if not size:
                return jsonify({'error': f'Size {item_data["size"]} not found for Product ID {item_data["product_id"]}'}), 400

            quantity = item_data['quantity']

            # ✅ Check Stock from SizeTable
            if size.quantity < quantity:
                return jsonify({'error': f'Insufficient stock for Product ID {item_data["product_id"]} and Size {item_data["size"]}'}), 400

            unit_price = product.price  # Price is already a Decimal
            discount = Decimal(str(item_data.get('discount', 0.0)))

            total_amount += (unit_price * quantity) - discount

            order_item = OrderDetailTable(
                order_id=new_order.id,
                product_id=product.id,
                quantity=quantity,
                unit_price=unit_price,
                discount=discount
            )
            db.session.add(order_item)

            # ✅ Deduct stock from `SizeTable`
            size.quantity -= quantity

        new_order.total_amount = total_amount
        db.session.commit()

        return jsonify({
            'message': 'Order created successfully',
            'tracking_number': new_order.tracking_number
        }), 201

    except Exception as e:
        import traceback
        print("Error:", traceback.format_exc())
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# 📌 Route __ Get all orders
@auth.route('/api/order/v1', methods=['GET'])
def get_orders():
    try:
        orders = OrderTable.query.all()
        return jsonify([order.serialize() for order in orders]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# 📌 Route __ Update the status of an order
@auth.route('/api/sales-profit', methods=['GET'])
def get_sales_profit():
    try:
        results = (
            db.session.query(
                func.sum(OrderDetailTable.unit_price * OrderDetailTable.quantity).label("total_sales"),
                func.sum(((OrderDetailTable.unit_price - ProductTable.mrsp) * OrderDetailTable.quantity) - (OrderDetailTable.discount * OrderDetailTable.quantity)).label("total_profit")
            )
            .join(ProductTable, OrderDetailTable.product_id == ProductTable.id)
            .first()
        )

        total_sales = results.total_sales if results.total_sales else 0
        total_profit = results.total_profit if results.total_profit else 0

        return jsonify({
            "total_sales": total_sales,
            "total_profit": total_profit
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
# 📌 Route __ Get order by ID
@auth.route('/api/order/v1/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = OrderTable.query.get(order_id)
    if order:
        return jsonify(order.serialize()), 200
    else:
        return jsonify({'message': 'Order not found'}), 404
    
# 📌 Route __ Update the status of an order
@auth.route('/api/order/v1/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.get_json()
    order = OrderTable.query.get(order_id)

    if not order:
        return jsonify({'message': 'Order not found'}), 404

    new_status = data.get('status')
    if not new_status:
        return jsonify({'message': 'Status is required'}), 400

    # ✅ Validate if status is in OrderStatus Enum
    valid_statuses = [status.value for status in OrderStatus]
    if new_status not in valid_statuses:
        return jsonify({'message': f'Invalid status. Allowed values: {valid_statuses}'}), 400

    try:
        order.status = OrderStatus(new_status)  # Update status safely
        db.session.commit()
        return jsonify({'message': 'Order status updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
# 📌 Route __ Delete an order
@auth.route('/api/order/v1/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = OrderTable.query.get(order_id)
    
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    
    try:
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 