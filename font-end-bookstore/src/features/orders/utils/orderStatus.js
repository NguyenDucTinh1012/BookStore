const statuses = {
  0: { label: 'Chờ xử lý', className: 'order-status-pending' },
  1: { label: 'Đã xác nhận', className: 'order-status-confirmed' },
  2: { label: 'Đang giao', className: 'order-status-shipping' },
  3: { label: 'Hoàn tất', className: 'order-status-completed' },
  4: { label: 'Đã hủy', className: 'order-status-cancelled' },
}

export function getOrderStatus(status) {
  return statuses[status] || { label: 'Không xác định', className: 'order-status-unknown' }
}
