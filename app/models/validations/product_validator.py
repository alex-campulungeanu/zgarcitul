add_product_template = {
  'url': {'type': 'string'},
  'vendor': {'type': 'integer'},
  'name': {'type': 'string'},
}

update_product_template = {
  'name': {'type': 'string'},
  'active' : {'type': 'integer'},
}


add_product_template_complex = {
  'url': {'type': 'string'},
  'vendor': {'type': 'string'},
  'name': {'type': 'string'},
  'test': {
    'type': 'dict', 
    'schema': {
      'address': {'type': 'string'},
      'city': {'type': 'string'}
    }
  }
}
