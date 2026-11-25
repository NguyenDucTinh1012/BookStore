import Icon from './Icon.jsx'

export default function Toast({ message }) {
  if (!message) return null

  return (
    <div className="toast-message" role="status" aria-live="polite">
      <span><Icon name="check" size={17}/></span>
      {message}
    </div>
  )
}
