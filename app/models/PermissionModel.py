from flask import current_app

from app.models import db

class PermissionModel(db.Model):
    __tablename__ = 'permission'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    # roles = db.relationship('RoleModel', secondary=role_permission)

    def __repr__(self):
        return "<Permission %r>" % (self.name)