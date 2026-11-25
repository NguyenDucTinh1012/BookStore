import Icon from '../../../components/ui/Icon.jsx'

export default function ComingSoonPanel({ entity, title }) {
  return (
    <main className="page-content">
      <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> QUẢN LÝ ĐƠN HÀNG</div><h1>{title}</h1><p className="page-subtitle">Màn hình quản lý dữ liệu {entity} trong cơ sở dữ liệu BookStore.</p></div></section>
      <section className="table-panel"><div className="empty-state"><span><Icon name="bookOpen" size={25}/></span><h3>Đang chuẩn bị giao diện</h3><p>Phần quản lý {title.toLocaleLowerCase('vi')} sẽ được nối với API tương ứng.</p></div></section>
    </main>
  )
}
