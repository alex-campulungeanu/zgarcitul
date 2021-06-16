from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

from app.models.RoleModel import RoleModel


class RoleSchema(SQLAlchemySchema):
    class Meta:
        model = RoleModel
        # load_instance = True
    id = auto_field()
    name = auto_field()