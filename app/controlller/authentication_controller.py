from time import sleep
import datetime
import re
from flask import Response, request, jsonify, current_app, Blueprint
from flask_jwt_extended import get_current_user
from flask_jwt_extended.view_decorators import jwt_required

from app.models import db, UserModel, UserModel
from app.models.schemas.UserSchema import UserSchema
from app.utils.response import unauthorized, response_fail, response_success, response_data
from app.utils.request import validate_request_custom
from app.utils.response import api_response
from app.shared.helper import validate_password
import app.constants.regexp_list as regex
from app.shared.Auth import Auth
from app.constants.db_constants import RoleList

authentication = Blueprint('authentication', __name__)

@authentication.route('/signup', methods=['POST'])
@validate_request_custom('email', 'name', 'password', 'secret')
def signup() -> Response:
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']
    secret = data['secret']
    if not re.match(regex.email_regexp, email):
        return response_fail('Email format not ok', 400)
    elif validate_password(password) != True:
        return response_fail(validate_password(password), 400)
    elif secret != current_app.config['SECRET_WORD_REGISTRATION']:
        return response_fail('Wrong secret word !', 400)
    user_exist = UserModel.query.filter_by(email=email).first()
    if user_exist is not None:
        return response_fail('Email already exist !', 400)
    new_user = UserModel(email=email, name=name, password=password, active=0, role_id=RoleList.USER.value['id'])
    db.session.add(new_user)
    db.session.commit()
    # output = {'id': str(new_user.id)}
    output = {'id': str(new_user.id)}
    return response_success(output)


@authentication.route('/login', methods=['POST'])
@validate_request_custom('email', 'password')
#TODO: check if response should be BAD_REQUEST when user/password are invalid / must change in frontend
def login() -> Response:
    data = request.get_json()
    email_req = data.get('email')
    password_req = data.get('password')
    user = UserModel.query.filter_by(email=email_req).first()
    if user:
        if user.active == 0:
            return response_fail('User is not active !')
        elif user.active == 1:
            auth_success = user.check_password(password_req)
            if not auth_success:
                # return unauthorized()
                return response_fail('Wrong user/password !', 401)
            else:
                # expiry = datetime.timedelta(seconds=int(current_app.config['JWT_EXPIRATION_SECONDS']))
                # access_token = create_access_token(identity=(str(user.id)), expires_delta=expiry) # TODO: move crate access token in separate file maybe auth_helper.py
                # refresh_token = create_refresh_token(identity=str(user.id))
                access_token, refresh_token = Auth.generate_token(user.email)
                # try:
                #     token = UserTokenModel(access_token = access_token, user_id = user)
                #     token.save()
                # except db.NotUniqueError as e:
                #     current_app.logger.info(f'Already exist token! {e}')
                #     return response_fail('Cannot login, something went terribly wrong!')
                return response_success({
                        'access_token': access_token,
                        'refresh_token': refresh_token,
                        'logged_in_as': f"{user.email}"
                    })
    else:
        # return unauthorized()
        return response_fail('Wrong user/password.!', 401)

import json
from sqlalchemy.ext.declarative.api import DeclarativeMeta
class AlchemyEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, tuple):
            data = {}
            for obj in o:
                data.update(self.parse_sqlalchemy_object(obj))
            return data
        if isinstance(o.__class__, DeclarativeMeta):
            return self.parse_sqlalchemy_object(o)
        return json.JSONEncoder.default(self, o)

    def parse_sqlalchemy_object(self, o):
        data = {}
        fields = o.__json__() if hasattr(o, '__json__') else dir(o)
        for field in [f for f in fields if not f.startswith('_') and f not in ['metadata', 'query', 'query_class']]:
            value = o.__getattribute__(field)
            try:
                json.dumps(value)
                data[field] = value
            except TypeError:
                data[field] = None
        return data

@authentication.route('/me', methods=['GET'])
@jwt_required
def me() -> Response:
    # user = get_current_user()
    # user = UserModel.query.join(RoleModel, RoleModel.id == UserModel.role_id) \
    #             .add_columns(UserModel.id, UserModel.name, RoleModel.name) \
    #             .filter(UserModel.id==get_current_user().id).all()
    # user = db.session.query(UserModel.name).all()
    # current_app.logger.info(user_info)
    # current_app.logger.info(json.dumps(user_info))
    # return response_success(json.loads(json.dumps(user_info, cls=AlchemyEncoder)))
    # user = UserModel.query.get(get_current_user().id)
    
    # user = execute_query(f'select u.name username, u.email email, r.name as  role from users u inner join role r on r.id = u.role_id and u.id = {user.id}')
    # return response_success(user[0])

    user = UserModel.query.get(get_current_user().id)
    current_app.logger.info(user)
    schema = UserSchema()
    res = schema.dump(user)
    current_app.logger.info(res)
    return response_success(res)
    return 'return'