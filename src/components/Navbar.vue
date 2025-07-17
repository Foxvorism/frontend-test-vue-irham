<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const navLinks = [
  { name: 'Work', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Ideas', href: '/ideas' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
]

const visible = ref(true)
const lastScrollY = ref(0)
const isScrolled = ref(false)

const route = useRoute()

const controlNavbar = () => {
  const currentScrollY = window.scrollY
  if (currentScrollY > lastScrollY.value && currentScrollY > 150) {
    visible.value = false
  } else {
    visible.value = true
  }
  isScrolled.value = currentScrollY > 10
  lastScrollY.value = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', controlNavbar)
})

onUnmounted(() => {
  window.removeEventListener('scroll', controlNavbar)
})

const headerClasses = computed(() => {
  return [
    'fixed left-0 w-full z-50 transition-all duration-300 ease-in-out bg-orange-600',
    visible.value ? 'top-0' : '-top-full',
    isScrolled.value ? 'opacity-50' : 'opacity-100',
  ]
})
</script>

<template>
  <header :class="headerClasses">
    <div class="container mx-auto my-3 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <router-link to="/">
        <img
          src="/img/logo-suitmedia-white.png"
          alt="Suitmedia Logo"
          width="500"
          height="150"
          class="w-32 h-auto"
        />
      </router-link>
      <nav>
        <ul class="flex items-center gap-4 sm:gap-6 md:gap-8">
          <li v-for="link in navLinks" :key="link.name">
            <router-link
              :to="link.href"
              :class="[
                'relative text-white font-medium pb-2',
                {
                  'after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-white':
                    route.path === link.href,
                },
              ]"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
