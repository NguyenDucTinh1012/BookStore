import apiClient from '../../../shared/api/client.js'
import { unwrapCollection } from '../../../shared/utils/apiResponse.js'

export async function getOrderDetails() {
  const { data } = await apiClient.get('/orderdetails')
  return unwrapCollection(data)
}

export async function getOrderDetailsByOrderId(orderId) {
  const { data } = await apiClient.get(`/orderdetails/order/${orderId}`)
  return unwrapCollection(data)
}

export async function getOrderDetailsByBookId(bookId) {
  const { data } = await apiClient.get(`/orderdetails/book/${bookId}`)
  return unwrapCollection(data)
}
