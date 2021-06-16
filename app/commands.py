import click
import os

from flask import current_app
from flask.cli import cli
from sqlalchemy.exc import IntegrityError

from app import app
from app.shared.db_api import execute_change
from app.models import db
from app.models.VendorModel import VendorModel
from app.models.UserModel import UserModel
from app.models.RoleModel import RoleModel
from app.models.PermissionModel import PermissionModel
from app.constants.db_constants import PermissionList, RoleList, VendorList
from app.models import db


def register_commands(app):
    app.cli.add_command(clean_pyc)
    app.cli.add_command(configure_db)
    app.cli.add_command(drop_db)
    app.cli.add_command(test)

@click.command()
def test():
    """This is for testing"""
    click.echo('TEST COMMAND from click')

@click.command()
def clean_pyc():
    """Recursively remove *.pyc and *.pyo files."""
    exclude = set(['venv', 'git', 'migrations'])
    for dirpath, dirnames, filenames in os.walk('.'):
        dirnames[:] = [d for d in dirnames if d not in exclude]
        for filename in filenames:
            if filename.endswith('.pyc') or filename.endswith('.pyo'):
                filepath = os.path.join(dirpath, filename)
                click.echo(f'Removing {filepath}')
                os.remove(filepath)

@click.command()
def drop_db():
    with app.app_context():
        # TODO: add confirmation message
        db.reflect()
        db.drop_all()
        current_app.logger.info('DB dropped')

@click.command()
def configure_db():
    """Populate static tables with values"""
    def add_rows(rows_list):
        for i in rows_list:
            try:
                db.session.add(i)
                db.session.commit()
            except IntegrityError:
                db.session.rollback()
    # m-am complicat aici, nu trebuia sa folosesc maparea din db_constants
    def add_vendors():
        vendors = []
        for vendor in VendorList:
            vendors.append(VendorModel(id=vendor.value, name=vendor.name, active=1))
        add_rows(vendors)
        current_app.logger.info('Vendors added')

    def add_roles():
        roles = []
        for role in RoleList:
            roles.append(RoleModel(id=role.value['id'], name=role.value['name']))
        add_rows(roles)
        current_app.logger.info('Roles added')
    
    def add_permissions():
        permissions = []
        permissions_roles_map = {}
        ## add permissions
        for permission in PermissionList:
            permissions.append(PermissionModel(id=permission.value['id'], name=permission.value['name'], description=permission.value['description']))
        add_rows(permissions)
        current_app.logger.info('Permission  added')
        ## add permissions to roles
        sql_truncate = f"delete from role_permission;" # TODO: should use ORM
        r = execute_change(sql_truncate)
        # TODO: add permission roles mapping to db_constants
        # t = [p.value['id'] for p in PermissionList]
        permissions_roles_map = {
            RoleModel.query.get(RoleList.ADMIN.value['id']): [p.value['id'] for p in PermissionList],
            RoleModel.query.get(RoleList.USER.value['id']): [PermissionList.ADD_PRODUCT.value['id'], 
                                                            PermissionList.DELETE_PRODUCT.value['id'], 
                                                            PermissionList.UPDATE_PRODUCT.value['id']],
            RoleModel.query.get(RoleList.SCRAPPER.value['id']): [PermissionList.SCRAP_PRICE.value['id']],
        }
        for role, permissions in permissions_roles_map.items():
            permissions = PermissionModel.query.filter(PermissionModel.id.in_(permissions)).all()
            role.permissions.extend(permissions)
            db.session.add(role)
            db.session.commit()
        current_app.logger.info('Permission for role added')
        
    # TODO: add user with a mapping file containing user details and parse it 
    def add_users():
        users = [
            UserModel(name="test", email="test@test.com", password="test", active=1, role_id=RoleList.ADMIN.value['id']),
        ]
        add_rows(users)
        current_app.logger.info('Users added')


    with app.app_context():
        current_app.logger.info('======= START configuring DB =======')
        add_vendors()
        add_roles()
        add_permissions()
        add_users()






## old MongoEngine configuration
        # ## add roles
        # roles = [
        #     RoleModel(id=app_constants.ROLE_USER, name='user', description='role user'),
        #     RoleModel(id=app_constants.ROLE_ADMIN, name='admin', description='admin user'),
        #     RoleModel(id=app_constants.ROLE_PLATFORM, name='platform', description='platform user'),
        #     RoleModel(id=app_constants.ROLE_PLATFORM_TWITTER, name='platformTwitter', description='platform twitter user')
        # ]
        # add_rows(roles)
        # current_app.logger.info('Roles added')

        # ## add permissions
        # permissions = [
        #     PermissionModel(id=1, name='createPost', description='add posts'),
        #     PermissionModel(id=2, name='viewPost', description='view posts'),
        #     PermissionModel(id=3, name='deletePost', description='delete posts'),
        #     PermissionModel(id=4, name='publishTwitterPost', description='publish twitter posts')
        # ]
        # add_rows(permissions)
        # current_app.logger.info('Permission  added')

        # ##add permissions to roles
        # sql_truncate = f"delete from {cfg_db_schema}.role_permission;" ## should use ORM
        # r = execute_change(sql_truncate)
        # permissions_roles_map = {
        #     RoleModel.query.get(app_constants.ROLE_USER): [2],
        #     RoleModel.query.get(app_constants.ROLE_ADMIN): [1, 2, 3, 4],
        #     RoleModel.query.get(app_constants.ROLE_PLATFORM): [4],
        #     RoleModel.query.get(app_constants.ROLE_PLATFORM_TWITTER): [4],
        # }
        # for role, permissions in permissions_roles_map.items():
        #     permissions = PermissionModel.query.filter(PermissionModel.id.in_(permissions)).all()
        #     role.permissions.extend(permissions)
        #     db.session.add(role)
        #     db.session.commit()
        # current_app.logger.info('Permission for role added')

        # ## add post_types
        # post_types = [
        #     PostTypeModel(id=app_constants.POST_TYPE_IMAGE, name="Image post"),
        #     PostTypeModel(id=app_constants.POST_TYPE_TEXT, name="Text post")
        # ]
        # add_rows(post_types)
        # current_app.logger.info('Post types added')

        # ## add platforms
        # paltforms = [
        #     PlatformModel(id=app_constants.PLATFORM_TWITTER_ID, name='Twitter')
        # ]
        # add_rows(paltforms)
        # current_app.logger.info('Platforms added')

        # ## add configs to platforms
        # platforms_configs = [
        #     ## id_config column is used when i retrieve the specific config
        #     PlatformConfigModel(platform_id=app_constants.PLATFORM_TWITTER_ID, id_config=1, name='last reply(tweet_id) checked for reaction', value=''),
        #     PlatformConfigModel(platform_id=app_constants.PLATFORM_TWITTER_ID, id_config=2, name='last tweet_id checked for hastags(from logged user)', value=''),
        # ]
        # add_rows(platforms_configs)
        # current_app.logger.info('Platforms configs added')

        current_app.logger.info('======= END configuring DB =======')
