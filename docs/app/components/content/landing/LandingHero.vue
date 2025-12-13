<script setup lang="ts">
// @ts-expect-error yaml is not typed
import hero from './hero.yml'

const currentTab = ref(0)
const tabs = hero.tabs as { name: string, code: string, lang: string }[]

// Map file extensions to languages
function getLang(filename: string) {
  if (filename.endsWith('.ts')) return 'ts'
  if (filename.endsWith('.vue')) return 'vue'
  if (filename.endsWith('.js')) return 'js'
  return 'ts'
}

// Format code as markdown code block for MDC
function getCodeBlock(tab: { name: string, code: string }) {
  return `\`\`\`${getLang(tab.name)}\n${tab.code.trim()}\n\`\`\``
}
</script>

<template>
  <section class="relative w-full flex md:items-center md:justify-center bg-white/96 dark:bg-black/[0.96] antialiased min-h-[40rem] md:min-h-[50rem] lg:min-h-[40rem]">
    <!-- Spotlight Effect -->
    <LandingSpotlight />

    <!-- Background Grid -->
    <div class="absolute inset-0 left-5 right-5 lg:left-16 lg:right-14 xl:left-16 xl:right-14">
      <div class="absolute inset-0 bg-grid text-stone-500/50 dark:text-white/[0.02]" />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[--ui-bg]" />
    </div>

    <!-- Content -->
    <div class="px-4 py-8 md:w-10/12 mx-auto relative z-10">
      <div class="mx-auto grid lg:max-w-8xl xl:max-w-full grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-2 lg:grid-cols-2 lg:px-8 lg:py-4 xl:gap-x-16 xl:px-0">
        <!-- Left: Text content -->
        <div class="relative z-10 text-left lg:mt-0">
          <div class="relative space-y-4">
            <div class="space-y-2">
              <!-- Tagline -->
              <div class="flex items-center gap-1 mt-2">
                <UIcon name="i-lucide-sparkles" class="size-3.5" />
                <span class="text-xs opacity-75">{{ hero.tagline }}</span>
              </div>

              <!-- Headline -->
              <p class="text-stone-800 dark:text-stone-300 tracking-tight text-2xl md:text-3xl text-pretty">
                {{ hero.title }}
              </p>
            </div>

            <!-- npm install command -->
            <div class="relative flex items-center gap-2 w-full sm:w-[90%]">
              <div class="gradient-box w-full flex items-center justify-between gap-2 px-3 py-2 rounded-sm">
                <div class="w-full flex flex-col min-[350px]:flex-row min-[350px]:items-center gap-0.5 min-[350px]:gap-2 min-w-0">
                  <p class="text-xs sm:text-sm font-mono select-none tracking-tighter space-x-1 shrink-0">
                    <span class="text-sky-500">git:</span><span class="text-red-400">(main)</span>
                    <span class="italic text-amber-600">x</span>
                  </p>
                  <p class="relative inline tracking-tight opacity-90 md:text-sm text-xs dark:text-white font-mono text-black">
                    pnpm add <span class="relative dark:text-fuchsia-300 text-fuchsia-800">@onmax/nuxt-better-auth</span>
                  </p>
                </div>
                <div class="flex gap-2 items-center">
                  <NuxtLink to="https://www.npmjs.com/package/@onmax/nuxt-better-auth" target="_blank" class="opacity-60 hover:opacity-100 transition-opacity">
                    <UIcon name="i-simple-icons-npm" class="size-4 text-red-500" />
                  </NuxtLink>
                  <NuxtLink to="https://github.com/onmax/nuxt-better-auth" target="_blank" class="opacity-60 hover:opacity-100 transition-opacity">
                    <UIcon name="i-simple-icons-github" class="size-4" />
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="mt-4 flex w-fit flex-col gap-4 font-sans md:flex-row md:justify-center lg:justify-start items-center">
              <NuxtLink
                to="/getting-started/installation"
                class="border-2 border-black bg-white px-4 py-1.5 text-sm uppercase text-black shadow-brutalist transition duration-200 md:px-8 dark:border-stone-100 dark:text-black hover:shadow-sm dark:hover:shadow-sm"
              >
                Get Started
              </NuxtLink>
              <UButton
                to="https://github.com/onmax/nuxt-better-auth"
                target="_blank"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-github"
              >
                GitHub
              </UButton>
            </div>
          </div>
        </div>

        <!-- Right: Code preview -->
        <div class="relative md:block lg:static xl:pl-10">
          <div class="relative">
            <div class="from-sky-300 via-sky-300/70 to-blue-300 absolute inset-0 rounded-none bg-gradient-to-tr opacity-5 blur-lg" />
            <div class="from-stone-300 via-stone-300/70 to-blue-300 absolute inset-0 rounded-none bg-gradient-to-tr opacity-5" />

            <!-- Code Preview Card -->
            <div class="code-preview relative overflow-hidden rounded-sm ring-1 ring-white/10 backdrop-blur-lg">
              <div class="pl-4 pt-4">
                <!-- Traffic lights -->
                <svg aria-hidden="true" viewBox="0 0 42 10" fill="none" class="h-2.5 w-auto stroke-slate-500/30">
                  <circle cx="5" cy="5" r="4.5" />
                  <circle cx="21" cy="5" r="4.5" />
                  <circle cx="37" cy="5" r="4.5" />
                </svg>

                <!-- Tabs -->
                <div class="mt-4 flex space-x-2 text-xs">
                  <button
                    v-for="(tab, index) in tabs"
                    :key="tab.name"
                    class="relative isolate flex h-6 cursor-pointer items-center justify-center rounded-full px-2.5 transition-colors"
                    :class="currentTab === index ? 'text-stone-300' : 'text-slate-500'"
                    @click="currentTab = index"
                  >
                    {{ tab.name }}
                    <span
                      v-if="currentTab === index"
                      class="absolute inset-0 -z-10 rounded-full bg-stone-800"
                    />
                  </button>
                </div>

                <!-- Code content -->
                <div class="flex flex-col items-start px-1 text-sm pb-4">
                  <div class="w-full overflow-x-auto hero-code">
                    <MDC :value="getCodeBlock(tabs[currentTab])" tag="div" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
