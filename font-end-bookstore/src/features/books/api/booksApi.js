import apiClient from '../../../shared/api/client.js'
import { unwrapCollection } from '../../../shared/utils/apiResponse.js'

export async function getBooks() {
  const { data } = await apiClient.get('/books')
  return unwrapCollection(data)
}

export async function getBookById(id) {
  const { data } = await apiClient.get(`/books/${id}`)
  return data
}

export async function getBooksByCategory(categoryId) {
  const { data } = await apiClient.get(`/books/category/${categoryId}`)
  return unwrapCollection(data)
}

export async function createBook(payload) {
  const { data } = await apiClient.post('/books', payload)
  return data
}

export async function updateBook(id, payload) {
  const { data } = await apiClient.put(`/books/${id}`, payload)
  return data
}

export function deleteBook(id) {
  return apiClient.delete(`/books/${id}`)
}
