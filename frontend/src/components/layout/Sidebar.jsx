import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  LayoutDashboard,
  Brain,
  Network,
  Scale,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import { useUserStore } from "../../stores/userStore";
import { NAVIGATION_ITEMS, PERMISSIONS } from "../../utils/constants";

// Mapeo de nombres de iconos a componentes
const iconMap = {
  Upload,
  LayoutDashboard,
  Brain,
  Network,
  Scale,
  AlertTriangle,
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, logout } = useUserStore();

  // Obtener items de navegación según el rol
  const navigationItems = NAVIGATION_ITEMS[currentRole] || [];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`
        ${isCollapsed ? "w-20" : "w-64"}
        bg-primary text-white h-screen fixed left-0 top-0
        transition-all duration-300 ease-in-out
        flex flex-col shadow-lg z-50
      `}
    >
      {/* Header con Logo y Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-secondary">
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">EPM Gas</h1>
            <span className="text-xs text-success opacity-80">
              {PERMISSIONS[currentRole]?.label}
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      active
                        ? "bg-secondary text-white shadow-md"
                        : "text-white/80 hover:bg-secondary/50 hover:text-white"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                  title={isCollapsed ? item.label : ""}
                >
                  {Icon && <Icon className="w-5 h-5 shrink-0" />}
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer con Logout (opcional para después) */}
      <div className="border-t border-secondary p-4">
        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg
            text-white/80 hover:bg-secondary/50 hover:text-white
            transition-colors w-full
            ${isCollapsed ? "justify-center" : ""}
          `}
          title={isCollapsed ? "Cerrar sesión" : ""}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
