from flask import current_app
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.error import HTTPError
from urllib.request import urlopen


from app.constants.db_constants import VendorList
from app.shared.helper import filter_digit_from_string

def extract_product_info(vendor, url):
    error = ''
    succes = True
    proxies = {'http': current_app.config['HTTP_PROXY'], 'https': current_app.config['HTTPS_PROXY']} # if proxies are needed
    product_info = {
        "current_price": 0,
        "is_stock": 1
    }
    try:
        page = urlopen(url)
        soup = BeautifulSoup(page, 'html.parser')
        if vendor == VendorList.EMAG.value:
            '''Get price'''
            price = soup.select('div.product-highlights-wrapper p.product-new-price')
            current_app.logger.info(price[0])
            price_1 = filter_digit_from_string(price[0].contents[0].strip())
            price_2 = filter_digit_from_string(price[0].contents[1].contents[0].strip())
            product_info['current_price'] = f'{price_1}.{price_2}'
            '''Get stock'''
            product_info['is_stock'] = 1 # TODO: implement scrapping for stock availability
        else:
            # return (False, 'Vendor is not in list')
            succes = False
            error = 'Vendor is not in list'
        # current_app.logger.info(product_info)
        # return (True, product_info)
    except HTTPError as e:
        if e.code == 404:
            current_app.logger.info(f'URL not found : {url}')
            succes  = False
            error = 'URL not found'
            # return (False, 'URL not found')
        else:
            current_app.logger.info(e)
            succes  = False
            error = 'Page cannot be opened !'
            # return (False, 'Page cannot be opened !')
    except ValueError as ve:
        current_app.logger.info(f'URL format not ok ! {ve}')
        succes  = False
        error = 'URL format not ok !'
        # return (False, 'URL not ok')
    except Exception as ex:
        current_app.logger.info(f'Exception was raised {ex}')
        succes  = False
        error = f'Something went wrong ! {ex}'
        # return (False, 'Something went wrong !')
    return (succes, product_info, error)