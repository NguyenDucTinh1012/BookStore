import { useState } from 'react'
import Icon from '../../../components/ui/Icon.jsx'
import BookCover from './BookCover.jsx'

export default function BookFormModal({ mode, book, categories, form, saving, error, onChange, onClose, onSubmit }) {
  const [imageFailed, setImageFailed] = useState(false)
  const selectedCategoryExists = categories.some((category) => String(category.categoryId) === form.categoryId)

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog book-dialog" role="dialog" aria-modal="true" aria-labelledby="book-dialog-title">
        <div className="dialog-top"><span className="dialog-icon"><Icon name={mode === 'edit' ? 'edit' : 'book'} size={20}/></span><button className="dialog-close" aria-label="Đóng" onClick={onClose}><Icon name="close" size={19}/></button></div>
        <form onSubmit={onSubmit}>
          <h2 id="book-dialog-title">{mode === 'edit' ? 'Cập nhật sách' : 'Thêm sách mới'}</h2>
          <p className="dialog-description">Thông tin được lưu theo các trường của bảng Book.</p>
          <div className="book-form-grid">
            <label className="form-label book-field-wide">Tên sách <span>*</span><input required maxLength={200} value={form.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nhập tên sách"/></label>
            <label className="form-label">Tác giả <span>*</span><input required maxLength={150} value={form.author} onChange={(event) => onChange('author', event.target.value)} placeholder="Tên tác giả"/></label>
            <label className="form-label">Danh mục <span>*</span><select required value={form.categoryId} onChange={(event) => onChange('categoryId', event.target.value)}><option value="">Chọn danh mục</option>{mode === 'edit' && !selectedCategoryExists && <option value={form.categoryId}>{book.categoryName || 'Danh mục hiện tại'}</option>}{categories.filter((category) => category.isActive || String(category.categoryId) === form.categoryId).map((category) => <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>)}</select></label>
            <label className="form-label">Giá bán (₫) <span>*</span><input required type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => onChange('price', event.target.value)} placeholder="0"/></label>
            <label className="form-label">Tồn kho <span>*</span><input required type="number" min="0" step="1" value={form.stock} onChange={(event) => onChange('stock', event.target.value)} placeholder="0"/></label>
            <label className="form-label book-field-wide">Mô tả<textarea rows={3} value={form.description} onChange={(event) => onChange('description', event.target.value)} placeholder="Mô tả nội dung sách..."/></label>
            <div className="form-label book-field-wide">Ảnh bìa <small>Đường dẫn ảnh (URL), tối đa 500 ký tự</small>
              <div className="image-editor">
                <BookCover key={form.imageUrl} src={form.imageUrl} title={form.title || 'xem trước'} className="image-editor-cover" onFail={() => setImageFailed(true)}/>
                <div className="image-editor-fields"><input maxLength={500} value={form.imageUrl} onChange={(event) => { onChange('imageUrl', event.target.value); setImageFailed(false) }} placeholder="https://.../bia-sach.jpg" aria-label="Đường dẫn ảnh bìa"/><small>{form.imageUrl ? imageFailed ? 'Ảnh không tải được. Hãy kiểm tra hoặc thay URL.' : 'Xem trước ảnh bìa bên trái.' : 'Chưa có ảnh. Dán URL ảnh để thêm hoặc cập nhật bìa.'}</small><button type="button" className="image-clear" onClick={() => { onChange('imageUrl', ''); setImageFailed(false) }} disabled={!form.imageUrl}>Xóa đường dẫn ảnh</button></div>
              </div>
            </div>
          </div>
          {mode === 'edit' && <label className="active-switch"><span><b>Sách đang hoạt động</b><small>Sách ẩn sẽ không được hiển thị cho khách.</small></span><input type="checkbox" checked={form.isActive} onChange={(event) => onChange('isActive', event.target.checked)}/><i/></label>}
          {error && <div className="form-error">{error}</div>}
          {mode === 'create' && categories.length === 0 && <div className="form-error">Cần có ít nhất một danh mục trước khi thêm sách.</div>}
          <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose} disabled={saving}>Hủy</button><button className="primary-button" disabled={saving || (mode === 'create' && categories.length === 0)}>{saving ? 'Đang lưu…' : mode === 'edit' ? 'Lưu thay đổi' : <><Icon name="plus"/> Tạo sách</>}</button></div>
        </form>
      </section>
    </div>
  )
}
