import type { RecordId } from "surrealdb";
import { authenticate } from "./auth";
import { db } from "./connect";

export type Post = {
  id?: RecordId;
  title: string;
  description: string;
  content: string;
  published: boolean;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
  user?: RecordId;
  category: RecordId;
  tags?: string[];
};

/**
 * Creates a new post.
 * @param token - Authentication token for authorization.
 * @param data - Data object containing post details.
 * @returns A promise that resolves to the created post or null if authentication fails.
 */
export const createPost = async (
  token: string,
  data: Post
): Promise<Post | null> => {
  try {
    const isAuthenticated = await authenticate(token);
    if (!isAuthenticated) {
      console.error("You are not authenticated");
      return null;
    }
    const [post] = await db.create<Post>("Posts", data);

    return post;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Updates an existing post.
 * @param token - Authentication token for authorization.
 * @param id - ID of the post to update.
 * @param data - Updated data for the post.
 * @returns A promise that resolves to the updated post or null if authentication fails.
 */
export const updatePost = async (
  token: string,
  id: RecordId,
  data: Post
): Promise<Post | null> => {
  try {
    const isAuthenticated = await authenticate(token);
    if (!isAuthenticated) {
      console.error("You are not authenticated");
      return null;
    }
    const post = await db.merge<Post>(id, data);

    return post;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Retrieves a post by ID.
 * @param id - ID of the post to retrieve.
 * @returns A promise that resolves to the post object or null if not found.
 */
export const getServerPost = async (id: RecordId): Promise<Post | null> => {
  const { $sdb } = useNuxtApp();

  try {
    const post = await $sdb.select<Post>(id);
    return post;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getPost = async (id: RecordId): Promise<Post | null> => {
  try {
    const post = await db.select<Post>(id);
    return post;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Retrieves posts by category ID.
 * @param id - ID of the category to filter posts by.
 * @returns A promise that resolves to an array of posts.
 */
export const getServerPostsByCat = async (id: RecordId): Promise<Post[]> => {
  const { $sdb } = useNuxtApp();

  try {
    const [posts] = await $sdb.query<[Post[]]>(
      `SELECT * FROM Posts WHERE category = ${id}`
    );
    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getPostsByCat = async (id: RecordId): Promise<Post[]> => {
  try {
    const [posts] = await db.query<[Post[]]>(
      `SELECT * FROM Posts WHERE category = ${id}`
    );
    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * Retrieves the last 3 posts ordered by creation date.
 * @returns A promise that resolves to an array of posts.
 */
export const getServerLastsPosts = async (): Promise<Post[]> => {
  const { $sdb } = useNuxtApp();

  try {
    const [posts] = await $sdb.query<[Post[]]>(
      `SELECT * FROM Posts WHERE published = true ORDER BY created_at DESC LIMIT 3`
    );
    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getLastsPosts = async (): Promise<Post[]> => {
  try {
    const [posts] = await db.query<[Post[]]>(
      `SELECT * FROM Posts WHERE published = true ORDER BY created_at DESC LIMIT 3`
    );
    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getUnpublishedPosts = async (): Promise<Post[]> => {
  try {
    const [posts] = await db.query<[Post[]]>(
      `SELECT * FROM Posts WHERE published = false`
    );
    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * Retrieves posts filtered by category and search filter.
 * @param category - Category ID to filter posts by.
 * @param filter - Search filter string to match against title, description, or tags.
 * @returns A promise that resolves to an array of posts.
 */
export const getServerPostsByFilters = async (
  category: string,
  filter: string
): Promise<Post[]> => {
  const { $sdb } = useNuxtApp();

  try {
    let query = "SELECT * FROM Posts";
    const conditions = [];

    if (category && category !== "all") {
      conditions.push(`category = ${category}`);
    }

    if (filter && filter.trim() !== "") {
      conditions.push(
        `(title CONTAINS '${filter}' OR description CONTAINS '${filter}' OR tags CONTAINS '${filter}')`
      );
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const [posts] = await $sdb.query<[Post[]]>(query);

    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getPostsByFilters = async (
  category: string,
  filter: string
): Promise<Post[]> => {
  try {
    let query = "SELECT * FROM Posts";
    const conditions = [];

    if (category && category !== "all") {
      conditions.push(`category = ${category}`);
    }

    if (filter && filter.trim() !== "") {
      conditions.push(
        `(title CONTAINS '${filter}' OR description CONTAINS '${filter}' OR tags CONTAINS '${filter}')`
      );
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const [posts] = await db.query<[Post[]]>(query);

    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};

/**
 * Retrieves all posts.
 * @returns A promise that resolves to an array of posts.
 */
export const getServerPosts = async (): Promise<Post[]> => {
  const { $sdb } = useNuxtApp();

  try {
    const posts = await $sdb.select<Post>("Posts");
    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const posts = await db.select<Post>("Posts");
    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
};
/**
 * Deletes a post by ID.
 * @param token - Authentication token for authorization.
 * @param id - ID of the post to delete.
 * @returns A promise that resolves to true if deletion is successful, false otherwise.
 */
export const deletePost = async (
  token: string,
  id: RecordId
): Promise<boolean> => {
  try {
    const isAuthenticated = await authenticate(token);
    if (!isAuthenticated) {
      console.error("You are not authenticated");
      return false;
    }

    await db.delete<Post>(id);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
