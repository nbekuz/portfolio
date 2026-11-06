export const srcset = (src: string, widths: number[], full: number) =>
  [...widths.map((w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`), `${src} ${full}w`].join(', ')

export const withSuffix = (src: string, suffix: string) => src.replace(/(\.\w+)$/, `${suffix}$1`)
