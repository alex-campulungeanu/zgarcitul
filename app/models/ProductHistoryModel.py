from datetime import datetime

from app.models import db
from app.models.mixins.TimestampMixin import TimestampMixin

class ProductHistoryModel(TimestampMixin, db.Model):
    __tablename__ = 'product_history'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    price = db.Column(db.DECIMAL(asdecimal=False))
    is_stock = db.Column(db.Integer)
    error = db.Column(db.String)
    product_model = db.relationship('ProductModel', backref='history_logs')
    def  __repr__(self):
        return "<ProductHistoryModel %r>" % (self.product_id)