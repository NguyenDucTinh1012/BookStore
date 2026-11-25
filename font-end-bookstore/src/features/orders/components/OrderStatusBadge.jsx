import { getOrderStatus } from '../utils/orderStatus.js'

export default function OrderStatusBadge({ status }) {
  const config = getOrderStatus(status)
  return <span className={`order-status ${config.className}`}><i/>{config.label}</span>
}
