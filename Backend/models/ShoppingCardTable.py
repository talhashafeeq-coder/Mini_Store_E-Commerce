from models.Config import db
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float , String
from sqlalchemy.orm import relationship
import datetime

# ✅ Shopping Cart Table
class ShoppingCardTable(db.Model):
    __tablename__ = 'shopping_card'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # User ID who owns the cart
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # ✅ Correct Relationships
    user = relationship('UserTable', back_populates='shopping_card')
    shopping_card_details = relationship('ShoppingCardDetailTable', back_populates='shopping_card', cascade="all, delete-orphan")
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

    def __repr__(self):
        return f'<ShoppingCardTable {self.id}> - {self.user_id}'

# ✅ Shopping Cart Details Table (Product Details Inside Cart)
class ShoppingCardDetailTable(db.Model):
    __tablename__ = 'shopping_card_details'

    id = Column(Integer, primary_key=True)
    shopping_card_id = Column(Integer, ForeignKey('shopping_card.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    size = Column(String(50), nullable=False)
    price_at_time = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    total_price = Column(Float, nullable=False)

    # ✅ Correct Relationships
    product = relationship('ProductTable', back_populates='shopping_card_details')
    shopping_card = relationship('ShoppingCardTable', back_populates='shopping_card_details')

    def serialize(self):
        return {
            'id': self.id,
            'shopping_card_id': self.shopping_card_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'price_at_time': self.price_at_time,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'total_price': self.total_price,
            'size': self.size,
            'product': self.product
        }

    def __repr__(self):
        return f'<ShoppingCardDetailTable {self.id}> - {self.shopping_card_id} - {self.product_id} - {self.size}'
