export default function Toast({ message, type = 'success', show }) {
  return (
    <div className={`toast ${type === 'error' ? 'toast-error' : ''} ${show ? 'show' : ''}`} role="status">
      <span className="toast-dot" />
      {message}
    </div>
  )
}
