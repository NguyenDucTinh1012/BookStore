import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { getOrderById } from '../../orders/api/ordersApi.js'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js'
import { ErrorState, LoadingState } from '../../storefront/components/PageState.jsx'
import OrderStatusBadge from '../../orders/components/OrderStatusBadge.jsx'

export default function CustomerOrderDetailsPage() {
  const { orderId } = useParams(); const [order, setOrder] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { let active = true; getOrderById(orderId).then((data) => { if (active) setOrder(data) }).catch((e) => { if (active) setError(getApiErrorMessage(e)) }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [orderId])
  if (loading) return <section className="store-catalog-page"><LoadingState label="Đang tải chi tiết đơn..."/></section>
  if (error || !order) return <section className="store-catalog-page"><ErrorState message={error || 'Không tìm thấy đơn hàng.'}/></section>
  const items = order.items || order.orderDetails || []
  return <section className="store-catalog-page"><div className="store-breadcrumb"><Link to="/orders">Đơn hàng của tôi</Link><Icon name="chevron" size={14}/><span>Đơn #{order.orderId}</span></div><div className="store-page-intro order-detail-intro"><div><span className="store-eyebrow">ORDER #{order.orderId}</span><h1>Chi tiết đơn hàng</h1><p>Đặt ngày {formatDate(order.orderDate)}</p></div><OrderStatusBadge status={order.status}/></div><div className="customer-order-detail-grid"><section className="customer-order-panel"><h2>Sách trong đơn</h2>{items.map((item) => <div className="customer-order-line" key={item.orderDetailId ?? `${item.bookId}-${item.unitPrice}`}><div><b>{item.bookTitle || item.title}</b><span>{item.quantity} × {formatCurrency(item.unitPrice)}</span></div><strong>{formatCurrency(item.subTotal ?? item.quantity * item.unitPrice)}</strong></div>)}<div className="store-checkout-total"><span>Tổng cộng</span><b>{formatCurrency(order.totalAmount ?? order.total ?? items.reduce((sum, item) => sum + Number(item.subTotal ?? item.quantity * item.unitPrice), 0))}</b></div></section><aside className="customer-order-panel"><h2>Thông tin nhận hàng</h2><dl><dt>Người nhận</dt><dd>{order.receiverName}</dd><dt>Số điện thoại</dt><dd>{order.phone}</dd><dt>Địa chỉ</dt><dd>{order.address}</dd></dl><Link className="store-inline-link" to="/categories">Tiếp tục mua sách <Icon name="chevron" size={15}/></Link></aside></div></section>
}
