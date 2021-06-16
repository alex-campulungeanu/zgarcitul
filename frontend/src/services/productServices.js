import axios from 'axios'

export const getProducts = async () => {
  const response = await axios('/prod/products', {
    method: 'GET'
  })
  return response
}

export const getProduct = async (id) => {
  const response = await axios(`/prod/products/${id}`, {
    method: 'GET'
  })
  return response
}

export const addProduct = async (data) => {
  const postData = {
    url: data.url,
    vendor: data.vendor,
    name: data.name,
    description: data.description,
  }
  const response = await axios(`/prod/products`, {
    method: 'POST',
    data: postData
  })
  return response
}

export const deleteProduct = async (id) => {
  const response = await axios(`/prod/products/${id}`, {
    method: 'DELETE'
  })

  return response
}


export const changeStatus = async (id) => {
  const response = await axios(`/prod/products/status/${id}`, {
    method: 'PATCH'
  })
  return response
}

export const getVendors = async () => {
  const response = await axios('/prod/vendors', {
    method: 'GET'
  })
  return response
}