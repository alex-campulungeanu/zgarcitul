# from app.exceptions.authentication_http_exception import AuthenticationHttpException
from flask import json
from werkzeug.exceptions import (
    BadRequest, NotFound, InternalServerError,
    TooManyRequests, MethodNotAllowed,
    Unauthorized, HTTPException
)

from app.utils.response import resp_json
from app.models import db

def http_handler(app):
    @app.errorhandler(HTTPException)
    def handle_exception(e):
        """Return JSON instead of HTML for HTTP errors."""
        # start with the correct headers and status code from the error
        response = e.get_response()
        # replace the body with JSON
        response.data = json.dumps({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        })
        response.content_type = "application/json"
        return response
    
    @app.errorhandler(BadRequest.code)
    def bad_request(error):
        return resp_json(
            message="Error 400: Bad request",
            success=False,
            code=BadRequest.code,
        )

    @app.errorhandler(Unauthorized.code)
    def unauthenticated(error):
        return resp_json(
            message="Error 401: Unauthenticated",
            success=False,
            code=Unauthorized.code,
        )

    @app.errorhandler(NotFound.code)
    def not_found(error):
        return resp_json(
            message="Error 404: Page not found OOPs",
            success=False,
            code=NotFound.code,
        )

    @app.errorhandler(MethodNotAllowed.code)
    def method_not_allowed(error):
        return resp_json(
            message="Error 405: Method not allowed",
            success=False,
            code=MethodNotAllowed.code,
        )

    @app.errorhandler(TooManyRequests.code)
    def too_many_request(error):
        return resp_json(
            message="429 Too Many Requests",
            success=False,
            code=TooManyRequests.code,
        )

    @app.errorhandler(InternalServerError.code)
    def internal_server_error(error):
        return resp_json(
            message="Error 500: Internal server error",
            success=False,
            code=InternalServerError.code,
        )

    # @app.errorhandler(db.DoesNotExist)
    # def model_not_exist(error):
    #     return resp_json(
    #         message=f"Value dont exist {error}",
    #         success=False,
    #         code=InternalServerError.code,
    #     )


# @app.errorhandler(AuthenticationHttpException)
# def handle_authentication_http_exception(error):
#     return respond_json(
#         success=False,
#         code=error.status_code,
#         message=error.message,
#         errors=error.errors
#     )