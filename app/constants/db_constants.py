from enum import Enum

class VendorList(Enum):
    EMAG = 1
    SPORTGURU = 2

class PermissionList(Enum):
    ADD_PRODUCT = {
        'id': 1,
        'name': 'addProduct',
        'description': 'addProduct desc'
    }
    DELETE_PRODUCT = {
        'id': 2,
        'name': 'deleteProduct',
        'description': 'deleteProduct desc'
    }
    UPDATE_PRODUCT = {
        'id': 3,
        'name': 'updateProduct',
        'description': 'updateProduct desc'
    }
    SCRAP_PRICE = {
        'id': 4,
        'name': 'scrapPrice',
        'description': 'scrapPrice desc'
    }

class RoleList(Enum):
    ADMIN = {
        'id': 1,
        'name': 'admin'
    }
    USER = {
        'id': 2,
        'name': 'user'
    }
    SCRAPPER = {
        'id': 3,
        'name': 'scrapper'
    }

# class PermissionRolesList(Enum):
#     # RoleList.ADMIN.value['id'] = []
#     RoleList.USER.value['id'] = [
#         PermissionList.ADD_PRODUCT.value['id'], 
#         PermissionList.DELETE_PRODUCT.value['id'], 
#         PermissionList.UPDATE_PRODUCT.value['id']
#     ]
#     RoleList.SCRAPPER.value['id'] = [PermissionList.SCRAP_PRICE.value['id']]
