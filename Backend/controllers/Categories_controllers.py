import os
from flask import jsonify, Blueprint, request,url_for
from models.Config import db
from werkzeug.utils import secure_filename
from models.CategoriesTable import CategoriesTable , SubCategoriesTable , SizeTable
from flask_jwt_extended import jwt_required

                                               # ✨ Create a Blueprint for category routes
auth = Blueprint('category', __name__)
UPLOAD_FOLDER = "static/uploads"  # Folder where images will be stored
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 📌 Route __ Create a new category
@auth.route('/api/category/v1', methods=['POST'])
def create_category():
    data = request.get_json()
    
    if 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400
    
    # Check if category already exists
    existing_category = CategoriesTable.query.filter_by(name=data['name']).first()
    if existing_category:
        return jsonify({'error': 'Category already exists'}), 409  # 409 Conflict

    new_category = CategoriesTable(name=data['name'])
    db.session.add(new_category)

    try:
        db.session.commit()
        return jsonify({'category': new_category.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# 📌 Route __ Get all categories
@auth.route('/api/category/v1', methods=['GET'])
def get_categories():
    try:
        # Fetch all categories
        categories = CategoriesTable.query.all()

        if not categories:
            return jsonify({"message": "No categories found", "status": "error"}), 404

        result = []
        for category in categories:
            subcategories = SubCategoriesTable.query.filter_by(category_id=category.id).all()

            result.append({
                "category_id": category.id,
                "category_name": category.name,
                "subcategories": [
                    {
                        "id": sub.id,
                        "name": sub.name,
                        "description": sub.description,
                        "stock": sub.stock,
                        "price": sub.price,
                        "image_url": sub.image_url,
                        "status": sub.status,
                        # "created_at": sub.creation_date.strftime('%Y-%m-%d') if sub.creation_date else None
                    }
                    for sub in subcategories
                ]
            })

        return jsonify({"status": "success", "categories": result}), 200

    except Exception as e:
        return jsonify({"message": "Database error", "error": str(e), "status": "error"}), 500
    
@auth.route('/api/category/v1/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = CategoriesTable.query.get_or_404(id)

    # Check if category has subcategories before deleting
    if SubCategoriesTable.query.filter_by(category_id=id).first():
        return jsonify({'error': 'Cannot delete category with existing subcategories'}), 400

    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted'}), 200

# 📌 Route __ Update a category
@auth.route('/api/category/v1/<int:id>', methods=['PUT'])
# @jwt_required()
def update_category(id):
    category = CategoriesTable.query.get_or_404(id)
    data = request.get_json()
    category.name = data.get('name', category.name)
    db.session.commit()
    return jsonify(category.serialize()), 200

# 📌 Route __ Create Subcategory 
@auth.route('/api/subcategory/v1', methods=['POST'])
def create_subcategory():
    print("Request form data:", request.form)  # Log form data
    print("Request files:", request.files)    # Log files

    # Check if image is present in the request
    if 'image' not in request.files:
        return jsonify({'message': 'Image file is required'}), 400

    file = request.files['image']

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)  # Full path
        file.save(file_path)

        # Generate image URL for frontend access
        image_url = url_for('static', filename=f"uploads/{filename}", _external=True)
    else:
        return jsonify({"message": "Invalid image format. Allowed formats: png, jpg, jpeg, gif"}), 400

    # Extract other fields from form data
    name = request.form.get('name')
    category_id = request.form.get('category_id')
    description = request.form.get('description')
    stock = request.form.get('stock')
    price = request.form.get('price')
    status = request.form.get('status')
    created_at = request.form.get('created_at')

    # Validate required fields
    required_fields = ['name', 'category_id', 'description', 'stock', 'price', 'status', 'created_at']
    if not all(request.form.get(field) for field in required_fields):
        return jsonify({'error': 'All fields are required'}), 400

    # Validate and convert category_id to integer
    try:
        category_id = int(category_id)  # Convert to integer
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid category_id value. Must be an integer.'}), 400

    # Find category ID from name
    category = CategoriesTable.query.filter_by(id=category_id).first()
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    # Ensure Enum is stored correctly
    if status not in ['active', 'inactive']:
        return jsonify({'error': 'Invalid status value'}), 400

    new_subcategory = SubCategoriesTable(
        name=name,
        category_id=category.id,
        description=description,
        stock=stock,
        price=price,
        image_url=image_url,  # ✅ Corrected
        status=status,
        created_at=created_at
    )

    db.session.add(new_subcategory)

    try:
        db.session.commit()
        return jsonify({'subcategory': new_subcategory.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
# 📌 Route __ Get all subcategories
@auth.route('/api/subcategory/v1', methods=['GET'])
def get_subcategories():
    try:
        subcategories = SubCategoriesTable.query.all()

        return jsonify([
            {
                'id': subcategory.id,
                'name': subcategory.name,
                'category_id': subcategory.category_id,
                'description': subcategory.description,
                'stock': subcategory.stock,
                'price': subcategory.price,
                'image_url': subcategory.image_url,
                'status': subcategory.status,
                'created_at': subcategory.created_at,
                'category': subcategory.category.serialize() if subcategory.category else None,  # ✅ Fix
            }
            for subcategory in subcategories
        ]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

 
# 📌 Route __ Get a subcategory by ID
@auth.route('/api/subcategory/v1/<int:id>', methods=['GET'])
def get_subcategory(id):
    try:
        subcategory = SubCategoriesTable.query.get_or_404(id)
        return jsonify({
            'id': subcategory.id,
            'name': subcategory.name,
            'category_id': subcategory.category_id,
            'description': subcategory.description,
            'stock': subcategory.stock,
            'price': subcategory.price,
            'image_url': subcategory.image_url,
            'status': subcategory.status,
            'created_at': subcategory.created_at
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# 📌 Route __delete subcategory by id
@auth.route('/api/subcategory/v1/<int:id>', methods=['DELETE'])
# @jwt_required()   # Ensure the request is authenticated
def delete_subcategory(id):
    try:
        subcategory = SubCategoriesTable.query.get_or_404(id)
        db.session.delete(subcategory)
        db.session.commit()
        return jsonify({'message': 'Subcategory deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 📌 Route __ Update a subcategory
@auth.route('/api/subcategory/category/v1', methods=['GET'])
def get_subcategories_by_category():
    try:
        category_id = request.args.get('category_id', type=int)
        query = SubCategoriesTable.query

        if category_id:
            query = query.filter_by(category_id=category_id)

        subcategories = query.all()
        results = [{
            'id': sub.id,
            'name': sub.name,
            'category_id': sub.category_id,
            'description': sub.description,
            'stock': sub.stock,
            'price': sub.price,
            'image_url': sub.image_url,
            'status': sub.status,
            'created_at': sub.created_at
        } for sub in subcategories]

        return jsonify(results), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# 📌 Route __Create a new size
@auth.route('/api/size/v1', methods=['POST'])
# @jwt_required()
def create_size():
    data = request.get_json()
    
    if 'size' not in data  not in data or 'product_id' not in data or 'quantity' not in data:
        return jsonify({'error': 'All fields are required'}), 400

    new_size = SizeTable(
        size=data['size'],
        product_id=data['product_id'],
        quantity=data['quantity']
    )

    db.session.add(new_size)
    try:
        db.session.commit()
        return jsonify({'message': 'Size added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
# 📌 Route __ Get all sizes
@auth.route('/api/size/v1', methods=['GET'])
def get_sizes():
    try:
        sizes = SizeTable.query.all()
        return jsonify([
            {
                'id': size.id,
                'size': size.size.split(', ') if isinstance(size.size, str) else [],  # Convert string to array
                'product_id': size.product_id,
                'quantity': size.quantity
            }
            for size in sizes
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# 📌 Route __delete size by id
@auth.route('/api/size/v1/<int:id>', methods=['DELETE'])
# @jwt_required()   # Ensure the request is authenticated    
def delete_size(id):
    try:
        size = SizeTable.query.get_or_404(id)
        db.session.delete(size)
        db.session.commit()
        return jsonify({'message': 'Size deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


    