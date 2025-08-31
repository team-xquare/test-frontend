import { useState } from 'react'
import { DeployAddonRequest } from '../api/projects'

interface AddonFormProps {
  onSubmit: (data: DeployAddonRequest) => void
  onCancel: () => void
  isLoading: boolean
}

export default function AddonForm({ onSubmit, onCancel, isLoading }: AddonFormProps) {
  const [formData, setFormData] = useState<DeployAddonRequest>({
    name: '',
    type: 'mysql',
    tier: 'x3.small',
    storage: '20Gi',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const getDefaultStorage = (type: string) => {
    switch (type) {
      case 'mysql':
      case 'rabbitmq':
        return '20Gi'
      case 'postgresql':
      case 'mongodb':
        return '50Gi'
      case 'redis':
        return '10Gi'
      case 'kafka':
        return '100Gi'
      default:
        return '20Gi'
    }
  }

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      type,
      storage: getDefaultStorage(type),
    })
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-6">DEPLOY ADDON</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Addon Name</label>
            <input
              type="text"
              required
              className="input-field w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              className="input-field w-full"
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="mysql">MySQL Database</option>
              <option value="postgresql">PostgreSQL Database</option>
              <option value="redis">Redis Cache</option>
              <option value="mongodb">MongoDB</option>
              <option value="kafka">Apache Kafka</option>
              <option value="rabbitmq">RabbitMQ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tier</label>
            <select
              className="input-field w-full"
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
            >
              <option value="x3.micro">x3.micro</option>
              <option value="x3.small">x3.small</option>
              <option value="x3.medium">x3.medium</option>
              <option value="x3.large">x3.large</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Storage</label>
            <input
              type="text"
              required
              className="input-field w-full"
              value={formData.storage}
              onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'DEPLOYING...' : 'DEPLOY'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  )
}