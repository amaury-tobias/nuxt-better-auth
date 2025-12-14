<script setup lang="ts">
import type { ContentNavigationItem, PageCollections } from '@nuxt/content'
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

const { locale, isEnabled } = useDocusI18n()
const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs')

const { data: navigation } = await useAsyncData(() => `navigation_${collectionName.value}`, () => queryCollectionNavigation(collectionName.value as keyof PageCollections), {
  transform: (data: ContentNavigationItem[]) => {
    const rootResult = data.find(item => item.path === '/docs')?.children || data || []
    return rootResult.find(item => item.path === `/${locale.value}`)?.children || rootResult
  },
  watch: [locale],
})
const { data: files } = useLazyAsyncData(`search_${collectionName.value}`, () => queryCollectionSearchSections(collectionName.value as keyof PageCollections), { server: false })

provide('navigation', navigation)
</script>

<template>
  <NuxtLoadingIndicator color="var(--ui-primary)" />
  <UBanner icon="i-lucide-construction" title="This library is in early development. Expect breaking changes." color="warning" />
  <AppHeader />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AppFooter />

  <ClientOnly>
    <LazyUContentSearch :files="files" :navigation="navigation" />
  </ClientOnly>

  <Analytics />
  <SpeedInsights />
</template>
