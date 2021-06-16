from flask import current_app, request
from werkzeug.exceptions import Unauthorized, Forbidden

from app.utils.response import resp_json, response_error, response_fail
from app.models.UserModel import UserModel


def jwt_handler(jwt):
    @jwt.invalid_token_loader
    def invalid_token_loader(callback):
        # return response_fail('Authentication token is invalid')
        current_app.logger.info('Token is invalid')
        current_app.logger.info(request.headers.get('Authorization', 'Token is not available in request'))
        return resp_json(
            success=False,
            message='Authentication token is invalid',
            code=Forbidden.code
        )

    @jwt.expired_token_loader
    def my_expired_token_callback():
        # token_type = expired_token['type']
        current_app.logger.info('Token is expired')
        return resp_json(
            success=False,
            message="Authentication token is expired",
            code=Forbidden.code
        )
        
    @jwt.unauthorized_loader
    def unauthorized_loader(callback):
        current_app.logger.info('unauthorized action')
        return response_fail('You are not authenticated !')
        # return resp_json(
        #     success=False,
        #     message="You dont't have a token",
        #     code=Unauthorized.code
        # )
        
    @jwt.user_loader_callback_loader
    def get_current_user(identity):
        if identity:
            return UserModel.query.filter_by(email=identity).first()
        else:
            return UserModel.query.filter(email="test@test.com") #TODO: remove this, is just for testing