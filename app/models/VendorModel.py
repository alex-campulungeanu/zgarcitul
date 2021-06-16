from app.models import db
from app.models.ProductModel import ProductModel

class VendorModel(db.Model):
    __tablename__ = 'vendor'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False, unique=True)
    active = db.Column(db.Integer, nullable=False, default=1)
    products = db.relationship('ProductModel', backref='vendor', lazy=True)
    def  __repr__(self):
        return "<Vendor %r>" % (self.name)
