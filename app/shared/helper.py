import base64
import random
import string
import hashlib
import uuid
import time
from datetime import datetime


def get_current_date():
    return datetime.utcnow()

## files
def get_file_name(filename):
    name = filename.rsplit('.', 1)[0]
    return name

def read_file(file):
    res = file.read()
    file.seek(0)
    return res

def image2base64(file):
    str = base64.b64encode(file)
    return str.decode('utf-8')

## strings
def string2md5(p_string):
    res_md5 = hashlib.md5(p_string.encode('utf-8')).hexdigest()
    return res_md5

def generate_unique_string(p_string):
    res = f"{p_string}_{uuid.uuid4().hex[:10]}_{int(time.time())}"
    return res

def generate_random_string(string_length = 10):
    letters = string.ascii_lowercase
    rand = ''.join(random.choice(letters) for i in range(string_length))
    return rand

#validate password
def validate_password(password):        
    vals = {
        # 'Password must contain an uppercase letter.': lambda s: any(x.isupper() for x in s),
        # 'Password must contain a lowercase letter.': lambda s: any(x.islower() for x in s),
        # 'Password must contain a digit.': lambda s: any(x.isdigit() for x in s),
        # 'Password must be at least 8 characters.': lambda s: len(s) >= 8,
        # 'Password cannot contain white spaces.': lambda s: not any(x.isspace() for x in s)            
        'Password must be at least 2 characters.': lambda s: len(s) >= 2
        } 
    valid = True
    for n, val in vals.items():                         
        if not val(password):                   
            valid = False
            return n
    return valid

def update_or_append_dict_list(key, dict_list, new_dict):
    # new_email = {
    #     "email": "alex1@alex.com",
    #     "alert_type": {
    #         "price": 3222, 
    #         "stoc": 1
    #     }
    # }
    # TODO: see if i can use next() for better performance: https://www.geeksforgeeks.org/python-find-dictionary-matching-value-in-list/
    found_it = 0
    for i in range (0, len(dict_list)):
        if(dict_list[i][key] == new_dict[key]):
            dict_list[i] = new_dict
            found_it = 1
            # break # do not break here so all the values should be updated
    if(found_it == 0):    
        dict_list.append(new_dict)

## method used to sort a list from json object
'''
    data = {
        'name': 'test',
        'active': 1,
        'history': [
            {id: 1, price: 23},
            {id: 2, price: 27},
            {id: 3, price: 100},
        ]
    }
    sorted_data_by_history = sort_object_list(data, 'history', 'price')
'''
def sort_object_list(data, sorted_list, sorted_by, ascending=True):
    reverse_bool = False if ascending else True
    # check if data is list, else convert to list for iteration
    for item in [data] if not isinstance(data, list) else data:
        for key, value in item.items():
            if key == sorted_list:
                value.sort(key=lambda x: x[sorted_by], reverse=True)
    return data

def filter_digit_from_string(string):
    return ''.join(filter(lambda n: n.isdigit(), string))