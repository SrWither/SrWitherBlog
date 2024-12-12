<script setup lang="ts">
import { type Post } from '~/api/posts'
import { getCategory, type Category, getServerCategory } from '~/api/categories'

interface Props {
  post: Post
}

const props = defineProps<Props>()
const router = useRouter()

const category = useState<Category | null>('category', () => null)

if(import.meta.server) {
  await callOnce(async () => {
    category.value = await getServerCategory(props.post.category)
  })
}

if(import.meta.client) {
  await callOnce(async () => {
    category.value = await getCategory(props.post.category)
  })
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleString('en-US', options)
}

const handlePostClick = () => {
  router.push(`/posts/${props.post.id}`)
}
</script>

<template>
  <div
    class="p-6 relative rounded-2xl shadow-lg flex flex-col bg-white transform hover:scale-105 cursor-pointer transition-all"
    @click="handlePostClick"
  >
    <h1 class="text-2xl font-bold text-black mb-2">{{ props.post.title }}</h1>
    <p class="text-black mb-4">
      {{
        props.post.description.length > 100
          ? props.post.description.substring(0, 100) + '...'
          : props.post.description
      }}
    </p>
    <div class="flex justify-between items-center mt-auto">
      <p class="text-sm text-black">{{ formatDate(props.post.created_at || new Date()) }}</p>
      <p v-if="!props.post.published" class="text-sm px-2 py-1 rounded-full bg-black text-white">
        Unpublished
      </p>
    </div>
    <div class="absolute right-5">
      <p class="text-sm bg-black text-white rounded-full px-3 py-1 inline-block">
        {{ category?.name }}
      </p>
    </div>
  </div>
</template>