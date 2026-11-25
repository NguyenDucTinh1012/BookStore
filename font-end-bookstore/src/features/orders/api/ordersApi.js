import apiClient from '../../../shared/api/client.js'
import { unwrapCollection } from '../../../shared/utils/apiResponse.js'

export async function getOrders() {
  const { data } = await apiClient.get('/orders')
  return unwrapCollection(data)
}

export async function getOrderById(orderId) {
  const { data } = await apiClient.get(`/orders/${orderId}`)
  return data
}

export async function getMyOrders() {
  const { data } = await apiClient.get('/orders/my-orders')
  return unwrapCollection(data)
}

export async function createOrder(payload) {
  const { data } = await apiClient.post('/orders', payload)
  return data
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await apiClient.put(`/orders/${orderId}/status`, { status })
  return data
}
