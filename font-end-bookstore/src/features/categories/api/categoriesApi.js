import apiClient from '../../../shared/api/client.js'
import { unwrapCollection } from '../../../shared/utils/apiResponse.js'

export async function getCategories() {
  const { data } = await apiClient.get('/categories')
  return unwrapCollection(data)
}

export async function createCategory(payload) {
  const { data } = await apiClient.post('/categories', payload)
  return data
}

export async function updateCategory(id, payload) {
  const { data } = await apiClient.put(`/categories/${id}`, payload)
  return data
}

export function deleteCategory(id) {
  return apiClient.delete(`/categories/${id}`)
}
