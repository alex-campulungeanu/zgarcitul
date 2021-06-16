import json
from flask import current_app, g
import datetime
from functools import wraps
from flask_jwt_extended import create_access_token, create_refresh_token, get_current_user

from app.models.UserModel import UserModel
from app.shared.db_api import execute_query
from app.utils.response import forbidden

class Auth():
    @staticmethod
    def generate_token(user_email):
        expiry = datetime.timedelta(seconds=int(current_app.config['JWT_EXPIRATION_SECONDS']))
        access_token = create_access_token(identity=(str(user_email)), expires_delta=expiry)
        refresh_token = create_refresh_token(identity=str(user_email))
        return (access_token, refresh_token)

    @staticmethod
    def check_permissions(*expected_args):
        """ Check permissions decorator """
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                user = get_current_user()
                perm_sql = f"select distinct u.id, u.name u_name, p.id permi_id, p.name perm_name \
                                from users u \
                                inner join role_permission rp on rp.role_id = u.role_id \
                                inner join permission p on p.id = rp.permission_id \
                                where u.id = {user.id}"
                perm_res = execute_query(perm_sql)
                permissions_name = []
                for dict_list in perm_res:
                    for key, value in dict_list.items():
                        if key == 'perm_name':
                            permissions_name.append(value)
                for expected_arg in expected_args:
                    if expected_arg not in permissions_name or permissions_name is None:
                        current_app.logger.info(f'The current user is not authorized to take this action: {expected_arg}')
                        return forbidden()
                return func(*args, **kwargs)
            return wrapper
        return decorator
    
    # @staticmethod
    # def generate_token(user_id):
    #     res = {'status': '', 'data': {}, 'error': {}}
    #     jwt_expiration = int(current_app.config['JWT_EXPIRATION_SECONDS'])
    #     try:
    #         payload = {
    #             'sub': user_id,
    #             'exp': datetime.datetime.now() + datetime.timedelta(seconds=jwt_expiration),
    #             # 'exp': 1371720949,
    #             'iat': datetime.datetime.now(),
    #         }
    #         return jwt.encode(payload, app.config['JWT_SECRET_KEY'], 'HS256').decode("utf-8")
    #     except Exception as e:
    #         res['error'] = {'message': 'error in generating user token'}
    #         return res
    
    # @staticmethod
    # def decode_token(token):
    #     res = {'status': 'ok', 'data': {}, 'error': {}}
    #     try:
    #         jwt_options = {
    #           'verify_exp': True,
    #           'verify_signature': True,
    #           'require_exp': True,
    #         }
    #         payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'])
    #         res['data'] = {'user_id': payload['sub']}
    #         return res
    #     except jwt.ExpiredSignatureError as exp:
    #         app.logger.info('TOKEN IS EXPIRED')
    #         res['error'] = {'message': 'token expired, please login again'}
    #         res['status'] = 'notok'
    #         return res
    #     except jwt.InvalidTokenError as inv:
    #         app.logger.info(inv)
    #         res['error'] = {'message': 'Invalid token, please try again with a new token'}
    #         res['status'] = 'notok'
    #         return res
    #     except Exception as e:
    #         res['error'] = {'message': 'Something went wrong !'}
    #         res['status'] = 'notok'
    #         app.logger.info(e)
    #         return res


    # @staticmethod
    # def auth_required(func):
    #     """ Auth decorator """
    #     res = {'status': '', 'data': {}, 'error': {}}
    #     token_name = app.config['JWT_TOKEN_NAME']
    #     @wraps(func)
    #     def decorated_auth(*args, **kwargs):
    #         if token_name not in request.headers:
    #             res['error'] = {'message' : 'Authentication token is not available, please login to get one'}
    #             res['status'] = 'notok'
    #             return api_response(res, status_code=401)
    #         request_token = request.headers.get(token_name)
    #         data = Auth.decode_token(request_token)
    #         if data['error']:
    #             return api_response(data, status_code=401)
    #             # return Response(
    #             #     mimetype="application/json",
    #             #     response=json.dumps(data),
    #             #     status=401
    #             # )
    #         user_id = data['data']['user_id']
    #         if current_app.config['JWT_CHECK_DB']:
    #             user_token = UserTokenModel.query.filter_by(token=request_token).first()
    #             if (user_token is None) or (user_token.user_id != user_id):
    #                 res['error'] = {'message' : 'Invalid Token DB'}
    #                 res['status'] = 'notok'
    #                 return api_response(res, status_code=401)
    #         logged_user = UserModel.query.filter_by(id = user_id).first()
    #         if not logged_user:
    #             res['error'] = {'message' : 'User does not exist, invalid token'}
    #             res['status'] = 'notok'
    #             return api_response(res, status_code=401)
    #         g.user = logged_user
    #         return func(*args, **kwargs)
    #     return decorated_auth


    # @staticmethod
    # def check_permissions(*expected_args):
    #     """ Check permissions decorator """
    #     def decorator(func):
    #         @wraps(func)
    #         def wrapper(*args, **kwargs):
    #             perm_sql = f"select distinct u.id, u.name u_name, p.id permi_id, p.name perm_name \
    #                             from {cfg_db_schema}.users u \
    #                             inner join {cfg_db_schema}.users_role ur on ur.user_id = u.id \
    #                             inner join {cfg_db_schema}.\"role\" r on r.id = ur.role_id \
    #                             inner join {cfg_db_schema}.role_permission rp on rp.role_id = ur.role_id \
    #                             inner join {cfg_db_schema}.permission p on p.id = rp.permission_id \
    #                             where u.id = {g.user.id}"
    #             perm_res = execute_query(perm_sql)
    #             permissions_name = []
    #             for dict_list in perm_res:
    #                 for key, value in dict_list.items():
    #                     if key == 'perm_name':
    #                         permissions_name.append(value)
    #             for expected_arg in expected_args:
    #                 if expected_arg not in permissions_name or permissions_name is None:
    #                     return api_response({'error': f"You dont have enough permissions: {', '.join(expected_args)}"})
    #             return func(*args, **kwargs)
    #         return wrapper
    #     return decorator
