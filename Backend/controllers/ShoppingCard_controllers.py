from flask import jsonify, Blueprint, request
from models.Config import db
from models.ProductTable import ProductTable
from models.ShoppingCardTable import ShoppingCardTable , ShoppingCardDetailTable
import datetime
from flask_jwt_extended import jwt_required

auth = Blueprint('shoppingcard', __name__)

# 📌 Route __ Create ShoppingCard
@auth.route('/api/shoppingCard/v1', methods=['POST'])
def create_shopping_card():
    try:
        # Get request data
        data = request.json
        user_id = data.get('user_id')
        product_id = data.get('product_id')
        size = data.get('size')  # Get the selected size
        quantity = data.get('quantity', 1)

        # Validate required fields
        if not user_id or not product_id or not size:
            return jsonify({'message': 'Missing required fields: user_id, product_id, or size!'}), 400

        # Lock the product row for update to prevent race conditions
        product = db.session.query(ProductTable).filter_by(id=product_id).with_for_update().first()

        if not product:
            return jsonify({'message': 'Product not found!'}), 404

        # Check if the selected size is in stock
        size_data = next((item for item in product.sizes if item.size == size), None)  # Use dot notation
        if not size_data:
            return jsonify({'message': 'Invalid size!'}), 400

        if size_data.quantity < quantity:  # Use dot notation
            return jsonify({'message': 'Insufficient stock for the selected size!'}), 400

        price_at_time = product.price

        # Check if the user already has a shopping card
        shopping_card = ShoppingCardTable.query.filter_by(user_id=user_id).first()
        if not shopping_card:
            # Create a new shopping card if it doesn't exist
            shopping_card = ShoppingCardTable(user_id=user_id)
            db.session.add(shopping_card)
            db.session.commit()

        # Check if the product with the same size exists in the shopping cart
        existing_item = ShoppingCardDetailTable.query.filter_by(
            shopping_card_id=shopping_card.id,
            product_id=product_id,
            size=size  # Check for the same size
        ).first()

        if existing_item:
            # Correctly increment quantity instead of doubling it
            existing_item.quantity += quantity
            existing_item.total_price = existing_item.quantity * existing_item.price_at_time
            existing_item.updated_at = datetime.datetime.utcnow()
        else:
            # Add the product to the shopping cart if it's not in the cart
            total_price = price_at_time * quantity
            card_item = ShoppingCardDetailTable(
                shopping_card_id=shopping_card.id,
                product_id=product_id,
                size=size,  # Include the selected size
                quantity=quantity,
                price_at_time=price_at_time,
                total_price=total_price
            )
            db.session.add(card_item)

        db.session.commit()

        # Update the stock for the selected size
        # size_data.quantity -= quantity  # Use dot notation
        # db.session.commit()

        return jsonify({'message': 'Item added to shopping cart successfully!'}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")  # Log the error for debugging
        return jsonify({'message': str(e)}), 500    
# 📌 Route __ Get all shopping card items
@auth.route('/api/shoppingCard/v1', methods=['GET'])
def get_shopping_card():
    try:
        # Query all shopping cards (for the current user, you might want to filter by user_id)
        shopping_cards = ShoppingCardTable.query.all()
        
        # Prepare the response
        response = []
        
        for shopping_card in shopping_cards:
            # Get all details for each shopping card
            shopping_card_details = ShoppingCardDetailTable.query.filter_by(shopping_card_id=shopping_card.id).all()

            items = []
            total_price = 0  # Initialize total price for the cart
            
            for item in shopping_card_details:
                # Add item details to the items list
                items.append({
                    'product_id': item.product_id,
                    'product_name': item.product.name,
                    'product_image': item.product.image_url,
                    'size': item.size,  # Include size
                    'quantity': item.quantity,
                    'price_at_time': item.price_at_time,
                    'total_price': item.total_price,
                    'updated_at': item.updated_at.isoformat(),
                })
                total_price += item.total_price  # Accumulate total price
            
            # Add shopping card info along with its items and total price
            response.append({
                'cart_id': shopping_card.id,
                'user_id': shopping_card.user_id,
                'created_at': shopping_card.created_at.isoformat(),
                'updated_at': shopping_card.updated_at.isoformat(),
                'total_price': total_price,  # Total price of all items in the cart
                'items': items  # List of items in the cart
            })
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500    
# 📌 Route __ Route to get the card details for a user
@auth.route('/api/shoppingCard/v1/<int:user_id>', methods=['GET'])
def get_shoppingcard(user_id):
    try:
        cart = ShoppingCardTable.query.filter_by(user_id=user_id).first()
        if not cart:
            return jsonify({'message': 'Shopping card not found!'}), 404
        
        # Retrieve the card details (products in the card)
        card_details = ShoppingCardDetailTable.query.filter_by(shopping_card_id=cart.id).all()
        
        # Serialize the card details
        cart_data = {
            'cart_id': cart.id,
            'user_id': cart.user_id,
            'created_at': cart.created_at.isoformat(),
            'updated_at': cart.updated_at.isoformat(),
            'items': []
        }
        
        for item in card_details:
            cart_data['items'].append({
                'product_id': item.product.id,
                'name': item.product.name,
                'size': item.size,  # Include size
                'quantity': item.quantity,
                'price_at_time': item.price_at_time,
                'total_price': item.price_at_time * item.quantity,
                'created_at': item.created_at.isoformat(),
                'updated_at': item.updated_at.isoformat()
            })
            
        return jsonify(cart_data), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500    
# 📌 Route __  to remove an item from the cart
@auth.route('/api/shoppingCard/v1/<int:user_id>/<int:product_id>', methods=['DELETE'])
def remove_item_from_cart(user_id, product_id):
    try:
        print(f"Deleting product {product_id} from user {user_id}")
        
        # Fetch the cart for the user
        cart = ShoppingCardTable.query.filter_by(user_id=user_id).first()
        if not cart:
            print("Shopping cart not found!")
            return jsonify({'message': 'Shopping cart not found!'}), 404
        
        # Query the item in the shopping card details using the correct column name
        item = ShoppingCardDetailTable.query.filter_by(shopping_card_id=cart.id, product_id=product_id).first()
        if not item:
            print("Item not found in the cart!")
            return jsonify({'message': 'Item not found in the cart!'}), 404

        # Delete the item from the cart
        db.session.delete(item)
        db.session.commit()

        return jsonify({'message': 'Item removed from the cart successfully!'}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
