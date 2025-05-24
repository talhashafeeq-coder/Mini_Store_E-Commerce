from models.Config import db
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
import datetime 

class UserTable(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    role = Column(String(50), nullable=False, default='customer')  # Options: admin, customer
    address = Column(String(120), nullable=False)
    
    # Relationship 
    orders = relationship('OrderTable', back_populates='user', lazy='joined') 
    user_details = relationship('UserDetailTable', back_populates='user', lazy='joined') 
    shopping_card = relationship('ShoppingCardTable', back_populates='user' , lazy='joined')
    returns = relationship('ReturnTable', back_populates='user', lazy='joined')

    def set_password(self, password):
        """Set hashed password."""
        self.password_hash = generate_password_hash(password, method='scrypt')

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'address': self.address
        }

    def __repr__(self):
        return f'<User {self.username}>'

class UserDetailTable(db.Model):
    __tablename__ = 'user_details'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    street_address = Column(String(120), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    postal_code = Column(String(10), nullable=False)
    country = Column(String(50), nullable=False)
    phone_number = Column(String(20), nullable=False)
    default_label = Column(String(50), nullable=True, default='Home')  # Allowing custom labels
    created_at = Column(DateTime, default=datetime.datetime.utcnow)  # Fix datetime reference
    
    user = relationship('UserTable', back_populates='user_details', lazy='joined')
    
    def serialize(self):
        return {
            'id': self.id,
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'phone_number': self.phone_number,
            'default_label': self.default_label,
            'created_at': self.created_at.isoformat()  # Ensuring proper JSON serialization
        }
