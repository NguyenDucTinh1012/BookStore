export function LoadingState({ label = 'Đang tải dữ liệu...' }) {
  return <div className="store-state"><span className="store-spinner"/><p>{label}</p></div>
}

export function ErrorState({ message, onRetry }) {
  return <div className="store-state store-error-state"><span className="store-state-icon">!</span><h2>Chưa thể tải dữ liệu</h2><p>{message}</p>{onRetry && <button className="store-button store-button-outline" onClick={onRetry}>Thử tải lại</button>}</div>
}

export function EmptyState({ title, description, children }) {
  return <div className="store-state store-empty-state"><span className="store-state-icon">✧</span><h2>{title}</h2><p>{description}</p>{children}</div>
}
