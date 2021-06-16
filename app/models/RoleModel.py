from app.models import db , PermissionModel, UserModel

role_permission = db.Table('role_permission',
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True),
    db.Column('permission_id', db.Integer, db.ForeignKey('permission.id'), primary_key=True)
)

class RoleModel(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    permissions = db.relationship('PermissionModel', secondary=role_permission)
    users = db.relationship('UserModel', backref='role', lazy=True)
    # users = db.relationship('UserModel', backref=db.backref('role'))

    def __repr__(self):
        return "<Role %r>" % (self.name)