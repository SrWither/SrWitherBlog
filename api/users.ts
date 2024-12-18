import type { RecordId } from "surrealdb";
import { authenticate } from "./auth";
import { db } from "./connect";

export type User = {
  id: RecordId;
  username: string;
  email: string;
  role: RecordId;
  password: string;
};

/**
 * Retrieves the authenticated user's information based on the provided token.
 * @param token - Authentication token for authorization.
 * @returns A promise that resolves to the authenticated user object or null if authentication fails or user information is not available.
 */
export const getMyUser = async (token: string): Promise<User | null> => {
  try {
    const isAuthenticated = await authenticate(token);
    if (!isAuthenticated) {
      return null;
    }

    const user = await db.info<User>();
    if (!user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

export const getServerUserById = async (id: RecordId): Promise<User | null> => {
  try {
    const { $sdb } = useNuxtApp();
    const user = await $sdb.select<User>(id);
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: RecordId): Promise<User | null> => {
  try {
    const user = await db.select<User>(id);
    return user;
  } catch {
    return null;
  }
};
