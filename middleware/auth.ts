// middleware/auth.ts
import { authenticate } from '@/api/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    // Si el usuario tiene un token y está navegando a páginas de login o registro
    if (to.path === '/login' || to.path === '/register') {
      try {
        const isAuth = await authenticate(authStore.token);

        if (isAuth) {
          // Si está autenticado, redirigir a la página de inicio
          return navigateTo('/');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        return navigateTo('/login');
      }
    }
  } else if (
    // Si no hay token y está intentando acceder a rutas protegidas
    ['/createpost', '/editpost', '/profile', '/myprofile'].some((path) => to.path.startsWith(path))
  ) {
    return navigateTo('/');
  }
});
