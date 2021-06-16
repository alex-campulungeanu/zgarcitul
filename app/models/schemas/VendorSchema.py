from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

from app.models.VendorModel import VendorModel


class VendorSchema(SQLAlchemySchema):
    class Meta:
        model = VendorModel
        # load_instance = True
    id = auto_field()
    name = auto_field()