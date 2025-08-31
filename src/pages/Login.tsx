import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authAPI, LoginRequest } from '../api/auth'
import { useAuthStore } from '../stores/auth'

export default function Login() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  })
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      login(response.data)
      navigate('/')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Login failed')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="card p-8 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">LOGIN</h1>
          <p className="text-primary-400 text-sm">Access the deployment platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="input-field w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="input-field w-full"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-primary w-full"
          >
            {loginMutation.isPending ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-primary-400">Need an account? </span>
          <Link to="/register" className="text-white hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}