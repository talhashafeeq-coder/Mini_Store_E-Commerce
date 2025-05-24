import os
from flask import jsonify, Blueprint, request,url_for 
from models.Config import db
from models.CategoriesTable import CategoriesTable , SubCategoriesTable , SizeTable
from models.ProductTable import ProductTable, ProductDetailTable
from werkzeug.utils import secure_filename 
from flask_jwt_extended import jwt_required


auth = Blueprint('product' , __name__)
UPLOAD_FOLDER = "static/uploads"  # Folder where images will be stored
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 📌 Route __ Create product 
@auth.route('/api/product/v1', methods=['POST'])
def create_product():
    # Check if an image file is provided
    if 'image' not in request.files:
        return jsonify({'message': 'Image file is required'}), 400

    file = request.files['image']

    # Validate and save the image file
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Ensure UPLOAD_FOLDER exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        image_url = url_for('static', filename=f"uploads/{filename}", _external=True)
    else:
        return jsonify({"message": "Invalid image format. Allowed formats: png, jpg, jpeg, gif"}), 400

    # Extract and validate form data
    try:
        name = request.form.get('name')
        price = float(request.form.get('price', 0))
        old_price = float(request.form.get('old_price', 0))
        discount = float(request.form.get('discount', 0))
        mrsp = float(request.form.get('mrsp', 0))
        description = request.form.get('description')
        stock_quantity = int(request.form.get('stock_quantity', 0))
        category_id = int(request.form.get('category_id'))
        subcategory_id = int(request.form.get('subcategory_id'))

        # Validate numeric fields
        if price < 0 or old_price < 0 or discount < 0 or mrsp < 0 or stock_quantity < 0:
            return jsonify({'error': 'Numeric values must be positive'}), 400

        # Validate required fields
        required_fields = ['name', 'price', 'description', 'stock_quantity', 'category_id', 'subcategory_id']
        if not all(request.form.get(field) for field in required_fields):
            return jsonify({'error': 'All fields are required'}), 400
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400

    # Find category by ID
    category = CategoriesTable.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    # Find subcategory by ID
    subcategory = SubCategoriesTable.query.get(subcategory_id)
    if not subcategory:
        return jsonify({'error': 'Subcategory not found'}), 404

    # Create new product
    new_product = ProductTable(
        name=name,
        price=price,
        old_price=old_price,
        discount=discount,
        mrsp=mrsp,
        description=description,
        stock_quantity=stock_quantity,
        category_id=category_id,
        subcategory_id=subcategory_id,
        image_url=image_url
    )

    db.session.add(new_product)

    try:
        db.session.commit()
        return jsonify({
            'message': 'Product created successfully!',
            'data': new_product.serialize()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
 # 📌 Route __ Get product    
@auth.route('/api/product/v1', methods=['GET'])
def get_product():
    try:
        products = ProductTable.query.all()
        
        result = []
        for product in products:
            result.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'description': product.description,
                'old_price': product.old_price,
                'discount': product.discount,
                'mrsp': product.mrsp,
                'stock_quantity': product.stock_quantity,
                'image_url': product.image_url,
                'category_id': product.category_id,
                'category_name': product.category.name if product.category else None,  # Handle None case
                'subcategory_id': product.subcategory_id,
                'subcategory_name': product.subcategory.name if product.subcategory else None,  # Handle None case
                'product_details': [detail.serialize() for detail in product.product_details]
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# 📌 Route __Get product by ID

@auth.route('/api/product/v1/<int:id>', methods=['GET'])
def get_product_by_id(id):
    try:
        # Fetch the product
        product = ProductTable.query.filter_by(id=id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        # Fetch sizes and stock for the product
        sizes = SizeTable.query.filter_by(product_id=id).all()

        # Serialize the product and include size information
        product_data = product.serialize()
        product_data['sizes'] = [size.serialize() for size in sizes]

        return jsonify({'product': product_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500    
# 📌 Route __ Update product by ID
@auth.route('/api/product/v1/<int:id>', methods=['PUT'])
def update_product(id):
    try:
        product = ProductTable.query.filter_by(id=id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        data = request.get_json()
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.description = data.get('description', product.description)
        product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
        product.category_id = data.get('category_id', product.category_id)
        db.session.commit()
        return jsonify({'message': 'Product updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
# 📌 Route __ Delete product by ID
@auth.route('/api/product/v1/<int:id>', methods=['DELETE'])
def delete_product(id):
    try:
        product = ProductTable.query.filter_by(id=id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    
# 📌 Route __ ProductDetailTable
@auth.route('/api/productdetail/v1', methods=['POST'])
def create_product_detail():
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        attribute_name = data.get('attribute_name')
        attribute_value = data.get('attribute_value')
        
        product = ProductTable.query.filter_by(id=product_id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        product_detail = ProductDetailTable(product_id=product_id, attribute_name=attribute_name, attribute_value=attribute_value)
        db.session.add(product_detail)
        db.session.commit()
        return jsonify({'message': 'Product detail created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
# 📌 Route __ Get productDetails
@auth.route('/api/productdetail/v1', methods=['GET'])
def get_product_details():
    try:
        product_get = ProductDetailTable.query.all()
        return jsonify([
            {
                'id': product.id,  # Fix: Access attributes of each object inside the loop
                'product_id': product.product.name,
                'attribute_name': product.attribute_name,
                'attribute_value': product.attribute_value
            } 
            for product in product_get  # Loop over the list
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Fix: Don't wrap error in a list
# 📌 Route __Get product details by product ID
@auth.route('/api/productdetail/v1/<int:id>', methods=['GET'])
def get_product_details_by_product_id(id):
    try:
        product_details = ProductDetailTable.query.filter_by(product_id=id).all()
        return jsonify([product_detail.serialize() for product_detail in product_details]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# 📌 Route __ Delete product detail by ID
@auth.route('/api/productdetail/v1/<int:id>', methods=['DELETE'])
def delete_product_detail(id):
    try:
        product_detail = ProductDetailTable.query.filter_by(id=id).first()
        if not product_detail:
            return jsonify({'error': 'Product detail not found'}), 404
        db.session.delete(product_detail)
        db.session.commit()
        return jsonify({'message': 'Product detail deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
