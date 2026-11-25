import Icon from '../../../components/ui/Icon.jsx'

export default function DeleteCategoryModal({ category, saving, error, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-category-title">
        <div className="dialog-top"><span className="dialog-icon"><Icon name="trash" size={20}/></span><button className="dialog-close" aria-label="Đóng" onClick={onClose}><Icon name="close" size={19}/></button></div>
        <h2 id="delete-category-title">Xóa danh mục này?</h2>
        <p className="dialog-description">Bạn sắp xóa <b>{category.categoryName}</b>. Thao tác này không thể hoàn tác.</p>
        {error && <div className="form-error">{error}</div>}
        <div className="dialog-actions"><button className="secondary-button" onClick={onClose} disabled={saving}>Hủy</button><button className="danger-button" onClick={onConfirm} disabled={saving}>{saving ? 'Đang xóa…' : 'Xóa danh mục'}</button></div>
      </section>
    </div>
  )
}
