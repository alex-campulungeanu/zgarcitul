from app import app
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()
cfg_db_name= app.config['DB_NAME']

# def initialize_db(app):
#     db.init_app(app)
# initialize_db()

##You can add here all the models and in View can use: from app.models. import UserModel  
from .UserModel import UserModel
from .RoleModel import RoleModel, role_permission
from .PermissionModel import PermissionModel
# from .UserProductModel import UserProductModel
# from .ProductModel import ProductModel
# from .VendorModel import VendorModel
# from .ProductHistoryModel import ProductHistoryModel
from .UserTokenModel import UserTokenModel