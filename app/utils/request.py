import json
from functools import wraps
from cerberus import Validator

from flask import request, abort, Response, jsonify, current_app
from app.utils.response import response_fail

def validate_request_custom(*expected_args):
    """ Validate requests decorator """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            json_obj = request.get_json()
            for expected_arg in expected_args:
                if json_obj is None or json_obj.get(expected_arg) is None or expected_arg not in json_obj:
                    return response_fail(f"You must call with all request params: {', '.join(expected_args)}")
            return func(*args, **kwargs)
        return wrapper
    return decorator

def validate_request_cerberus(schema):
    """ Validate requests decorator with Cerberus"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            body_json = request.get_json()
            current_app.logger.info(body_json)
            v = Validator(schema, require_all=True)
            v.allow_unknown = True # TODO: allow request params other then the ones defined on the schema level
            if not v.validate(body_json):
                valid_params_list = ', '.join(schema.keys())
                return response_fail(f"You must call with all request params: {valid_params_list}")
            return func(*args, **kwargs)
        return wrapper
    return decorator