import json as json
from flask import current_app, g, jsonify, Response, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, get_current_user
from time import sleep
from sqlalchemy import exc

from app.models import db
from app.models.ProductModel import ProductModel
from app.models.VendorModel import VendorModel
from app.models.UserProductModel import UserProductModel
from app.models.ProductHistoryModel import ProductHistoryModel
from app.models.validations.product_validator import add_product_template, update_product_template
from app.models.validations.user_product_validator import update_user_product_template, add_user_product_template
from app.models.schemas.ProductSchema import ProductSchema
from app.models.schemas.VendorSchema import VendorSchema
from app.models.schemas.ProductHistorySchema import ProductHistorySchema
from app.services.scrap_product import extract_product_info
from app.shared.helper import update_or_append_dict_list, sort_object_list
from app.shared.Auth import Auth
from app.utils.request import validate_request_custom, validate_request_cerberus
from app.utils.response import response_data, response_fail, response_success
from app.constants.db_constants import PermissionList


product = Blueprint('product', __name__)

@product.route('/products')
@product.route('/products/<id>', methods=['GET'])
# @jwt_required
def get_products(id=None) -> Response:
    schema = ProductSchema()
    if id is None:
        products = ProductModel.query.all()
        current_app.logger.info(products)
        res = schema.dump(products, many=True)
    else:
        products = ProductModel.query.filter_by(id=id).first()
        current_app.logger.info(products)
        res = schema.dump(products)
    sorted_by_history = sort_object_list(res, 'history', 'created_at')
    return response_success(sorted_by_history)

@product.route('/products', methods=['POST'])
@jwt_required
@Auth.check_permissions(PermissionList.ADD_PRODUCT.value['name'])
@validate_request_cerberus(add_product_template)
def add_products():
    body = request.get_json()
    vendor_id = body['vendor']
    current_user = get_current_user()
    vendor = VendorModel.query.filter_by(id=vendor_id).first()
    if vendor is None:
        current_app.logger.info(vendor)
        return response_fail(f'Vendor {vendor_id} is invalid !')
    try:
        new_product = ProductModel(url=body['url'], name=body['name'], vendor_id=vendor.id, user_id = current_user.id, current_price=0) #TODO: call check price on adding the product
        db.session.add(new_product)
        db.session.commit()
    except exc.IntegrityError as e:
        return response_fail('URL already exists !', 409)
    return response_success({'name': new_product.name, 'url': new_product.url, 'vendor': vendor.name})

@product.route('/products/<int:id>', methods=['DELETE'])
@jwt_required
def del_products(id):
    prod = ProductModel.query.get(id)
    if prod is None:
        return response_fail('Product not fund!')
    else:
        db.session.delete(prod)
        db.session.commit()
        return response_success('Product deleted !')

@product.route('/products/<int:id>', methods=['PATCH'])
@jwt_required
@validate_request_cerberus(update_product_template)
def update_product(id):
    current_user = get_current_user()
    body = request.get_json()
    name = body['name']
    prod = ProductModel.query.filter_by(id=id, user_id=current_user.id).first()
    if prod is None:
        # current_app.logger.info('Error! Code: {c}, Message, {m}'.format(c = type(e).__name__, m = str(e)))
        # if not type(e).__name__ == 'DoesNotExist': # check if document exist
        #     raise Exception('Something went wrong !')
        return response_fail('You dont have access!')
    prod.name = name
    db.session.commit()
    return response_success('Product updated !')

@product.route('/products/status/<int:id>', methods=['PATCH'])
@jwt_required
def change_status(id):
    current_user = get_current_user()
    prod = ProductModel.query.filter_by(id=id, user_id=current_user.id).first()
    if prod is None:
        return response_fail('You dont have access!')
    else:
        current_active = prod.active
        prod.active = 0 if current_active == 1 else 1
        db.session.add(prod)
        db.session.commit()
        return response_success(prod.active)

@product.route('/vendors', methods=['GET'])
@jwt_required
def get_vendors() -> Response:
    schema = VendorSchema()
    vendors = VendorModel.query.all()
    current_app.logger.info(vendors)
    res = schema.dump(vendors, many=True)
    return response_success(res)

@product.route('/check_price_all', methods=['GET'])
# @jwt_required
def check_price_all():
    product_list = ProductModel.query.filter_by(active=1).all()
    updated_url = []
    failed_url = []
    for product in [p for p in product_list if p.vendor.active == 1]: # get only active vendors, TODO: refactor this
        sleep(int(current_app.config['SLEEP_BETWEEN_CALLS']))
        vendor = product.vendor.id
        url = product.url
        response, product_info, extract_error = extract_product_info(vendor, url)
        # response, product_info, extract_error = True, {'current_price': '7259', 'is_stock': 1}, ''
        try:
            prod_history = ProductHistoryModel(
                product_id=product.id, 
                price=product_info['current_price'], 
                is_stock=product_info['is_stock'], 
                error=extract_error
            )
            product.current_price=product_info['current_price']
            product.current_is_stock=product_info['is_stock'] # TODO: implement check if product is in stoc
            db.session.add(prod_history)
            db.session.commit()
            if response: # TODO: fix this to something clearer
                updated_url.append(url)
            else:
                failed_url.append(url)
        except Exception as e:
            current_app.logger.info(f'Unable to save the product details for {url} {e}!')
            failed_url.append(url)
    return response_success({
                'updated': list(set(updated_url)),
                'failed': list(set(failed_url))
            })
    
@product.route('/user_product', methods=['PATCH'])
@jwt_required
@validate_request_cerberus(update_user_product_template)
def update_user_product():
    current_user = get_current_user()
    body = request.get_json()
    product_id_req = body['product_id']
    price_req = body['price_difference']
    stock_req = body['is_stock']
    user_product = UserProductModel.query.filter_by(product_id=product_id_req, user_id=current_user.id).first()
    if user_product is not None:
        user_product.alert_price_difference = price_req
        user_product.alert_stock = stock_req
        # alert_type_doc = AlertTypeDocument(price_difference=price_req, is_stoc = stoc_req)
        # subscriber_doc = SubscribedListDocument(email = current_user.email, alert_type = alert_type_doc)
        # update_or_append_dict_list('email', product.subscribed_list, subscriber_doc)
        # product.subscribed_list.append(subscriber_doc)
        db.session.commit()
        # return response_data(product.subscribed_list[-1].to_json())
        return response_success('Subscription updated !')
    else:
        return response_fail('You dont have acces to this product')

@product.route('/user_product', methods=['POST'])
@jwt_required
@validate_request_cerberus(add_user_product_template)
def add_user_product():
    current_user = get_current_user()
    body = request.get_json()
    product_id_req = body['product_id']
    price_req = body['price_difference']
    stock_req = body['is_stock']
    try:
        new_user_product = UserProductModel(
            product_id=product_id_req, 
            user_id=current_user.id,
            alert_price_difference = price_req,
            alert_stock = stock_req)
        db.session.add(new_user_product)
        db.session.commit()
        return response_success('Subscription added')
    except exc.IntegrityError as e:
        return response_fail('You are already subscribed to this product!')

@product.route('/logs')
# @jwt_required
def get_logs() -> Response:
    schema = ProductHistorySchema()
    logs = ProductHistoryModel.query.all()
    current_app.logger.info(logs)
    res = schema.dump(logs, many=True)
    sorted_by_history = sort_object_list(res, 'history', 'created_at')
    return response_success(sorted_by_history)