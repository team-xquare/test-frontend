import { useAuthStore } from '../stores/auth'

export default function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">DASHBOARD</h1>
        <p className="text-primary-400 mt-2">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">ACTIVE DEPLOYMENTS</h3>
          <div className="text-2xl font-bold text-primary-300">0</div>
          <p className="text-sm text-primary-500 mt-1">Applications running</p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">TOTAL PROJECTS</h3>
          <div className="text-2xl font-bold text-primary-300">0</div>
          <p className="text-sm text-primary-500 mt-1">Projects created</p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">GITHUB REPOS</h3>
          <div className="text-2xl font-bold text-primary-300">0</div>
          <p className="text-sm text-primary-500 mt-1">Connected repositories</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">RECENT ACTIVITY</h3>
        <div className="text-primary-500 text-sm">
          No recent activity
        </div>
      </div>
    </div>
  )
}