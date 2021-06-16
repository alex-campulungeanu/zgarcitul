from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields

from app.models.UserModel import UserModel
from app.models.schemas.RoleSchema import RoleSchema

class UserSchema(SQLAlchemySchema):
    class Meta:
        model = UserModel
        # load_instance = True
    id = auto_field()
    name = auto_field()
    email = auto_field()
    created_at = auto_field()
    modified_at = auto_field()
    role = fields.Pluck(RoleSchema, 'name')