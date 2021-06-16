from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field, ModelSchema
from marshmallow import fields

from app.models.ProductModel import ProductModel
from app.models.schemas.VendorSchema import VendorSchema
from app.models.schemas.ProductHistorySchema import ProductHistorySchema

# class ProductSchema(ModelSchema):
#     class Meta:
#         model = ProductModel
class ProductSchema(SQLAlchemySchema):
    # history = fields.Nested('ProductHistorySchema', many=True)
    class Meta:
        model = ProductModel
        # load_instance = True
    id = auto_field()
    name = auto_field()
    url = auto_field()
    name = auto_field()
    created_at = auto_field()
    updated_at = auto_field()
    current_price = auto_field()
    current_is_stock = auto_field()
    min_price = auto_field()
    max_price = auto_field()
    active = auto_field()
    vendor = fields.Pluck(VendorSchema, 'name')
    # history = fields.List(fields.Nested(ProductHistorySchema))
    history = fields.Nested(ProductHistorySchema, many=True)