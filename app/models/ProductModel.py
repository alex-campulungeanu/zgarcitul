from app.models import db
from app.models.mixins.TimestampMixin import TimestampMixin
from app.shared.helper import generate_random_string


# class PriceHistoryDocument(db.EmbeddedDocument):
#     create_date=db.DateTimeField(required=True, default=get_current_date)
#     price=db.StringField(required=True)
#     error=db.StringField(required=True, default='')

# class AlertTypeDocument(db.EmbeddedDocument):
#     price_difference = db.IntField()
#     is_stoc = db.IntField(choices=(0, 1)) # TODO: change the validation error message for CHOICES or add custom validation for stoc in [0, 1], maybe with value_min and value_max from mongoengine

# class SubscribedListDocument(db.EmbeddedDocument):
#     email = db.EmailField()
#     alert_type = db.EmbeddedDocumentField(AlertTypeDocument)

class ProductModel(TimestampMixin, db.Model):
    __tablename__ = 'product'
    __table_args__ = (db.UniqueConstraint('url', 'user_id'), )
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False, default=generate_random_string)
    url = db.Column(db.String(2048), nullable=False)
    # created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # modified_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    current_price = db.Column(db.DECIMAL(asdecimal=False), default=0)
    current_is_stock = db.Column(db.Integer, default=1)
    max_price = db.Column(db.Integer, default=0)
    min_price = db.Column(db.Integer, default=0)
    active = db.Column(db.Integer, nullable=False, default=1)
    # users = db.relationship('UserProductModel', back_populates='product') 
    history = db.relationship('ProductHistoryModel', backref='product', lazy=False)


    # subscribed_list= db.EmbeddedDocumentListField(SubscribedListDocument)
    # price_history = db.EmbeddedDocumentListField(PriceHistoryDocument)
    def  __repr__(self):
        return "<Product %r>" % (self.name)