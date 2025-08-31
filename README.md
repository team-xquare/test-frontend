# Deployment Platform Frontend

A minimal React frontend for the educational deployment platform with black/white sharp UI design.

## Features

- **Authentication**: Login/register with JWT tokens
- **Projects**: Create and manage deployment projects
- **Applications**: Deploy with full YAML config support
- **Addons**: Deploy databases and infrastructure
- **Sharp UI**: Black/white minimalist design

## Supported Build Types

- Gradle (Spring Boot)
- Node.js Backend
- React Frontend
- Vite Frontend  
- Vue.js Frontend
- Next.js Full-stack
- Go Backend
- Rust Backend
- Maven (Spring Boot)
- Django Backend
- Flask Backend
- Docker (Custom)

## Supported Addons

- MySQL Database
- PostgreSQL Database
- Redis Cache
- MongoDB
- Apache Kafka
- RabbitMQ

## Technologies

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Tanstack React Query
- Zustand (State Management)
- Vite (Build Tool)

## Running

```bash
cd test-frontend
npm install
npm run dev
```

## API Configuration

Update `src/api/client.ts` to point to your backend:

```typescript
const API_URL = 'http://localhost:8080/api/v1'
```