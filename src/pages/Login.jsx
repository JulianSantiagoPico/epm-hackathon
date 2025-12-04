import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Shield, TrendingUp, Users, ArrowLeft } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { ROLES } from "../utils/constants";

const Login = () => {
  const navigate = useNavigate();
  const setRole = useUserStore((state) => state.setRole);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogin = () => {
    if (selectedRole) {
      setRole(selectedRole);
      navigate("/");
    }
  };

  const roles = [
    {
      key: ROLES.ADMIN,
      name: "Administrador",
      icon: <Shield className="w-12 h-12" />,
      description: "Acceso completo al sistema, gestión de datos y modelos",
      color: "from-error/20 to-error/5 border-error",
      textColor: "text-error",
    },
    {
      key: ROLES.DECISION_MAKER,
      name: "Tomador de Decisiones",
      icon: <TrendingUp className="w-12 h-12" />,
      description: "Dashboard ejecutivo, análisis y métricas estratégicas",
      color: "from-primary/20 to-primary/5 border-primary",
      textColor: "text-primary",
    },
    {
      key: ROLES.OPERATOR,
      name: "Operador",
      icon: <Users className="w-12 h-12" />,
      description: "Consulta de balances y gestión de alertas operativas",
      color: "from-secondary/20 to-secondary/5 border-secondary",
      textColor: "text-secondary",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-backgroundSecondary to-white flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full">
        {/* Back to Landing */}
        <button
          onClick={() => navigate("/landing")}
          className="mb-8 flex items-center gap-2 text-textSecondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la página principal
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <LogIn className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-textMain mb-4">
            Acceso a Balanc-IA
          </h1>
          <p className="text-lg text-textSecondary max-w-2xl mx-auto">
            Selecciona tu rol para acceder a las funcionalidades
            correspondientes del sistema
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => setSelectedRole(role.key)}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200
                ${
                  selectedRole === role.key
                    ? `bg-linear-to-br ${role.color} shadow-lg scale-105`
                    : "bg-white border-border hover:shadow-md hover:border-primary/30"
                }
              `}
            >
              <div
                className={`mb-4 ${
                  selectedRole === role.key
                    ? role.textColor
                    : "text-textSecondary"
                }`}
              >
                {role.icon}
              </div>
              <h3 className="text-xl font-semibold text-textMain mb-2">
                {role.name}
              </h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                {role.description}
              </p>

              {selectedRole === role.key && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Seleccionado
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Login Button */}
        <div className="text-center">
          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={`
              px-12 py-4 rounded-lg font-semibold text-white shadow-lg
              transition-all duration-200 flex items-center gap-3 mx-auto
              ${
                selectedRole
                  ? "bg-primary hover:bg-secondary hover:shadow-xl"
                  : "bg-border cursor-not-allowed opacity-50"
              }
            `}
          >
            <LogIn className="w-5 h-5" />
            Iniciar Sesión
          </button>

          {!selectedRole && (
            <p className="mt-4 text-sm text-textSecondary">
              Selecciona un rol para continuar
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-primary/10 border-l-4 border-primary rounded-lg">
          <h4 className="font-semibold text-textMain mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Sistema de Roles
          </h4>
          <p className="text-sm text-textSecondary leading-relaxed">
            Balanc-IA implementa un sistema de control de acceso basado en roles
            (RBAC). Cada usuario tiene permisos específicos según su rol en la
            organización, garantizando la seguridad y el acceso apropiado a la
            información sensible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
