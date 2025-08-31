import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { authAPI } from '../api/auth'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, refreshToken, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      navigate('/login')
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold">
                DEPLOY
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-medium border ${
                    isActive('/') 
                      ? 'border-white bg-white text-black' 
                      : 'border-transparent hover:border-primary-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className={`px-3 py-2 text-sm font-medium border ${
                    isActive('/projects') 
                      ? 'border-white bg-white text-black' 
                      : 'border-transparent hover:border-primary-600'
                  }`}
                >
                  Projects
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-primary-400">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}