from datetime import datetime

from app.models import db, UserModel, ProductModel
from app.models.mixins.TimestampMixin import TimestampMixin

class UserProductModel(TimestampMixin, db.Model):
    __tablename__ = 'user_product'
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id'), )
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    description = db.Column(db.String)
    alert_price_difference = db.Column(db.Integer)
    alert_stock = db.Column(db.Integer)
    # created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # user = db.relationship('UserModel', back_populates="products")
    # product = db.relationship('ProductModel', back_populates="users")

    # user = db.relationship("UserModel",  backref='users', lazy=True)
    # product = db.relationship("ProductModel", backref="products", lazy=True)
    def  __repr__(self):
        return "<User %r Product %r>" % (self.user_id, self.product_id)