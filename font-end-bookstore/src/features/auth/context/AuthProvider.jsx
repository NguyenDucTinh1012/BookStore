import { useState } from 'react'
import AuthContext from './authContext.js'
import { getLocalSession, loginLocalUser, logoutLocalUser, registerLocalUser } from '../api/localAuth.js'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(getLocalSession)
  async function login(credentials) { const sessionUser = await loginLocalUser(credentials); setUser(sessionUser); return sessionUser }
  async function register(account) { const sessionUser = await registerLocalUser(account); setUser(sessionUser); return sessionUser }
  function logout() { logoutLocalUser(); setUser(null) }
  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}
