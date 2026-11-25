import { useEffect, useMemo, useState } from 'react'
import Icon from '../../../components/ui/Icon.jsx'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { getCategories } from '../../categories/api/categoriesApi.js'
import { createBook, deleteBook, getBooks, updateBook } from '../api/booksApi.js'
import BookFormModal from '../components/BookFormModal.jsx'
import BookStats from '../components/BookStats.jsx'
import BooksTable from '../components/BooksTable.jsx'
import '../books.css'

const PAGE_SIZE = 7
const emptyBook = { title: '', author: '', description: '', price: '', stock: '0', imageUrl: '', categoryId: '', isActive: true }

export default function BooksPage({ onToast }) {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyBook)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  async function loadBooks() {
    try {
      setBooks(await getBooks())
      setLoadError('')
    } catch (error) {
      setLoadError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function loadCategories() {
    try {
      setCategories(await getCategories())
      setCategoryError('')
    } catch (error) {
      setCategoryError(getApiErrorMessage(error))
    }
  }

  useEffect(() => {
    let isCurrent = true

    getBooks()
      .then((items) => { if (isCurrent) setBooks(items) })
      .catch((error) => { if (isCurrent) setLoadError(getApiErrorMessage(error)) })
      .finally(() => { if (isCurrent) setLoading(false) })

    getCategories()
      .then((items) => { if (isCurrent) setCategories(items) })
      .catch((error) => { if (isCurrent) setCategoryError(getApiErrorMessage(error)) })

    return () => { isCurrent = false }
  }, [])

  function retryLoadBooks() {
    setLoading(true)
    setLoadError('')
    loadBooks()
  }

  const filteredBooks = useMemo(() => books.filter((book) => {
    const searchText = `${book.title || ''} ${book.author || ''} ${book.categoryName || ''}`.toLocaleLowerCase('vi')
    const matchesQuery = searchText.includes(query.toLocaleLowerCase('vi'))
    const matchesCategory = categoryFilter === 'all' || String(book.categoryId) === categoryFilter
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? book.isActive : !book.isActive)
    return matchesQuery && matchesCategory && matchesStatus
  }), [books, query, categoryFilter, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE))
  const visibleBooks = filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openCreate() {
    const defaultCategory = categories.find((category) => category.isActive)?.categoryId
    setModal({ type: 'create' })
    setForm({ ...emptyBook, categoryId: defaultCategory ? String(defaultCategory) : '' })
    setActionError('')
  }

  function openEdit(book) {
    setModal({ type: 'edit', book })
    setForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      price: String(book.price ?? ''),
      stock: String(book.stock ?? 0),
      imageUrl: book.imageUrl || '',
      categoryId: String(book.categoryId ?? ''),
      isActive: Boolean(book.isActive),
    })
    setActionError('')
  }

  function openDelete(book) {
    setModal({ type: 'delete', book })
    setActionError('')
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function closeModal() {
    if (!saving) {
      setModal(null)
      setActionError('')
    }
  }

  async function submitBook(event) {
    event.preventDefault()
    if (!form.categoryId) {
      setActionError('Hãy tạo hoặc chọn một danh mục trước khi lưu sách.')
      return
    }

    setSaving(true)
    setActionError('')
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl.trim() || null,
      categoryId: Number(form.categoryId),
    }

    try {
      if (modal.type === 'create') {
        const book = await createBook(payload)
        setBooks((current) => [book, ...current])
        onToast('Đã thêm sách mới.')
      } else {
        const book = await updateBook(modal.book.bookId, { ...payload, isActive: form.isActive })
        setBooks((current) => current.map((item) => item.bookId === book.bookId ? book : item))
        onToast('Đã cập nhật thông tin sách.')
      }
      setModal(null)
    } catch (error) {
      setActionError(getApiErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    setSaving(true)
    setActionError('')
    try {
      await deleteBook(modal.book.bookId)
      setBooks((current) => current.filter((book) => book.bookId !== modal.book.bookId))
      setModal(null)
      onToast('Đã xóa sách.')
    } catch (error) {
      setActionError(getApiErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page-content" id="books">
      <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> QUẢN LÝ SẢN PHẨM</div><h1>Sách</h1><p className="page-subtitle">Quản lý đầu sách, giá bán, tồn kho và hình ảnh bìa.</p></div><button className="primary-button" onClick={openCreate}><Icon name="plus" size={18}/> Thêm sách</button></section>
      <BookStats books={books} loading={loading}/>
      <BooksTable
        books={visibleBooks}
        categories={categories}
        loading={loading}
        loadError={loadError}
        categoryError={categoryError}
        query={query}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        page={page}
        pageCount={pageCount}
        total={filteredBooks.length}
        onQueryChange={(value) => { setQuery(value); setPage(1) }}
        onCategoryChange={(value) => { setCategoryFilter(value); setPage(1) }}
        onStatusChange={(value) => { setStatusFilter(value); setPage(1) }}
        onPageChange={setPage}
        onRetry={retryLoadBooks}
        onRetryCategories={loadCategories}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      <footer className="page-footer"><span>© {new Date().getFullYear()} BookStore · Quản trị</span><span>Quản lý kho sách <b>♥</b></span></footer>

      {modal?.type !== 'delete' && modal && <BookFormModal mode={modal.type} book={modal.book} categories={categories} form={form} saving={saving} error={actionError} onChange={updateForm} onClose={closeModal} onSubmit={submitBook}/>}
      {modal?.type === 'delete' && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal() }}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-book-title"><div className="dialog-top"><span className="dialog-icon"><Icon name="trash" size={20}/></span><button className="dialog-close" aria-label="Đóng" onClick={closeModal}><Icon name="close" size={19}/></button></div><h2 id="delete-book-title">Xóa sách này?</h2><p className="dialog-description">Bạn sắp xóa <b>{modal.book.title}</b>. Thao tác này không thể hoàn tác.</p>{actionError && <div className="form-error">{actionError}</div>}<div className="dialog-actions"><button className="secondary-button" onClick={closeModal} disabled={saving}>Hủy</button><button className="danger-button" onClick={confirmDelete} disabled={saving}>{saving ? 'Đang xóa…' : 'Xóa sách'}</button></div></section></div>}
    </main>
  )
}
