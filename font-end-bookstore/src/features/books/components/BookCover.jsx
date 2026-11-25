import { useState } from 'react'

export default function BookCover({ src, title, className = '', onFail }) {
  const [failed, setFailed] = useState(false)
  const imageUrl = src?.trim()

  return (
    <div className={`book-cover ${className} ${!imageUrl || failed ? 'book-cover-fallback' : ''}`}>
      {imageUrl && !failed
        ? <img src={imageUrl} alt={`Bìa sách ${title}`} loading="lazy" onError={() => { setFailed(true); onFail?.() }}/>
        : <div className="cover-fallback-content"><span>▧</span><small>{imageUrl ? 'Ảnh lỗi' : 'Chưa có ảnh'}</small></div>}
    </div>
  )
}
