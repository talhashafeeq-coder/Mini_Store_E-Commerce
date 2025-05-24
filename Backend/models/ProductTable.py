from models.Config import db
from sqlalchemy import Column, Integer, String , ForeignKey, Numeric
from sqlalchemy.orm import relationship

class ProductTable(db.Model):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    price = Column(Numeric(10 , 2), nullable=False)
    description = Column(String(1200), nullable=False)
    stock_quantity = Column(Integer, nullable=False)
    image_url = Column(String(255), nullable=False)  # Product-specific image
    old_price = Column(Numeric(10 , 2), nullable=True)
    discount = Column(Numeric(10 , 2), default=0)
    mrsp = Column(Numeric(10 , 2), default=0)

    # Foreign key to link with CategoriesTable and SubCategoriesTable
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    subcategory_id = Column(Integer, ForeignKey('subcategories.id'), nullable=False)
    
    # Relationships
    category = relationship('CategoriesTable', back_populates='products')
    product_details = relationship('ProductDetailTable', back_populates='product', lazy='joined')
    shopping_card_details = relationship('ShoppingCardDetailTable', back_populates='product', lazy='joined')
    subcategory = relationship('SubCategoriesTable', back_populates='products', lazy='joined')
    orders = relationship('OrderDetailTable', back_populates='product', lazy='joined')
    sizes = relationship('SizeTable', back_populates='product', lazy='joined')  # Updated to 'sizes'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'stock_quantity': self.stock_quantity,
            'image_url': self.image_url,
            'category_id': self.category_id,
            'subcategory_id': self.subcategory_id,
            'discount': self.discount or 0,
            'mrsp': self.mrsp or 0,
            'old_price': self.old_price,
            'product_details': [detail.serialize() for detail in self.product_details],
            'sizes': [size.serialize() for size in self.sizes]  # Include sizes in serialized output
        }
class ProductDetailTable(db.Model):
    __tablename__ = 'product_details'
    
    id = Column(Integer, primary_key=True)  # Unique ID for each product detail
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)  # Foreign key linking to ProductTable
    
    attribute_name = Column(String(255), nullable=False)  # Name of the product attribute (e.g., "Color", "Material")
    attribute_value = Column(String(255), nullable=False)  # Value of the attribute (e.g., "Red", "Cotton")

    # Relationship with ProductTable
    product = relationship('ProductTable', back_populates='product_details')

    def serialize(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'attribute_name': self.attribute_name,
            'attribute_value': self.attribute_value
        }
