import { ref } from 'vue'
import apiClient from './axios'

const useIdeas = () => {
  const ideas = ref([])
  const meta = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getIdeas = async ({ pageNum, pageSize, append1, append2, sort, append = false }) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        'page[number]': pageNum,
        'page[size]': pageSize,
        sort: sort,
      })

      if (append1) {
        params.append('append[]', append1)
      }
      if (append2) {
        params.append('append[]', append2)
      }

      const res = await apiClient.get(`/api/ideas?${params.toString()}`)

      if (append) {
        ideas.value.push(...res.data.data)
      } else {
        ideas.value = res.data.data
      }
      meta.value = res.data.meta
    } catch (err) {
      error.value = 'Gagal memuat data. Silakan coba lagi.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    ideas,
    meta,
    loading,
    error,
    getIdeas,
  }
}

export default useIdeas
