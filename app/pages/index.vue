<template>
  <div class="relative flex items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
    <!-- Background elements (optional, for visual flair) -->
    <div class="absolute inset-0 z-0 opacity-20">
      <div class="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-1/4 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative z-10 text-center p-8 max-w-3xl">
      <h1 class="text-5xl md:text-6xl font-extrabold text-primary-400 mb-6 leading-tight">
        DigiPulse: Ваш пульс цифрового світу
      </h1>
      <p class="text-xl md:text-2xl text-gray-300 mb-10">
        Надійний моніторинг веб-сайтів та сервісів. Будьте завжди в курсі стану ваших ресурсів.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-6">
        <UButton
          to="/auth"
          size="xl"
          color="primary"
          variant="solid"
          icon="i-heroicons-user-plus"
          label="Зареєструватися"
          class="font-semibold"
        />
        <UButton
          to="/auth"
          size="xl"
          color="gray"
          variant="outline"
          icon="i-heroicons-arrow-right-on-rectangle"
          label="Увійти"
          class="font-semibold"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Можливо, тут буде якась логіка для лендінгу, але для простої сторінки вона не потрібна.
</script>

<style scoped>
/* Анімація для фонових "blob" елементів */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
