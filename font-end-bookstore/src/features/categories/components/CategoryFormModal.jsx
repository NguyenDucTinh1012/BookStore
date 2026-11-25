import Icon from '../../../components/ui/Icon.jsx'

export default function CategoryFormModal({
  mode, form, saving, error, onChange, onClose, onSubmit,
}) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="category-dialog-title">
        <div className="dialog-top"><span className="dialog-icon"><Icon name={mode === 'edit' ? 'edit' : 'layers'} size={20}/></span><button className="dialog-close" aria-label="Đóng" onClick={onClose}><Icon name="close" size={19}/></button></div>
        <form onSubmit={onSubmit}>
          <h2 id="category-dialog-title">{mode === 'edit' ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
          <p className="dialog-description">{mode === 'edit' ? 'Cập nhật thông tin cho danh mục sách.' : 'Tạo một danh mục để sắp xếp sách trong cửa hàng.'}</p>
          <label className="form-label">Tên danh mục <span>*</span><input autoFocus required maxLength={100} placeholder="Ví dụ: Văn học Việt Nam" value={form.categoryName} onChange={(event) => onChange('categoryName', event.target.value)}/></label>
          <label className="form-label">Mô tả <small>Tùy chọn</small><textarea maxLength={500} rows={4} placeholder="Mô tả ngắn về danh mục này..." value={form.description} onChange={(event) => onChange('description', event.target.value)}/><em>{form.description.length}/500</em></label>
          {mode === 'edit' && <label className="active-switch"><span><b>Danh mục đang hoạt động</b><small>Khách hàng có thể xem danh mục này.</small></span><input type="checkbox" checked={form.isActive} onChange={(event) => onChange('isActive', event.target.checked)}/><i/></label>}
          {error && <div className="form-error">{error}</div>}
          <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose} disabled={saving}>Hủy</button><button className="primary-button" disabled={saving}>{saving ? 'Đang lưu…' : mode === 'edit' ? 'Lưu thay đổi' : <><Icon name="plus" size={17}/> Tạo danh mục</>}</button></div>
        </form>
      </section>
    </div>
  )
}
