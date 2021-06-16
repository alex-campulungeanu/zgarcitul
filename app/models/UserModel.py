from sqlalchemy.orm import backref
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime


from app.models import db
from app.models.mixins.TimestampMixin import TimestampMixin

# user_role = db.Table('users_role',
#     db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
#     db.Column('role_id', db.Integer, db.ForeignKey('role.id'))
# )

class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    active = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    modified_at = db.Column(db.DateTime(), default=datetime.utcnow)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    # role = db.relationship('RoleModel', backref='roles')
    # role = db.relationship('RoleModel', back_populates="userrole", lazy=True)
    # products = db.relationship('UserProductModel', back_populates="user")
    # tokens = db.relationship('UserTokenModel', backref='user_token', lazy=True)
    # roles = db.relationship('RoleModel', secondary=user_role, lazy='subquery', backref=db.backref('role', lazy=True))
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        # return self.password_hash == password
        return check_password_hash(self.password, password)
    
    # def get_forgot_password_token(self, expires_in=600):
    #     return jwt.encode(
    #         {'reset_password': self.id, 'exp': time() + expires_in},
    #         app.config['JWT_RESET_PASSWORD_KEY'],
    #         algorithm='HS256'
    #     ).decode('utf-8')
    
    # @staticmethod
    # def verify_forgot_password(token):
    #     try:
    #         id = jwt.decode(token, app.config['RESET_PASSWORD_KEY'], algorithms=['HS256'])['reset_password']
    #     except:
    #         return
    #     return UserModel.query.get(id)

    def __init__(self, **kwargs):
        super(UserModel, self).__init__(**kwargs)
        self.password = generate_password_hash(kwargs['password'])

    def __repr__(self):
        return "<User(email={self.email!r})>".format(self=self)

# class UserSchema(Schema):
#     class Meta:
#         model = UserModel
#     id = ma.auto_field()
#     name = ma.auto_field()
# class UserSchema(Schema):
#     name = fields.Str()
#     email = fields.Email()
#     created_at = fields.DateTime()
#     role = fields.Str()




# class UserModel(AuditModel):
#     __tablename__ = 'users'
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(256), nullable=False)
#     email = db.Column(db.String(256), unique=True, nullable=False)
#     password = db.Column(db.String(128), nullable=False)
#     active = db.Column(db.Integer, default=0)
#     roles = db.relationship('RoleModel', secondary=user_role)

#     def generate_pw_hash(self):
#         self.password = generate_password_hash(password=self.password)#.decode('utf-8')
#     generate_pw_hash.__doc__ = generate_password_hash.__doc__
    
#     def check_pw_hash(self, password: str) -> bool:
#         return check_password_hash(self.password, password)
#     check_pw_hash.__doc__ = check_password_hash.__doc__
    
#     def save(self, *args, **kwargs):
#         self.generate_pw_hash()
#         super(UserModel, self).save(*args, **kwargs)
    
#     def  __repr__(self):
#         return "<User %r>" % (self.name)
    
#     def to_json(self):
#         data = self.to_mongo()
#         data["role_id"] = {"name" :self.role_id.name, "permissions": self.role_id.permissions}
#         return json_util.dumps(data)