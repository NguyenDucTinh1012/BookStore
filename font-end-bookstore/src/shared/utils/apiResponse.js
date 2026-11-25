export function unwrapCollection(data) {
  if (Array.isArray(data)) return data
  return data?.$values || data?.items || []
}

export function getApiErrorMessage(error) {
  return error.response?.data?.message
    || error.response?.data?.title
    || error.message
    || 'Đã xảy ra lỗi. Vui lòng thử lại.'
}
