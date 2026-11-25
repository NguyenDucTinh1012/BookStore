import { useEffect, useState } from 'react'
import { getBooks } from '../../books/api/booksApi.js'
import { getCategories } from '../../categories/api/categoriesApi.js'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'

export default function useStoreCatalog() {
  const [catalog, setCatalog] = useState({ books: [], categories: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let isCurrent = true
    Promise.all([getBooks(), getCategories()])
      .then(([books, categories]) => {
        if (isCurrent) setCatalog({ books, categories })
      })
      .catch((requestError) => { if (isCurrent) setError(getApiErrorMessage(requestError)) })
      .finally(() => { if (isCurrent) setLoading(false) })
    return () => { isCurrent = false }
  }, [version])

  function reload() {
    setError('')
    setLoading(true)
    setVersion((current) => current + 1)
  }

  return { ...catalog, loading, error, reload }
}
