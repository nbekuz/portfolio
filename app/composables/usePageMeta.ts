export interface PageMeta {
  header: 'light' | 'dark' | 'black'
  hero: string
}

export const usePageMeta = () => useState<PageMeta>('page-meta', () => ({ header: 'light', hero: 'Обсудить проект' }))
