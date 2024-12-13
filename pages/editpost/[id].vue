<script setup lang="ts">
import { updatePost, getPost, type Post, deletePost } from "@/api/posts";
import { type Category, getCategories } from "@/api/categories";
import { authenticate } from "@/api/auth";
import { uploadImage } from "@/api/images";
import { type User, getMyUser } from "@/api/users";
import { RecordId } from "surrealdb";

interface Option {
  value: unknown;
  label: string;
}

definePageMeta({
  middleware: "auth",
})

const categories = ref<Category[]>([]);
const optionCategories = ref<Option[]>([]);
const isPreviewOnly = ref(false);

const postName = ref<string>("");

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();
const user = ref<User | null>(null);

const postIdString = route.params.id as string;
const postIdSplited = postIdString.split(":");
const postId = new RecordId(postIdSplited[0], postIdSplited[1]);

const isAuthenticated = ref(false);
const posttags = ref<string>("");
const updatepost = reactive<Post>({
  title: "",
  content: "",
  description: "",
  image: "",
  published: false,
  category: "" as unknown as RecordId,
  tags: [],
});

const textarea = ref<HTMLTextAreaElement | null>(null);
const cursorPos = ref(0);

const loadPostData = async () => {
  if (postId) {
    const postData = await getPost(postId);
    if (!postData) {
      router.back();
      return false;
    }
    posttags.value = postData.tags?.join(" ") || "";
    Object.assign(updatepost, postData);
  }
  return true;
};

const updateCursorPos = () => {
  if (textarea.value) {
    cursorPos.value = textarea.value.selectionStart;
  }
};

onBeforeMount(async () => {
  isAuthenticated.value = await authenticate(authStore.token || "");
  user.value = await getMyUser(authStore.token || "");
  if (!isAuthenticated.value) {
    router.push("/");
    return;
  }
  if (!user.value) {
    router.push("/");
    return;
  }

  await loadPostData();

  if (!(updatepost.user?.toString() == user.value.id.toString())) {
    router.push("/");
    return;
  }
});

const handleEditPost = async () => {
  if (authStore.token) {
    updatepost.tags = posttags.value.split(" ");
    const post = await updatePost(authStore.token, postId || "", updatepost);
    if (post) {
      router.push(`/posts/${post.id}`);
    }
  }
};

const handleDeletePost = async () => {
  if (authStore.token) {
    const deleted = await deletePost(authStore.token, postId);
    if (deleted) {
      router.push("/");
    }
  }
};

const handleUploadImage = async (file: File) => {
  if (file) {
    const image = await uploadImage(file);
    const mdImage = `![image](srwither_${image})`;
    insertMdImageAtCursor(mdImage);
  }
};

const insertMdImageAtCursor = (mdImage: string) => {
  const content = updatepost.content;
  const start = content.slice(0, cursorPos.value);
  const end = content.slice(cursorPos.value);
  updatepost.content = start + mdImage + end;

  setTimeout(() => {
    if (textarea.value) {
      textarea.value.selectionStart = textarea.value.selectionEnd =
        cursorPos.value + mdImage.length;
      textarea.value.focus();
    }
  }, 0);
};

const handlePaste = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;

  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();

        if (file) {
          await handleUploadImage(file);
          event.preventDefault();
          return;
        }
      }
    }
  }
};

const togglePreview = () => {
  isPreviewOnly.value = !isPreviewOnly.value;
};

onBeforeMount(async () => {
  categories.value = await getCategories();
  optionCategories.value = categories.value.map((category) => ({
    label: category.name,
    value: category.id,
  }));
});
</script>

<template>
  <div class="overflow-hidden">
    <div
      :class="[
        'grid transition-colors',
        isPreviewOnly ? 'grid-cols-1' : 'md:grid-cols-2',
      ]"
      class="dark:bg-zinc-900"
      style="height: calc(100vh - 8rem)"
    >
      <!-- Form Section -->
      <div
        v-if="!isPreviewOnly"
        class="p-4 md:p-8 overflow-auto"
        v-motion
        :initial="{ opacity: 1, x: -100 }"
        :enter="{ opacity: 1, x: 0 }"
      >
        <form @submit.prevent="handleEditPost">
          <!-- Title -->
          <div class="flex justify-center mb-4">
            <h1 class="text-gray-800 dark:text-white text-2xl font-bold">
              Edit Post
            </h1>
          </div>

          <div class="mb-4">
            <BInputLabel text="Title" />
            <BInput
              type="text"
              name="title"
              v-model="updatepost.title"
              placeholder="Title"
            />
          </div>

          <div class="mb-4">
            <BInputLabel text="Description" />
            <BInput
              type="text"
              name="description"
              v-model="updatepost.description"
              placeholder="Description"
            />
          </div>

          <div class="mb-4">
            <BInputLabel text="Image" />
            <BInput
              type="text"
              name="image"
              v-model="updatepost.image"
              placeholder="Image"
            />
          </div>

          <div class="mb-4">
            <BInputLabel text="Category" />
            <BNewSelect
              label="Category"
              name="selectedOption"
              v-model="updatepost.category"
              :options="optionCategories"
            />
          </div>

          <div class="mb-4">
            <BInputLabel text="Content" />
            <textarea
              ref="textarea"
              type="text"
              name="content"
              @click="updateCursorPos"
              @keyup="updateCursorPos"
              @input="updateCursorPos"
              @paste="handlePaste"
              v-model="updatepost.content"
              placeholder="Content"
              class="w-full rounded-md h-32 md:h-48 lg:h-72 xl:h-96 resize-none border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 dark:bg-zinc-700 dark:text-white"
            />
          </div>

          <div class="mb-4">
            <BInputLabel text="Tags" />
            <BInput
              type="text"
              name="tags"
              v-model="posttags"
              placeholder="tags"
            />
          </div>

          <div class="mb-4 flex items-center space-x-2">
            <BInputLabel text="Published:" />
            <input type="checkbox" v-model="updatepost.published" />
          </div>

          <div class="flex justify-center">
            <BBtn label="Edit post" class="w-full" />
          </div>
          <!--Delete post, a form where you have to put the title, thats able a button to delete post-->
        </form>
        <div class="mt-4">
          <BInputLabel text="Delete" />
          <BInput
            type="text"
            name="delete"
            v-model="postName"
            placeholder="Post title"
          />
        </div>
        <div class="flex justify-center mt-4">
          <BBtn
            label="Delete post"
            class="w-full"
            @click="handleDeletePost"
            :disabled="postName !== updatepost.title"
          />
        </div>
      </div>
      <div class="fixed right-4 top-20 z-50">
        <BBtn
          :label="isPreviewOnly ? 'Edit' : 'Full Preview'"
          @click="togglePreview"
          class="shadow-lg"
        />
      </div>
      <!-- Preview Section -->
      <div
        :class="
          isPreviewOnly
            ? 'p-4 md:p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-auto'
            : 'p-4 md:p-8 overflow-auto'
        "
        v-motion
        :initial="{ opacity: 1, x: 100 }"
        :enter="{ opacity: 1, x: 0 }"
      >
        <h2 class="text-gray-800 dark:text-white text-2xl font-bold mb-4">
          Preview
        </h2>
        <BMarkdown :content="updatepost.content" />
      </div>
    </div>
  </div>
</template>
