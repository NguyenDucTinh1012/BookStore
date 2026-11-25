import { useState } from 'react'
import Icon from '../../../components/ui/Icon.jsx'

export default function StoreBookCover({ src, title, className = '' }) {
  const [failed, setFailed] = useState(false)
  const imageUrl = src?.trim()
  return <div className={`store-book-cover ${className} ${!imageUrl || failed ? 'store-cover-fallback' : ''}`}>{imageUrl && !failed ? <img src={imageUrl} alt={`Bìa sách ${title}`} loading="lazy" onError={() => setFailed(true)}/> : <div className="store-cover-placeholder"><Icon name="bookOpen" size={27}/><small>{imageUrl ? 'Ảnh chưa tải được' : 'Chưa có ảnh bìa'}</small></div>}</div>
}
