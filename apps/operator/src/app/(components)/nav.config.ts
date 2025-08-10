export type NavItem = { label: string; href: string }

export const APP_TITLE = 'Operator'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Queue', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Shipments', href: '/shipments' },
  { label: 'Returns', href: '/returns' },
  { label: 'Reports', href: '/reports' },
]
