from models.Config import db
from sqlalchemy import Column, Integer, Float, String, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
import enum
from datetime import datetime, timezone
from flask import jsonify

class OrderStatus(enum.Enum):
    PENDING = "pending"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(enum.Enum):
    CREDIT_CARD = "Credit_Card"
    PAYPAL = "PayPal"
    CASH_ON_DELIVERY = "Cash_on_Delivery"

class OrderTable(db.Model):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    order_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    shipping_address = Column(Text, nullable=False)
    billing_address = Column(Text, nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False, default=PaymentMethod.PAYPAL)
    tracking_number = Column(String(50), nullable=True)

    # Relationship 
    order_items = relationship('OrderDetailTable', back_populates='order', lazy='select')
    user = relationship('UserTable', back_populates='orders', lazy='joined')
    returns = relationship('ReturnTable', back_populates='order', lazy='joined')
    

    def serialize(self):
     return {
        "id": self.id,
        "user_id": self.user.username if self.user else None,
        "total_amount": float(self.total_amount),  # Ensure JSON serialization
        "status": self.status.value , # ✅ Fix
        "payment_status": self.payment_status.value ,  # ✅ Fix
        "order_date": self.order_date.strftime("%Y-%m-%d %H:%M:%S"),
        "shipping_address": self.shipping_address,
        "billing_address": self.billing_address,
        "payment_method": self.payment_method.value if isinstance(self.payment_method, Enum) else str(self.payment_method),  # ✅ Fix
        "tracking_number": self.tracking_number,
        "order_items": [item.serialize() for item in self.order_items]  # Serialize related order items
    }



class OrderDetailTable(db.Model):
    __tablename__ = 'order_details'

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    discount = Column(Float, nullable=False, default=0.0)

    # Relationships
    order = relationship('OrderTable', back_populates='order_items', lazy='joined')
    product = relationship('ProductTable', back_populates='orders', lazy='joined')

    @hybrid_property
    def subtotal(self):
        return self.quantity * self.unit_price * (1 - (self.discount or 0.0))

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product.name if self.product else None,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "subtotal": self.subtotal,
            "discount": self.discount
        }