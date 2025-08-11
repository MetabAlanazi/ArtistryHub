import { adminMiddleware } from '@artistry-hub/auth'

export default adminMiddleware

export const config = { 
  matcher: ['/((?!_next|static|public|api/health).*)'] 
}
