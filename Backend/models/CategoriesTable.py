from models.Config import db
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime


class CategoriesTable(db.Model):
    __tablename__ = 'categories'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)

    # Relationships
    products = relationship('ProductTable', back_populates='category', lazy='joined') 
    subcategories = relationship('SubCategoriesTable', back_populates='category', lazy='joined')

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'products': [product.serialize() for product in self.products]
        }



class SubCategoriesTable(db.Model):
    __tablename__ = 'subcategories'
    
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)  
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=False)
    stock = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)
    created_at = Column(String(255), default=datetime.now()) 
    status = Column(Enum('active', 'inactive', name='enum_status'), default='active')
    image_url = Column(String(500), nullable=False)

    # Relationships
    category = relationship('CategoriesTable', back_populates='subcategories')
    # sizes = relationship('SizeTable', back_populates='subcategory', lazy='joined')  
    products = relationship('ProductTable', back_populates='subcategory', lazy='joined')

    def serialize(self):
        return {
            'id': self.id,
            'category_id': self.category_id,
            'name': self.name,
            'description': self.description,
            'stock': self.stock,
            'price': self.price,
            'image_url': self.image_url,
            'created_at': self.created_at,
            'status': self.status.name if isinstance(self.status, Enum) else self.status,  
            'products': [product.serialize() for product in self.products]
        }

class SizeTable(db.Model):
    __tablename__ = 'sizes'
    
    id = Column(Integer, primary_key=True)
    size = Column(String(50), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, nullable=False)

    # Relationships
    product = relationship('ProductTable', back_populates='sizes', lazy='joined')  # Updated to 'sizes'

    def serialize(self):
        return {
            'id': self.id,
            'size': self.size,
            'product_id': self.product_id,
            'quantity': self.quantity
        }