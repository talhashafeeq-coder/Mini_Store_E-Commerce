from flask import jsonify, Blueprint, request
from models.Config import db
from models.UserTable import UserTable, check_password_hash, generate_password_hash, UserDetailTable
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import logging

auth = Blueprint('user', __name__)

# 📌 Route __Create User**
# 📌 Register Route Post 
@auth.route('/api/register/v1', methods=['POST'])
def register():
    data = request.get_json()

    try:
        username = data.get('username')
        password = data.get('password')  # Correctly use the user-provided password
        email = data.get('email')
        role = data.get('role', 'customer')  # Default to 'customer' if not provided
        address = data.get('address')

        # Check if all required fields are present
        if not all([username, password, email, role, address]):
            return jsonify({'message': 'Missing required fields'}), 400

        # Check if user already exists
        existing_user = UserTable.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400

        # Hash the user-provided password before storing it
        password_hash = generate_password_hash(password, method='scrypt')

        # Create a new user with the hashed password
        new_user = UserTable(username=username, email=email, role=role, address=address, password_hash=password_hash)

        # Add user to the session and commit
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500


# logging.basicConfig(level=logging.DEBUG)
# 📌 Route __ Get user Route
@auth.route('/api/user/v1', methods=['GET'])
def get_users():
    try:
        users = UserTable.query.all()
        return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# 📌 Route __ DELETE User Route
@auth.route('/api/user/v1/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = UserTable.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


# 📌 Route __ UPDATE User Route
@auth.route('/api/user/v1/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user = UserTable.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.json
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        user.address = data.get('address', user.address)

        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
# 📌 Route __ Login Route Post
@auth.route('/api/login/v1', methods=['POST'])
def login():
    data = request.get_json()

    try:
        username = data.get('username')
        password = data.get('password')

        if not all([username, password]):
            return jsonify({'message': 'Missing required fields'}), 400

        user = UserTable.query.filter_by(username=username).first()
        if user:
            print(f"User found: {user.username}")
            print(f"Password Hash from DB: {user.password_hash}")
            print(f"Password from Login Request: {password}")

            # Check if the password is correct
            if check_password_hash(user.password_hash, password):
                print("Password check passed")
                access_token = create_access_token(identity=user.id)
                return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
            else:
                print("Password check failed")

        return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        logging.error(f"Exception occurred: {str(e)}")
        return jsonify({'message': str(e)}), 500

# 📌 Route __ Profile Route
@auth.route('/api/profile/v1', methods=['GET'])
@jwt_required()  # Ensure user is logged in
def profile():
    try:
        user_id = get_jwt_identity()  # Get user ID from JWT

        user = UserTable.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'address': user.address
        })

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
# 📌 Route __ User Detail Route
@auth.route('/api/userdetail/v1', methods=['POST'])
# @jwt_required()
def post_user_detail():
    try:
        data = request.get_json()

        # Validate required fields (excluding default_label and created_at)
        required_fields = ['street_address', 'city', 'state', 'postal_code', 'country', 'phone_number', 'user_id']
        if not all(data.get(field) for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        street_address = data['street_address']
        city = data['city']
        state = data['state']
        postal_code = data['postal_code']
        country = data['country']
        phone_number = data['phone_number']
        default_label = data.get('default_label', 'Home')  # Optional with default value
        user_id = data['user_id']

        # Check if user exists
        user = UserTable.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Allow multiple addresses per user (no duplicate restriction)
        new_user_detail = UserDetailTable(
            street_address=street_address,
            city=city,
            state=state,
            postal_code=postal_code,
            country=country,
            phone_number=phone_number,
            default_label=default_label,
            user_id=user_id
        )

        # Add and commit
        db.session.add(new_user_detail)
        db.session.commit()

        return jsonify({'message': 'User detail created successfully'}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500

# 📌 Route __Get all user details
@auth.route('/api/userdetail/v1', methods=['GET'])
# @jwt_required()
def get_user_details():
    try:
        user_details = UserDetailTable.query.all()
        return jsonify([user_detail.serialize() for user_detail in user_details]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
# 📌 Route __Logout Route
@auth.route('/api/logout/v1', methods=['POST'])
@jwt_required()
def logout():
    try:
        current_user = get_jwt_identity()
        return jsonify({"message": f"User {current_user} logged out successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500