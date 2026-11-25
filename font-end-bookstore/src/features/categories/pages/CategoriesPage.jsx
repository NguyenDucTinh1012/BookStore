import { useEffect, useMemo, useState } from 'react'
import Icon from '../../../components/ui/Icon.jsx'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../api/categoriesApi.js'
import CategoryFormModal from '../components/CategoryFormModal.jsx'
import DeleteCategoryModal from '../components/DeleteCategoryModal.jsx'
import CategoryStats from '../components/CategoryStats.jsx'
import CategoryTable from '../components/CategoryTable.jsx'

const emptyForm = { categoryName: '', description: '', isActive: true }
const PAGE_SIZE = 7

export default function CategoriesPage({ onToast }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  async function loadCategories() {
    try {
      setCategories(await getCategories())
      setLoadError('')
    } catch (error) {
      setLoadError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isCurrent = true
    getCategories()
      .then((items) => { if (isCurrent) setCategories(items) })
      .catch((error) => { if (isCurrent) setLoadError(getApiErrorMessage(error)) })
      .finally(() => { if (isCurrent) setLoading(false) })

    return () => { isCurrent = false }
  }, [])

  function retryLoadCategories() {
    setLoading(true)
    setLoadError('')
    loadCategories()
  }

  const filtered = useMemo(() => categories.filter((category) => {
    const searchable = `${category.categoryName || ''} ${category.description || ''}`.toLocaleLowerCase('vi')
    const matchesQuery = searchable.includes(query.toLocaleLowerCase('vi'))
    const matchesStatus = status === 'all' || (status === 'active' ? category.isActive : !category.isActive)
    return matchesQuery && matchesStatus
  }), [categories, query, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visibleCategories = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openCreate() {
    setModal({ type: 'create' })
    setForm(emptyForm)
    setActionError('')
  }

  function openEdit(category) {
    setModal({ type: 'edit', category })
    setForm({ categoryName: category.categoryName || '', description: category.description || '', isActive: Boolean(category.isActive) })
    setActionError('')
  }

  function openDelete(category) {
    setModal({ type: 'delete', category })
    setActionError('')
  }

  function closeModal() {
    if (!saving) {
      setModal(null)
      setActionError('')
    }
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submitCategory(event) {
    event.preventDefault()
    if (!form.categoryName.trim()) {
      setActionError('Vui lòng nhập tên danh mục.')
      return
    }

    setSaving(true)
    setActionError('')
    const payload = { categoryName: form.categoryName.trim(), description: form.description.trim() || null }

    try {
      if (modal.type === 'create') {
        const category = await createCategory(payload)
        setCategories((current) => [category, ...current])
        onToast('Đã thêm danh mục mới.')
      } else {
        const category = await updateCategory(modal.category.categoryId, { ...payload, isActive: form.isActive })
        setCategories((current) => current.map((item) => item.categoryId === category.categoryId ? category : item))
        onToast('Đã cập nhật danh mục.')
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
      await deleteCategory(modal.category.categoryId)
      setCategories((current) => current.filter((category) => category.categoryId !== modal.category.categoryId))
      setModal(null)
      onToast('Đã xóa danh mục.')
    } catch (error) {
      setActionError(getApiErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page-content" id="categories">
      <section className="page-heading">
        <div><div className="eyebrow"><span className="eyebrow-dot"/> QUẢN LÝ SẢN PHẨM</div><h1>Danh mục</h1><p className="page-subtitle">Sắp xếp và quản lý các thể loại sách trong cửa hàng của bạn.</p></div>
        <button className="primary-button" onClick={openCreate}><Icon name="plus" size={18}/> Thêm danh mục</button>
      </section>

      <CategoryStats categories={categories} loading={loading}/>
      <CategoryTable
        categories={visibleCategories}
        loading={loading}
        loadError={loadError}
        query={query}
        status={status}
        page={page}
        pageCount={pageCount}
        total={filtered.length}
        onQueryChange={(value) => { setQuery(value); setPage(1) }}
        onStatusChange={(value) => { setStatus(value); setPage(1) }}
        onPageChange={setPage}
        onRetry={retryLoadCategories}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      <footer className="page-footer"><span>© {new Date().getFullYear()} BookStore · Quản trị</span><span>Quản lý cửa hàng sách <b>♥</b></span></footer>

      {modal?.type !== 'delete' && modal && <CategoryFormModal mode={modal.type} form={form} saving={saving} error={actionError} onChange={updateForm} onClose={closeModal} onSubmit={submitCategory}/>}
      {modal?.type === 'delete' && <DeleteCategoryModal category={modal.category} saving={saving} error={actionError} onClose={closeModal} onConfirm={confirmDelete}/>}
    </main>
  )
}
