export { socialWorkerMiddleware as middleware } from '@artistry-hub/auth/middleware'

export const config = { 
  matcher: ['/((?!_next|static|public|api/health).*)'] 
}
