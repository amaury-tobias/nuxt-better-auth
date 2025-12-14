<script setup lang="ts">
const route = useRoute()
const { sections } = useSidebarConfig()

const openSection = ref<string>('')

function isActive(href: string) {
  if (href.startsWith('http'))
    return false
  return route.path === href || route.path.startsWith(`${href}/`)
}

function isSectionActive(sectionIndex: number) {
  return sections[sectionIndex]?.items.some(item => isActive(item.href)) ?? false
}

// Build accordion items from sections
const accordionItems = computed(() =>
  sections.map((section, index) => ({
    label: section.title,
    icon: section.icon,
    value: String(index),
    isNew: section.isNew,
    defaultOpen: isSectionActive(index),
    slot: `item-${index}` as const,
  })),
)

// Set initial open section based on current route
onMounted(() => {
  const activeIndex = sections.findIndex((_, index) => isSectionActive(index))
  if (activeIndex !== -1) {
    openSection.value = String(activeIndex)
  }
})

// Update open section when route changes
watch(() => route.path, () => {
  const activeIndex = sections.findIndex((_, index) => isSectionActive(index))
  if (activeIndex !== -1) {
    openSection.value = String(activeIndex)
  }
})
</script>

<template>
  <nav class="docs-sidebar-nav">
    <UAccordion
      v-model="openSection"
      type="single"
      collapsible
      :items="accordionItems"
      :ui="{
        item: 'border-b border-[var(--ui-border)]',
        trigger: 'px-5 py-2.5 text-sm font-normal hover:underline data-[state=open]:font-normal',
        trailingIcon: 'size-4 text-[var(--ui-text-muted)]',
        content: 'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
        body: 'p-0',
      }"
    >
      <template #leading="{ item }">
        <UIcon :name="item.icon" class="size-5" />
      </template>

      <template #default="{ item }">
        <span class="flex-1">{{ item.label }}</span>
        <UBadge v-if="item.isNew" size="xs" variant="outline" class="mr-2">
          New
        </UBadge>
      </template>

      <template v-for="(section, index) in sections" :key="section.title" #[`item-${index}`]>
        <div class="section-items">
          <NuxtLink
            v-for="sectionItem in section.items"
            :key="sectionItem.href"
            :to="sectionItem.href"
            :target="sectionItem.href.startsWith('http') ? '_blank' : undefined"
            class="sidebar-item"
            :class="{ active: isActive(sectionItem.href) }"
          >
            <UIcon v-if="sectionItem.icon" :name="sectionItem.icon" class="item-icon" />
            <span>{{ sectionItem.title }}</span>
            <UBadge v-if="sectionItem.isNew" size="xs" variant="outline" class="ml-auto">
              New
            </UBadge>
            <UIcon v-if="sectionItem.href.startsWith('http')" name="i-lucide-external-link" class="external-icon" />
          </NuxtLink>
        </div>
      </template>
    </UAccordion>
  </nav>
</template>

<style scoped>
.docs-sidebar-nav {
  display: flex;
  flex-direction: column;
}

/* Add top border to first accordion item */
.docs-sidebar-nav :deep([data-accordion-item]:first-child) {
  border-top: 1px solid var(--ui-border);
}

/* Sidebar item - matches Better Auth: px-5 py-1 gap-x-2.5 */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.25rem 1.25rem;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
  transition: all 0.15s;
}

.sidebar-item:hover {
  color: var(--ui-text);
  background-color: color-mix(in srgb, var(--ui-primary) 10%, transparent);
}

.sidebar-item.active {
  color: var(--ui-text);
  background-color: color-mix(in srgb, var(--ui-primary) 10%, transparent);
}

/* Item icon container - min-w-4 */
.item-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.external-icon {
  width: 0.75rem;
  height: 0.75rem;
  margin-left: auto;
  opacity: 0.5;
}
</style>
