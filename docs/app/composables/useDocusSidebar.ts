export function useDocusSidebar() {
  const sidebarOpen = useState('docus-sidebar', () => false)

  const toggle = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const open = () => {
    sidebarOpen.value = true
  }

  const close = () => {
    sidebarOpen.value = false
  }

  return { sidebarOpen, toggle, open, close }
}
