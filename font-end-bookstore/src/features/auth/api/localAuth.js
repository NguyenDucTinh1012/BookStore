const USERS_KEY = 'bookstore.demo.users.v1'
const SESSION_KEY = 'bookstore.demo.session.v1'
export const DEMO_ADMIN = { name: 'BookStore Admin', email: 'admin@bookstore.local', password: 'Admin123!' }

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function saveSession(user) {
  const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
  return sessionUser
}

export function getLocalSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export async function registerLocalUser({ name, email, password, role }) {
  const normalizedEmail = email.trim().toLocaleLowerCase('vi')
  const users = readUsers()
  if (normalizedEmail === DEMO_ADMIN.email) {
    throw new Error('Email này được dành riêng cho tài khoản admin demo.')
  }
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Email này đã được đăng ký trên trình duyệt.')
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: role === 'admin' ? 'admin' : 'customer',
  }
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return saveSession(user)
}

export async function loginLocalUser({ email, password }) {
  const normalizedEmail = email.trim().toLocaleLowerCase('vi')
  const passwordHash = await hashPassword(password)
  const users = readUsers()
  let user = users.find((item) => item.email === normalizedEmail && item.passwordHash === passwordHash)
  if (!user && normalizedEmail === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    user = { id: 'bookstore-demo-admin', name: DEMO_ADMIN.name, email: DEMO_ADMIN.email, passwordHash, role: 'admin' }
    users.push(user)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
  if (!user) throw new Error('Email hoặc mật khẩu chưa đúng.')
  return saveSession(user)
}

export function logoutLocalUser() {
  sessionStorage.removeItem(SESSION_KEY)
}
