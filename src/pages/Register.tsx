import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authAPI, RegisterRequest } from '../api/auth'

export default function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    name: '',
  })
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      alert('Registration successful! Please login.')
      navigate('/login')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Registration failed')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="card p-8 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">REGISTER</h1>
          <p className="text-primary-400 text-sm">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              required
              className="input-field w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

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
              minLength={8}
              className="input-field w-full"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <p className="text-xs text-primary-500 mt-1">
              Minimum 8 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="btn-primary w-full"
          >
            {registerMutation.isPending ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-primary-400">Already have an account? </span>
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}