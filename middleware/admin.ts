// middleware/admin.ts
import { getMyUser } from "@/api/users";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.token) {
    // Si no hay token, redirigir a la página de no autorizado
    throw createError({
      statusCode: 403,
      statusText: "Forbidden",
    })
  }

  try {
    // Intentar obtener la información del usuario
    const user = await getMyUser(authStore.token);

    if (user) {
      // Verificar si el rol del usuario es "admin"
      if (user.role && user.role.toString() === "roles:admin") {
        // Usuario es administrador, permitir navegación
        return;
      } else {
        // Usuario no es administrador, redirigir a la página de no autorizado
        throw createError({
          statusCode: 403,
          statusText: "Forbidden",
        })
      }
    }
  } catch (error) {
    // Error al obtener el usuario, redirigir a la página de inicio de sesión
    console.error("Error al obtener usuario:", error);
    return navigateTo("/login");
  }
});
