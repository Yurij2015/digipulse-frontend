<template>
  <div class="relative min-h-screen bg-white dark:bg-neutral-950 mesh-bg flex flex-col pt-20 md:pt-32 pb-24 items-center px-4 overflow-hidden">

    <!-- Background blobs — same as index.vue -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-60 dark:opacity-80 overflow-hidden">
      <div class="absolute top-[5%] left-[5%] w-[50%] h-[50%] bg-primary-500/30 blur-[100px] rounded-full will-change-transform animate-pulse-slow"></div>
      <div class="absolute bottom-[5%] right-[5%] w-[50%] h-[50%] bg-accent-500/25 blur-[100px] rounded-full will-change-transform animate-pulse-slow" style="animation-delay: 1s"></div>
      <div class="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[80px] rounded-full will-change-transform animate-pulse-slow" style="animation-delay: 2s"></div>
    </div>

    <div class="relative z-10 w-full max-w-5xl text-center flex flex-col items-center">

      <!-- ─── HERO ─── -->
      <div class="inline-flex items-center gap-2 px-3 py-1 mb-12 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-700 dark:text-primary-300 text-[10px] font-black tracking-[0.2em]">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-700 dark:bg-primary-400 animate-pulse"></div>
        МОНІТОРИНГ 24/7 · БЕЗ КОДУ · ДО 6 САЙТІВ БЕЗКОШТОВНО
      </div>

      <h1 class="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.08] text-neutral-900 dark:text-white">
        <span class="bg-linear-to-br from-primary-500 to-indigo-500 bg-clip-text text-transparent inline-block py-2">Ваша реклама працює.</span><br />
        <span class="opacity-90 leading-tight">Сайт теж повинен.</span>
      </h1>

      <p class="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mb-6 font-medium leading-relaxed">
        DigiPulse щохвилини перевіряє ваш сайт і надсилає миттєве сповіщення в Telegram, якщо він стає недоступним, термін дії SSL-сертифіката добігає кінця або виникає загроза блокування домену.
      </p>

      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-12 font-medium">
        ⚡ Налаштування займає всього <strong class="text-neutral-700 dark:text-neutral-200">2 хвилини</strong>. Без втручання в код та встановлення плагінів.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 w-full px-6">
        <UButton
          id="hero-register-btn"
          :to="localePath('/auth/register')"
          size="xl"
          class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 active:scale-[0.98] transition-transform duration-300 px-12 py-5 font-black rounded-xl shadow-2xl shimmer-effect border-0 cursor-pointer"
        >
          Захистити сайт безкоштовно →
        </UButton>
        <UButton
          id="hero-login-btn"
          :to="localePath('/auth/login')"
          size="xl"
          variant="ghost"
          color="neutral"
          class="px-12 py-5 border border-neutral-200 dark:border-white/10 font-bold rounded-xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-white/5 transition-all duration-300"
        >
          Увійти в акаунт
        </UButton>
      </div>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-400 dark:text-neutral-500 font-medium">
        <span>✓ Без кредитної картки</span>
        <span>✓ До 6 сайтів — безкоштовно назавжди</span>
        <span>✓ Скасування у будь-який момент</span>
      </div>


      <!-- ─── PAIN ─── -->
      <div class="mt-24 md:mt-40 w-full">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-5">Чому це критично вже сьогодні</p>
        <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-16 text-neutral-900 dark:text-white leading-tight">
          Рекламний бюджет списується.<br />А сайт лежить.
        </h2>

        <!-- Flow -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16 w-full">
          <div v-for="(step, i) in painSteps" :key="i"
               class="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-3 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
               :class="getPainStepClass(i)">
            <div class="text-3xl filter drop-shadow-md">{{ step.emoji }}</div>
            <p class="text-xs font-black text-neutral-800 dark:text-neutral-200 leading-snug">{{ step.text }}</p>
          </div>
        </div>

        <!-- Pain cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div class="glass-card p-10 rounded-3xl flex flex-col items-start text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-500 to-amber-500 opacity-50"></div>
            <div class="w-12 h-12 rounded-xl bg-linear-to-br from-red-500/10 to-amber-500/10 border border-red-500/20 flex items-center justify-center mb-8 text-2xl group-hover:scale-110 transition-transform">💸</div>
            <h3 class="text-xl font-black mb-4 text-neutral-900 dark:text-white tracking-tight">Злита рекламна кампанія</h3>
            <p class="text-neutral-600 dark:text-neutral-300 text-sm leading-[1.65] font-medium">
              Ви запускаєте рекламу, трафік іде — але сайт раптом видає помилку 500 або просто не завантажується. Рекламні системи списують гроші за кожен клік, поки користувачі бачать порожню сторінку та одразу закривають її. Як результат — злитий бюджет, нуль продажів, а Google знижує ваші позиції в пошуку через високий показник відмов.
            </p>
          </div>
          <div class="glass-card p-10 rounded-3xl flex flex-col items-start text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-500 to-indigo-500 opacity-50"></div>
            <div class="w-12 h-12 rounded-xl bg-linear-to-br from-red-500/10 to-indigo-500/10 border border-red-500/20 flex items-center justify-center mb-8 text-2xl group-hover:scale-110 transition-transform">🔒</div>
            <h3 class="text-xl font-black mb-4 text-neutral-900 dark:text-white tracking-tight">Прострочений SSL або домен</h3>
            <p class="text-neutral-600 dark:text-neutral-300 text-sm leading-[1.65] font-medium">
              Браузер показує попередження про «Небезпечне з'єднання», і 95% користувачів миттєво закривають вкладку, побоюючись за свої дані. Термін дії SSL-сертифіката чи домену часто закінчується непомітно, без гучних попереджень від реєстратора. Один пропущений лист на пошті — і ваш бізнес втрачає адресу в інтернеті.
            </p>
          </div>
        </div>
      </div>


      <!-- ─── HOW IT WORKS ─── -->
      <div class="mt-24 md:mt-48 w-full max-w-4xl text-center">
        <h2 class="text-4xl md:text-5xl font-black mb-16 text-neutral-900 dark:text-white tracking-tight">
          Три кроки — і ваш сайт під охороною
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div class="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent z-0"></div>

          <div v-for="(step, i) in howItWorks" :key="i" class="relative z-10 flex flex-col items-center group">
            <div class="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center text-xl font-black mb-6 shadow-xl shadow-primary-500/30 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              {{ i + 1 }}
            </div>
            <h3 class="text-lg font-bold mb-3 text-neutral-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200">{{ step.title }}</h3>
            <p class="text-neutral-600 dark:text-neutral-300 text-sm px-4 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>


      <!-- ─── FREE TIER OFFER ─── -->
      <div class="mt-24 md:mt-48 w-full glass-card p-10 md:p-16 rounded-[40px] text-center border border-primary-500/20 relative overflow-hidden group">
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/10 blur-[60px] rounded-full"></div>
        <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-500/10 blur-[60px] rounded-full"></div>

        <div class="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-black tracking-[0.2em]">
          <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          БЕЗКОШТОВНО ДО 6 САЙТІВ
        </div>

        <h2 class="text-3xl md:text-5xl font-black mb-6 text-neutral-900 dark:text-white leading-tight">
          До 6 сайтів —<br />назавжди безкоштовно
        </h2>
        <p class="text-neutral-600 dark:text-neutral-300 text-lg mb-10 max-w-xl mx-auto font-medium">
          Ми не обмежуємо можливості тестовим періодом. Додайте до 6 проектів та використовуйте професійний моніторинг безкоштовно — без прив'язки картки та будь-яких прихованих умов.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
          <div v-for="item in offerPoints" :key="item" 
               class="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium p-3.5 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/2 transition-colors duration-200 border border-transparent hover:border-neutral-100 dark:hover:border-white/5">
            <UIcon name="i-heroicons-check-badge" class="text-green-500 text-lg flex-shrink-0 mt-0.5" />
            <span>{{ item }}</span>
          </div>
        </div>

        <UButton
          id="free-tier-register-btn"
          :to="localePath('/auth/register')"
          size="xl"
          class="bg-primary-600 hover:bg-primary-700 text-white hover:scale-105 active:scale-[0.98] transition-transform px-10 py-4 font-black rounded-xl shadow-xl shadow-primary-500/20 cursor-pointer border-0"
        >
          Підключити сайт безкоштовно →
        </UButton>
        <p class="mt-4 text-xs text-neutral-400 dark:text-neutral-500 font-medium">Без кредитної картки. Більше 6 сайтів — доступні платні плани.</p>
      </div>


      <!-- ─── AGENCIES ─── -->
      <div class="mt-24 md:mt-48 w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center text-left">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-5">Для агенцій та веб-студій</p>
            <h2 class="text-3xl md:text-4xl font-black tracking-tight mb-6 text-neutral-900 dark:text-white leading-tight">
              Від 7 до 60 сайтів —<br />одна панель керування
            </h2>
            <p class="text-neutral-600 dark:text-neutral-300 text-sm leading-[1.65] font-medium mb-8">
              Вам більше не доведеться дізнаватися про проблеми від розгніваного клієнта пізно ввечері. Ви першими отримаєте сповіщення і зможете все виправити ще до того, як замовник помітить неполадку.
            </p>
            <div class="space-y-3 mb-10">
              <div v-for="point in agencyPoints" :key="point" class="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300 font-medium">
                <div class="w-5 h-5 rounded-full bg-primary-500/15 flex items-center justify-center text-primary-500 text-xs flex-shrink-0 mt-0.5">✓</div>
                <span>{{ point }}</span>
              </div>
            </div>
            <UButton
              id="agency-request-btn"
              :to="localePath('/auth/register')"
              size="lg"
              class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black px-8 py-3.5 rounded-xl hover:scale-105 transition-transform cursor-pointer border-0"
            >
              Зареєструватись та подати запит
            </UButton>
            <p class="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
              * Для створення запиту на розширений пакет необхідно створити безкоштовний акаунт.
            </p>
          </div>

          <!-- Mock panel -->
          <div class="glass-card p-8 rounded-3xl relative border border-neutral-200/50 dark:border-white/10 shadow-2xl hover:shadow-primary-500/5 transition-all duration-500">
            <!-- Simulated Browser window header -->
            <div class="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100 dark:border-white/10">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span class="text-xs text-neutral-400 dark:text-neutral-500 font-mono">agency-dashboard.digipulse.com</span>
              <div class="w-12"></div> <!-- Spacer for balance -->
            </div>

            <div class="flex items-center justify-between mb-6">
              <span class="text-sm font-black text-neutral-900 dark:text-white">Панель агенції</span>
              <span class="text-[10px] px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 font-black rounded-full border border-green-500/20 uppercase tracking-widest flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                Live
              </span>
            </div>

            <div class="space-y-1.5">
              <div v-for="site in agencyMockSites" :key="site.name" class="flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-white/2 rounded-xl transition-colors duration-200 border border-transparent hover:border-neutral-100 dark:hover:border-white/5">
                <div class="flex items-center gap-3">
                  <div :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', site.online ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse']"></div>
                  <span class="text-sm font-bold text-neutral-800 dark:text-neutral-200">{{ site.name }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <!-- Response time simulator -->
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400">
                    {{ site.ping }}
                  </span>
                  
                  <span :class="['text-xs font-semibold px-2 py-0.5 rounded-md', site.sslAlert ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'text-neutral-400']">
                    SSL {{ site.ssl }}
                  </span>
                  
                  <span :class="['text-xs font-black min-w-[50px] text-right', site.online ? 'text-green-600 dark:text-green-400' : 'text-red-500']">
                    {{ site.status }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="mt-6 pt-5 border-t border-neutral-100 dark:border-white/5 text-center text-xs text-neutral-400 dark:text-neutral-500 font-bold">
              ⚡ Звіт для клієнта в 1 клік
            </div>
          </div>
        </div>
      </div>


      <!-- ─── FAQ ─── -->
      <div class="mt-24 md:mt-48 w-full max-w-3xl">
        <h2 class="text-4xl md:text-5xl font-black mb-16 text-neutral-900 dark:text-white tracking-tight text-center">
          Відповіді на головні сумніви
        </h2>
        <div class="space-y-4 text-left">
          <div v-for="(item, i) in faq" :key="i" class="glass-card rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-white/5 transition-all duration-300">
            <button
              :id="'faq-toggle-' + i"
              class="w-full flex items-center justify-between p-6 gap-4 cursor-pointer text-left transition-colors hover:bg-neutral-50 dark:hover:bg-white/2"
              @click="toggleFaq(i)"
            >
              <span class="text-base font-black text-neutral-900 dark:text-white transition-colors duration-200" :class="openFaq === i ? 'text-primary-500 dark:text-primary-400' : ''">{{ item.q }}</span>
              <UIcon
                name="i-heroicons-chevron-down"
                class="text-neutral-400 flex-shrink-0 transition-all duration-300"
                :class="openFaq === i ? 'rotate-180 text-primary-500 dark:text-primary-400' : ''"
              />
            </button>
            <div
              class="grid transition-all duration-300 ease-in-out"
              :class="openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
              style="display: grid;"
            >
              <div class="overflow-hidden">
                <div class="px-6 pb-6 pt-2">
                  <p class="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">{{ item.a }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- ─── FINAL CTA ─── -->
      <div class="mt-32 md:mt-56 w-full glass-card p-10 md:p-16 rounded-[40px] text-center max-w-4xl border border-primary-500/10 mb-20 relative overflow-hidden group">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 blur-[60px] rounded-full"></div>
        <h2 class="text-3xl md:text-5xl font-black mb-6 text-neutral-900 dark:text-white leading-tight">
          Дізнайтесь, що відбувається<br />з вашим сайтом прямо зараз
        </h2>
        <p class="text-neutral-600 dark:text-neutral-300 text-lg mb-10 max-w-xl mx-auto font-medium">
          Підключіть до 6 сайтів безкоштовно за 2 хвилини. Статус, SSL, час відповіді, доступність — все в одній панелі.
        </p>
        <UButton
          id="final-cta-register-btn"
          :to="localePath('/auth/register')"
          size="xl"
          class="bg-primary-600 hover:bg-primary-700 text-white hover:scale-105 active:scale-[0.98] transition-transform px-10 py-4 font-black rounded-xl shadow-xl shadow-primary-500/20 cursor-pointer border-0"
        >
          Почати безкоштовно →
        </UButton>
      </div>

      <LazyAppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLocalePath } from '#imports';

const localePath = useLocalePath();
const url = useRequestURL();

useSeoMeta({
  title: 'Моніторинг сайтів для бізнесу — DigiPulse',
  ogTitle: 'Моніторинг сайтів для бізнесу — DigiPulse',
  description: 'Захистіть рекламний бюджет від падінь сайту. DigiPulse щохвилини перевіряє сайт і сповіщає в Telegram. До 6 сайтів назавжди безкоштовно.',
  ogDescription: 'Захистіть рекламний бюджет від падінь сайту. DigiPulse щохвилини перевіряє сайт і сповіщає в Telegram. До 6 сайтів назавжди безкоштовно.',
  ogUrl: url.href,
  ogType: 'website',
});

definePageMeta({
  middleware: 'guest'
});

const openFaq = ref<number | null>(null);
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i;
}

const painSteps = [
  { emoji: '📣', text: 'Реклама в Instagram/Google активна' },
  { emoji: '💸', text: 'Рекламний бюджет успішно списується' },
  { emoji: '💥', text: 'Сайт раптово «падає» з помилкою 500' },
  { emoji: '💔', text: 'Клієнти бачать помилку і розчаровуються' },
  { emoji: '🏃', text: 'Вони йдуть до ваших конкурентів. Назавжди.' },
];

function getPainStepClass(i: number) {
  const steps = [
    // Step 1: Green/neutral (ads running)
    'border-emerald-500/10 dark:border-emerald-500/5 bg-emerald-500/2 dark:bg-emerald-500/1 hover:border-emerald-500/30',
    // Step 2: Yellow/warning (budget spending)
    'border-amber-500/10 dark:border-amber-500/5 bg-amber-500/2 dark:bg-amber-500/1 hover:border-amber-500/30',
    // Step 3: Red (site down)
    'border-rose-500/20 dark:border-rose-500/10 bg-rose-500/2 dark:bg-rose-500/1 hover:border-rose-500/40',
    // Step 4: Red (client leaves)
    'border-rose-600/25 dark:border-rose-600/12 bg-rose-600/3 dark:bg-rose-600/2 hover:border-rose-600/50',
    // Step 5: Critical Red (competitor wins)
    'border-rose-700/30 dark:border-rose-700/15 bg-rose-700/4 dark:bg-rose-700/3 hover:border-rose-700/60'
  ];
  return steps[i] || '';
}

const howItWorks = [
  {
    title: 'Додайте посилання на сайт',
    desc: 'Просто вкажіть URL вашого сайту. Не потрібно змінювати код чи встановлювати плагіни. Ми автоматично налаштуємо моніторинг доступності, швидкості та SSL.',
  },
  {
    title: 'Підключіть Telegram в один клік',
    desc: 'Натисніть кнопку інтеграції та запустіть нашого бота командою /start. Сповіщення можна надсилати як у приватні повідомлення, так і в груповий чат команди.',
  },
  {
    title: 'Будьте впевнені у доступності',
    desc: 'Якщо сайт стане недоступним, ви дізнаєтеся про це вже за хвилину, а не через добу від розгніваного клієнта чи партнера.',
  },
];

const offerPoints = [
  'Повноцінний моніторинг до 6 сайтів',
  'Перевірка доступності щохвилини (1440 разів на добу)',
  'Миттєві сповіщення в Telegram та на Email',
  'Контроль термінів дії SSL-сертифікатів та доменів',
  'Детальний аналіз швидкості та стабільності відповіді',
  'Жодних прив\'язок картки чи автосписань без згоди',
];

const agencyPoints = [
  'Керування від 7 до 60 сайтами в єдиній консолі',
  'Моніторинг статусів у реальному часі без перемикання вкладок',
  'Готові звіти для замовників: uptime, інциденти та SSL',
  'Реагування на інциденти до того, як про них дізнається клієнт',
  'Додаткова цінність та обґрунтування абонплати за підтримку',
];

const agencyMockSites = [
  { name: 'shop-client.ua', online: true, ssl: '87 днів', ping: '124 ms', sslAlert: false, status: 'Online' },
  { name: 'agency-portfolio.com', online: true, ssl: '12 днів ⚠️', ping: '180 ms', sslAlert: true, status: 'Online' },
  { name: 'restaurant-lviv.ua', online: false, ssl: '45 днів', ping: '— ms', sslAlert: false, status: 'Offline' },
  { name: 'realty-kyiv.com', online: true, ssl: '203 днів', ping: '98 ms', sslAlert: false, status: 'Online' },
];

const faq = [
  {
    q: 'Чи потрібно встановлювати плагіни або міняти код сайту?',
    a: 'Ні. Наш моніторинг є повністю зовнішнім: система робить запити до вашого сайту так само, як це роблять звичайні користувачі. Жодних змін у коді чи додаткового навантаження на ваш сервер.',
  },
  {
    q: 'А якщо впаде сам Telegram або я не отримаю повідомлення?',
    a: 'Telegram — це наш основний канал сповіщень, але ми також дублюємо критичні повідомлення на вашу електронну пошту. Крім того, всі інциденти детально фіксуються в особистому кабінеті.',
  },
  {
    q: 'Скільки це коштує понад 6 сайтів?',
    a: 'Вартість платних тарифів для окремих проектів починається від $5 на місяць. Для веб-студій та агенцій на період бета-тестування діє спеціальний пакет від 7 до 60 сайтів, який наразі надається безкоштовно за індивідуальним запитом.',
  },
  {
    q: 'У мене Shopify / Prom / Tilda — це теж працює?',
    a: 'Абсолютно. Система перевіряє доступність безпосередньо за посиланням (URL), тому технологічний стек сайту не має значення. Моніторинг однаково ефективно працює для Shopify, WordPress, Prom, Tilda, Webflow чи кастомних рішень.',
  },
  {
    q: 'Як швидко я дізнаюсь, що сайт впав?',
    a: 'Перевірка доступності здійснюється щохвилини. Одразу після фіксації помилки сповіщення надсилається у вибраний канал за лічені секунди. Середній час реакції системи з моменту падіння сайту до отримання вами повідомлення становить менше 60 секунд.',
  },
];
</script>
