from models.Config import db
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
import datetime

class PaymentTable(db.Model):
    __tablename__ = 'payments'
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, db.ForeignKey('orders.id'), nullable=False)
    amount = Column(Integer, nullable=False)
    payment_date = Column(db.DateTime, nullable=False , default=datetime.datetime.now())
    payment_method = Column(String(50), nullable=False) # Ex: Credit Card, Debit Card, Cash
    status = Column(String(50), nullable=False , default='pending')
    
    order = relationship('OrderTable', backref='payment', lazy='joined')
    
    def serialize(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'amount': self.amount,
            'payment_date': self.payment_date,
            'payment_method': self.payment_method,
            'status': self.status
        }