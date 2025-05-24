from models.Config import db
from sqlalchemy import Column, Integer, String , ForeignKey,DateTime, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime, timezone

class ReturnStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class ReturnTable(db.Model):
    __tablename__ = 'return'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer , ForeignKey('users.id') , nullable=False)
    order_id = Column(Integer , ForeignKey('orders.id') , nullable=False)
    reason = Column(String(255) , nullable=False)
    status = Column(Enum(ReturnStatus) , nullable=False , default=ReturnStatus.PENDING)
    date = Column(DateTime , default=lambda: datetime.now(timezone.utc) , nullable=False)
    
    # Relationships
    user = relationship('UserTable' , back_populates='returns' , lazy='joined')
    order = relationship('OrderTable' , back_populates='returns' , lazy='joined')
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id ,
            'order_id': self.order_id,
            'reason': self.reason,
            'status': self.status.value,
            'date': self.date
        }
        
    