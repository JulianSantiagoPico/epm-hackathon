import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROLES, PERMISSIONS } from "../utils/constants";

export const useUserStore = create(
  persist(
    (set) => ({
      // Estado inicial: Admin por defecto para desarrollo
      currentRole: ROLES.ADMIN,

      // Obtener permisos del rol actual
      permissions: PERMISSIONS[ROLES.ADMIN],

      // Cambiar rol del usuario
      setRole: (role) =>
        set({
          currentRole: role,
          permissions: PERMISSIONS[role],
        }),

      // Verificar si el usuario tiene un permiso específico
      hasPermission: (permission) => {
        const state = useUserStore.getState();
        return state.permissions[permission] === true;
      },
    }),
    {
      name: "user-storage", // nombre del item en localStorage
    }
  )
);
