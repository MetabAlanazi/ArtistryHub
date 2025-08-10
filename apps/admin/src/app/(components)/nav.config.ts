export type NavItem = { label: string; href: string }

export const APP_TITLE = 'Admin'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Users', href: '/users' },
  { label: 'Products', href: '/products' },
  { label: 'Orders', href: '/orders' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Operations', href: '/ops' },
]
