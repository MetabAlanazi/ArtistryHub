import NavbarClient from './NavbarClient'
import { getCurrentUser } from '../../lib/auth'

export default async function Navbar() {
  try {
    const user = await getCurrentUser()
    // only pass minimal fields to client
    const minimal = user
      ? { name: user.name, email: user.email, image: user.image ?? null, role: user.role }
      : null
    return <NavbarClient user={minimal} />
  } catch (error) {
    console.error('Error getting current user:', error)
    // Return navbar without user data if there's an error
    return <NavbarClient user={null} />
  }
}
