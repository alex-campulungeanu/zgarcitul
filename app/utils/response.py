import json
from http import HTTPStatus
from functools import wraps

from flask import request, Response, jsonify
from werkzeug.exceptions import UnprocessableEntity

def response_success(msg, code=HTTPStatus.OK):
    return jsonify({'status': True, 'msg': msg, 'status_code': code}), code

def response_fail(msg, code=HTTPStatus.BAD_REQUEST):
    return jsonify({'status': False, 'msg': msg, 'status_code': code}), code

def response_data(data, code=HTTPStatus.OK):
    # print(jsonify(data))
    return Response(json.dumps(data), mimetype="application/json", status=200)

def response_error(e):
    return jsonify({'status': 'error', 'message': e.description}), e.code


def resp_json(success, message=None, data=None, meta=None, errors=None, code=200):
    response = {"success": success}
    if not message is None:
        response["message"] = message
    if not data is None:
        response["data"] = data
    if not meta is None:
        response['meta'] = meta
    if not errors is None:
        response['errors'] = errors
    return jsonify(response), code


def resp_json_with_validation_errors(errors):
    return jsonify({
        "success": False,
        "message": "The given data was invalid.",
        "errors": errors,
    }), UnprocessableEntity.code


def api_response(res, status_code=200):
    """ Custom API Response Function """
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )
    
def unauthorized() -> Response:
    output = {"error":
              {"msg": "The email or password provided is invalid."}
              }
    resp = jsonify({'result': output})
    resp.status_code = 401
    return resp


def forbidden() -> Response:
    return response_fail('The current user is not authorized to take this action.', 403)
    """output = {"error":
              {"msg": "403 error: The current user is not authorized to take this action."}
              }
    resp = jsonify({'result': output})
    resp.status_code = 403
    return resp"""


def invalid_route() -> Response:
    output = {"error":
              {"msg": "This route is currently not supported. See API documentation."}
              }
    resp = jsonify({'result': output})
    resp.status_code = 404
    return resp