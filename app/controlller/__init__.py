# from app.views.MainView import main as main_blueprint
# from app.views.ProductView import product as product_blueprint
# from app.views.ErrorsView import errors as errors_blueprint
# # from app.views.UserView import user_api as user_blueprint
# # from app.views.PostView import post_api as post_blueprint

from .product_controller import product as product_blueprint
from .authentication_controller import authentication as authentication_blueprint
from .main_controller import main as main_blueprint

def register_controller(app):
    app.register_blueprint(authentication_blueprint, url_prefix='/api/auth')
    app.register_blueprint(product_blueprint, url_prefix='/api/prod')
    app.register_blueprint(main_blueprint, url_prefix='/api')
    # app.register_blueprint(errors_blueprint)
    # app.register_blueprint(user_blueprint, url_prefix='/api')