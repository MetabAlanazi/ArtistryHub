export type AdminSection = "dashboard" | "catalog" | "orders" | "customers" | "analytics" | "system" | "settings";

export const SUB_NAV: Record<AdminSection, { key: string; label: string; href: string; roles?: string[] }[]> = {
  catalog: [
    { key: "all", label: "All Products", href: "/products" },
    { key: "paintings", label: "Paintings", href: "/catalog/paintings" },
    { key: "posters", label: "Posters", href: "/catalog/posters" },
    { key: "collectibles", label: "Collectibles", href: "/catalog/collectibles" },
    { key: "media", label: "Media Library", href: "/catalog/media" },
  ],
  orders: [
    { key: "all", label: "All Orders", href: "/orders" },
    { key: "pending", label: "Pending", href: "/orders/pending" },
    { key: "shipped", label: "Shipped", href: "/orders/shipped" },
    { key: "refunds", label: "Refunds", href: "/orders/refunds" },
  ],
  dashboard: [],
  customers: [],
  analytics: [],
  system: [
    { key: "health", label: "System Health", href: "/system/health" },
    { key: "logs", label: "System Logs", href: "/system/logs" },
    { key: "performance", label: "Performance", href: "/system/performance" },
  ],
  settings: [],
};

// RBAC stub
export const canSee = (role: string, roles?: string[]) => !roles || roles.includes(role);
