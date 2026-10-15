import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { getGitHubContributions } from '../api/github-contributions.js'
import type { IncomingMessage, ServerResponse } from 'node:http'

function contributionMiddleware(token: string) {
  return async (
    request: IncomingMessage,
    response: ServerResponse,
    next: (error?: Error) => void,
  ) => {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname
    if (pathname !== '/api/github-contributions') return next()
    if (request.method !== 'GET') {
      response.statusCode = 405
      response.setHeader('Allow', 'GET')
      response.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }
    if (!token) {
      response.statusCode = 503
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ error: 'Set GITHUB_TOKEN in cj-portfolio/.env.local' }))
      return
    }

    try {
      const data = await getGitHubContributions(token)
      response.statusCode = 200
      response.setHeader('Cache-Control', 'no-store')
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(data))
    } catch (error) {
      console.error('Local GitHub contribution endpoint failed', error)
      response.statusCode = 502
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ error: 'Could not retrieve GitHub contributions' }))
    }
  }
}

function contributionApi(token: string): Plugin {
  const middleware = contributionMiddleware(token)

  return {
    name: 'local-github-contributions-api',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), contributionApi(env.GITHUB_TOKEN || '')],
  }
})
