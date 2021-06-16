from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import  fields

from app.models.ProductHistoryModel import ProductHistoryModel
# from app.models.schemas.ProductSchema import ProductSchema


class ProductHistorySchema(SQLAlchemySchema):
    # product = fields.Nested(ProductSchema)
    class Meta:
        model = ProductHistoryModel
        # load_instance = True
    id = auto_field()
    price = auto_field()
    is_stock = auto_field()
    created_at = auto_field()
    error = auto_field()