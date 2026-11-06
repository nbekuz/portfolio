export function useUi() {
  const formOpen = useState('form-open', () => false)
  const successOpen = useState('success-open', () => false)
  const menuOpen = useState('menu-open', () => false)

  return {
    formOpen,
    successOpen,
    menuOpen,
    openForm: () => (formOpen.value = true),
    closeForm: () => (formOpen.value = false),
    showSuccess: () => (successOpen.value = true),
  }
}
