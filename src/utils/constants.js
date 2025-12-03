// Definición de roles y permisos del sistema
export const ROLES = {
  ADMIN: "admin",
  DECISION_MAKER: "tomador_decisiones",
  OPERATOR: "operativo",
};

// Matriz de permisos por rol
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    label: "Administrador",
    canUploadFiles: true,
    canTriggerRetrain: true,
    canViewLogs: true,
    canAccessDashboard: true,
    canViewModels: true,
    canViewCorrelations: true,
    canViewAlerts: true,
    canViewBalances: true,
    canExportReports: true,
    canManageAlerts: false,
  },
  [ROLES.DECISION_MAKER]: {
    label: "Tomador de Decisiones",
    canUploadFiles: false,
    canTriggerRetrain: false,
    canViewLogs: false,
    canAccessDashboard: true,
    canViewModels: true,
    canViewCorrelations: true,
    canViewAlerts: true,
    canViewBalances: true,
    canExportReports: true,
    canManageAlerts: false,
  },
  [ROLES.OPERATOR]: {
    label: "Usuario Operativo",
    canUploadFiles: false,
    canTriggerRetrain: false,
    canViewLogs: false,
    canAccessDashboard: false,
    canViewModels: false,
    canViewCorrelations: false,
    canViewAlerts: true,
    canViewBalances: true,
    canExportReports: false,
    canManageAlerts: true,
  },
};

// Rutas de navegación por rol
export const NAVIGATION_ITEMS = {
  [ROLES.ADMIN]: [
    { path: "/admin", label: "Gestión de Datos", icon: "Upload" },
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/modelos", label: "Modelos", icon: "Brain" },
    { path: "/correlaciones", label: "Correlaciones", icon: "Network" },
    { path: "/balances", label: "Balances", icon: "Scale" },
    { path: "/alertas", label: "Alertas", icon: "AlertTriangle" },
  ],
  [ROLES.DECISION_MAKER]: [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/modelos", label: "Modelos", icon: "Brain" },
    { path: "/correlaciones", label: "Correlaciones", icon: "Network" },
    { path: "/balances", label: "Balances", icon: "Scale" },
    { path: "/alertas", label: "Alertas", icon: "AlertTriangle" },
  ],
  [ROLES.OPERATOR]: [
    { path: "/alertas", label: "Alertas", icon: "AlertTriangle" },
    { path: "/balances", label: "Balances", icon: "Scale" },
  ],
};
