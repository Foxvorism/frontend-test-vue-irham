<script setup>
defineProps({
  title: {
    type: String,
    default: 'Default Hero Title',
  },
  subtitle: {
    type: String,
    default: 'Where all our great things begin',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    default: 'Hero Image',
  },
})
</script>

<template>
  <main>
    <div class="relative overflow-hidden h-[80vh]">
      <div class="absolute top-0 left-0 w-full h-full skew-y-[-6deg] origin-bottom-left">
        <img :src="imageUrl" :alt="imageAlt" class="object-cover w-full h-full" />
        <div class="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      </div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white z-10"
      >
        <h1 class="text-4xl font-bold mb-1 uppercase">{{ title }}</h1>
        <p class="text-lg">{{ subtitle }}</p>
      </div>
    </div>
  </main>
</template>
