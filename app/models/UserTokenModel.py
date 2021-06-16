from app.models import db
from app.models.mixins.TimestampMixin import TimestampMixin
from app.models.UserModel import UserModel


class UserTokenModel(TimestampMixin, db.Model):
    __tablename__ = 'user_token'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    access_token = db.Column(db.String(80), unique=True)

    def __repr__(self):
        return "<UserTokenModel %r>" % (self.token)