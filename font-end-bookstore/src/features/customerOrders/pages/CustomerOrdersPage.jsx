import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { getMyOrders } from '../../orders/api/ordersApi.js'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js'
import { EmptyState, ErrorState, LoadingState } from '../../storefront/components/PageState.jsx'
import OrderStatusBadge from '../../orders/components/OrderStatusBadge.jsx'

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { let active = true; getMyOrders().then((data) => { if (active) setOrders(data) }).catch((e) => { if (active) setError(getApiErrorMessage(e)) }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [])
  return <section className="store-catalog-page"><div className="store-page-intro"><span className="store-eyebrow">YOUR BOOKSHELF</span><h1>Đơn hàng của tôi</h1><p>Theo dõi tình trạng những đơn sách bạn đã đặt.</p></div>{loading ? <LoadingState label="Đang tải đơn hàng..."/> : error ? <ErrorState message={error}/> : orders.length ? <div className="customer-order-list">{orders.map((order) => <Link className="customer-order-card" to={`/orders/${order.orderId}`} key={order.orderId}><div><span>Mã đơn #{order.orderId}</span><small>{formatDate(order.orderDate)}</small></div><div><span>{order.receiverName}</span><small>{order.items?.length ?? order.itemCount ?? 0} sản phẩm</small></div><OrderStatusBadge status={order.status}/><strong>{formatCurrency(order.totalAmount ?? order.total)}</strong><Icon name="chevron" size={17}/></Link>)}</div> : <EmptyState title="Bạn chưa có đơn hàng" description="Đơn hàng đã đặt sẽ được hiển thị tại đây."><Link className="store-button store-button-dark" to="/categories">Khám phá sách</Link></EmptyState>}</section>
}
