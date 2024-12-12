import { defineStore } from "pinia";
import { getMyUser, type User } from "~/api/users";
import { authenticate } from "~/api/auth";

const getItemFromLocalStorage = <T>(key: string): T | undefined => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : undefined;
};

export const useAuthStore = defineStore("authstore", () => {
  const token = useState<string | undefined>("auth", () =>
    getItemFromLocalStorage("auth")
  );
  const user = useState<User | undefined>("user", () => undefined);

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem("auth", JSON.stringify(newToken));
  };

  const clearToken = () => {
    token.value = undefined;
    user.value = undefined;
    localStorage.removeItem("auth");
  };

  const checkToken = async (): Promise<boolean> => {
    if (token.value) {
      const isAuthenticated = await authenticate(token.value);
      if (!isAuthenticated) {
        clearToken();
      }
      return isAuthenticated;
    }
    return false;
  };

  const fetchUser = async () => {
    if (token.value) {
      const fetchedUser = await getMyUser(token.value);
      if (fetchedUser) {
        user.value = fetchedUser;
      }
    }
  };

  const initializeAuth = async () => {
    const isAuthenticated = await checkToken();
    console.log(isAuthenticated)
    if (isAuthenticated) {
      await fetchUser();
    }
  };

  return {
    token,
    user,
    setToken,
    clearToken,
    checkToken,
    fetchUser,
    initializeAuth,
  };
});
