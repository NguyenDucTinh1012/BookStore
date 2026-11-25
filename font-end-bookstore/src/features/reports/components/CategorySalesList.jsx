import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency } from '../../../shared/utils/formatters.js'

export default function CategorySalesList({ categories, loading }) {
  const maxQuantity = Math.max(...categories.map((category) => category.quantity), 1)

  return (
    <section className="report-panel category-sales-panel"><div className="report-panel-heading"><div><h2>Hiệu quả theo danh mục</h2><p>Gộp OrderDetails qua CategoryId của Books · loại đơn đã hủy</p></div></div>{loading ? <div className="report-empty compact">Đang tổng hợp danh mục…</div> : categories.length ? <div className="category-sales-list">{categories.map((category, index) => <article className="category-sales-row" key={category.categoryId ?? category.name}><span className={`category-sales-icon mark-${index % 5}`}><Icon name="layers" size={16}/></span><div className="category-sales-info"><div><b>{category.name}</b><small>{category.quantity} cuốn · {formatCurrency(category.amount)}</small></div><div className="category-sales-track"><i style={{ width: `${(category.quantity / maxQuantity) * 100}%` }}/></div></div></article>)}</div> : <div className="report-empty compact">Chưa có dữ liệu danh mục trong kỳ.</div>}</section>
  )
}
