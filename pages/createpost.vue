<script setup lang="ts">
import { createPost, type Post } from '@/api/posts'
import { type Category, getCategories } from '@/api/categories'
import { uploadImage } from '@/api/images'
import { RecordId } from 'surrealdb'

interface Option {
  value: unknown;
  label: string;
}

definePageMeta({
  middleware: "auth",
})

const posttags = ref<string>('')
const newpost = reactive<Post>({
  title: '',
  content: '',
  description: '',
  image: '',
  published: false,
  category: '' as unknown as RecordId,
  tags: []
})

const categories = ref<Category[]>([])
const optionCategories = ref<Option[]>([])
const isPreviewOnly = ref(false)

const router = useRouter()
const authStore = useAuthStore()

const textarea = ref<HTMLTextAreaElement | null>(null)
const cursorPos = ref(0)

const handleCreatePost = async () => {
  if (authStore.token) {
    newpost.tags = posttags.value.split(' ')
    const post = await createPost(authStore.token, newpost)
    if (post) {
      router.push(`/post/${post.id}`)
    }
  }
}

const updateCursorPos = () => {
  if (textarea.value) {
    cursorPos.value = textarea.value.selectionStart
  }
}

const handleUploadImage = async (file: File) => {
  if (file) {
    const image = await uploadImage(file)
    const mdImage = `![image](srwither_${image})`
    insertMdImageAtCursor(mdImage)
  }
}

const insertMdImageAtCursor = (mdImage: string) => {
  const content = newpost.content
  const start = content.slice(0, cursorPos.value)
  const end = content.slice(cursorPos.value)
  newpost.content = start + mdImage + end

  setTimeout(() => {
    if (textarea.value) {
      textarea.value.selectionStart = textarea.value.selectionEnd = cursorPos.value + mdImage.length
      textarea.value.focus()
    }
  }, 0)
}

const handlePaste = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items

  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()

        if (file) {
          await handleUploadImage(file)
          event.preventDefault()
          return
        }
      }
    }
  }
}

const togglePreview = () => {
  isPreviewOnly.value = !isPreviewOnly.value
}

onBeforeMount(async () => {
  categories.value = await getCategories()
  optionCategories.value = categories.value.map((category) => ({
    label: category.name,
    value: category.id
  }))
})
</script>

<template>
  <div class="overflow-hidden">
    <div
      :class="['grid transition-colors', isPreviewOnly ? 'grid-cols-1' : 'md:grid-cols-2']"
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
        <form @submit.prevent="handleCreatePost">
          <!-- Title -->
          <div class="flex justify-center mb-4">
            <h1 class="text-gray-800 dark:text-white text-2xl font-bold">Create Post</h1>
          </div>

          <div class="mb-4">
            <BInputLabel text="Title" />
            <BInput type="text" name="title" v-model="newpost.title" placeholder="Title" />
          </div>

          <div class="mb-4">
            <BInputLabel text="Description" />
            <BInput
              type="text"
              name="description"
              v-model="newpost.description"
              placeholder="Description"
            />
          </div>

          <div class="mb-4">
            <BInputLabel text="Image" />
            <BInput
              type="text"
              name="image"
              v-model="newpost.image"
              placeholder="Image"
            />
          </div>

          <div class="mb-4">
            <BInputLabel text="Category" />
            <BNewSelect
              label="Category"
              name="selectedOption"
              v-model="newpost.category"
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
              v-model="newpost.content"
              placeholder="Content"
              class="w-full rounded-md h-32 md:h-48 lg:h-72 xl:h-96 resize-none border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring focus:ring-purple-500 dark:bg-zinc-700 dark:text-white"
            />
          </div>

          <div class="mb-4">
            <BInputLabel text="Tags" />
            <BInput type="text" name="tags" v-model="posttags" placeholder="tags" />
          </div>

          <div class="mb-2 flex items-center space-x-2">
            <BInputLabel text="Published:" />
            <input type="checkbox" v-model="newpost.published" />
          </div>

          <div class="flex justify-center">
            <BBtn label="Create post" class="w-full" />
          </div>
        </form>
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
        <h2 class="text-gray-800 dark:text-white text-2xl font-bold mb-4">Preview</h2>
        <BMarkdown :content="newpost.content" />
      </div>
    </div>
  </div>
</template>