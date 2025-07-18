<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useIdeas from '../../composables/ideas'

const { ideas, meta, loading, error, getIdeas } = useIdeas()
const router = useRouter()
const route = useRoute()

const pageNum = ref(parseInt(route.query.page) || 1)
const pageSize = ref(parseInt(route.query.limit) || 10)
const sort = ref(route.query.sort || '-published_at')

const paginationRange = computed(() => {
  if (!meta.value) return []

  const totalPages = meta.value.last_page
  const currentPage = pageNum.value
  const siblingCount = 1

  const totalPageNumbers = siblingCount + 5

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftEllipsis = leftSiblingIndex > 2
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2

  const firstPageIndex = 1
  const lastPageIndex = totalPages

  const range = (start, end) => {
    let length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
  }

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    let leftItemCount = 3 + 2 * siblingCount
    let leftRange = range(1, leftItemCount)
    return [...leftRange, '...', totalPages]
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    let rightItemCount = 3 + 2 * siblingCount
    let rightRange = range(totalPages - rightItemCount + 1, totalPages)
    return [firstPageIndex, '...', ...rightRange]
  }

  if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex]
  }

  return []
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const fetchDataAndUpdateURL = () => {
  const query = {
    page: pageNum.value,
    limit: pageSize.value,
    sort: sort.value,
  }

  getIdeas({
    pageNum: query.page,
    pageSize: query.limit,
    sort: query.sort,
    append1: 'small_image',
  })

  router.push({ query })
}

watch([pageSize, sort], () => {
  pageNum.value = 1
  fetchDataAndUpdateURL()
})

onMounted(() => {
  fetchDataAndUpdateURL()
})

const changePage = (newPage) => {
  if (!meta.value || newPage < 1 || newPage > meta.value.last_page) return
  pageNum.value = newPage
  fetchDataAndUpdateURL()
}
</script>

<template>
  <div class="px-35 py-20">
    <div class="grid grid-cols-2">
      <div>
        <h5 v-if="meta" class="text-base text-gray-700">
          Showing {{ meta.from }} - {{ meta.to }} of {{ meta.total }} results
        </h5>
      </div>
      <div class="flex justify-end">
        <div class="grid grid-cols-2 gap-5">
          <div class="flex items-center space-x-2">
            <label for="show-per-page" class="text-base text-gray-600">Show per page:</label>
            <div class="relative">
              <select
                id="show-per-page"
                v-model="pageSize"
                class="appearance-none block w-full bg-white border border-gray-300 text-gray-800 py-2 pl-5 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              >
                <svg
                  class="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <label for="sort-by" class="text-base text-gray-600">Sort by:</label>
            <div class="relative">
              <select
                id="sort-by"
                v-model="sort"
                class="appearance-none block w-full bg-white border border-gray-300 text-gray-800 py-2 pl-5 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="-published_at">Newest</option>
                <option value="published_at">Oldest</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              >
                <svg
                  class="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="mt-10 text-center">
      <p>Loading data...</p>
    </div>
    <div v-else-if="error" class="mt-10 text-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <div v-else class="mt-10 grid grid-cols-5 gap-5">
      <div
        v-for="idea in ideas"
        :key="idea.id"
        class="bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="w-full aspect-video rounded-t-lg bg-gray-200">
          <img
            :src="idea.small_image[0]?.url || '/img/logo-suitmedia-square.png'"
            alt="Ideas Thumbnail"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="p-5">
          <h5 class="text-gray-400 text-sm uppercase">
            {{ formatDate(idea.published_at) }}
          </h5>
          <h3 class="line-clamp-3 text-xl font-semibold mb-3 min-h-[84px]">
            {{ idea.title }}
          </h3>
        </div>
      </div>
    </div>

    <div v-if="meta && meta.last_page > 1" class="mt-10 flex justify-center items-center">
      <button
        @click="changePage(1)"
        :disabled="pageNum === 1 || loading"
        class="px-3 py-2 leading-tight text-gray-500 bg-white rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
      >
        <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="#000000"
            d="M493.6 445c-11.2 5.3-24.5 3.6-34.1-4.4L288 297.7 288 416c0 12.4-7.2 23.7-18.4 29s-24.5 3.6-34.1-4.4L64 297.7 64 416c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 96C0 78.3 14.3 64 32 64s32 14.3 32 32l0 118.3L235.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S288 83.6 288 96l0 118.3L459.5 71.4c9.5-7.9 22.8-9.7 34.1-4.4S512 83.6 512 96l0 320c0 12.4-7.2 23.7-18.4 29z"
          />
        </svg>
      </button>
      <button
        @click="changePage(pageNum - 1)"
        :disabled="pageNum === 1 || loading"
        class="p-2 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
      >
        <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
          <path
            fill="#000000"
            d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"
          />
        </svg>
      </button>

      <template v-for="(page, index) in paginationRange" :key="index">
        <span v-if="page === '...'" class="p-2 text-black font-semibold">...</span>
        <button
          v-else
          @click="changePage(page)"
          :class="[
            'p-2 leading-tight rounded-md mr-1',
            pageNum === page
              ? 'text-white bg-orange-500'
              : 'text-black font-semibold bg-white hover:bg-gray-100',
          ]"
          :disabled="loading"
        >
          {{ page }}
        </button>
      </template>

      <button
        @click="changePage(pageNum + 1)"
        :disabled="pageNum === meta.last_page || loading"
        class="p-2 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
      >
        <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
          <path
            fill="#000000"
            d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"
          />
        </svg>
      </button>
      <button
        @click="changePage(meta.last_page)"
        :disabled="pageNum === meta.last_page || loading"
        class="p-2 leading-tight text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
      >
        <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="#000000"
            d="M18.4 445c11.2 5.3 24.5 3.6 34.1-4.4L224 297.7 224 416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4L448 297.7 448 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 118.3L276.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S224 83.6 224 96l0 118.3L52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96L0 416c0 12.4 7.2 23.7 18.4 29z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
