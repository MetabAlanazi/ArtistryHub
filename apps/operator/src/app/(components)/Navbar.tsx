import NavbarClient from './NavbarClient'
import { getCurrentUser } from '../../lib/auth'

export default async function Navbar() {
  const user = await getCurrentUser()
  // only pass minimal fields to client
  const minimal = user
    ? { name: user.name, image: user.image ?? null }
    : null
  return <NavbarClient user={minimal} />
}
