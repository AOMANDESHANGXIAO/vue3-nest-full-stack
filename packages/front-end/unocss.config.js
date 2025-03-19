import { defineConfig } from 'unocss'

const colors = [
  'primary',
  'success',
  'warning',
  'danger',
  'error',
  'info',
  'deep-dark',
]
const bgColorRules = colors.map(color => [
  `bg-${color}`,
  {
    'background-color': `rgb(var(--color-${color}))`,
  },
])
const textColorRules = colors.map(color => [
  `text-color-${color}`,
  ,
  {
    color: `rgb(var(--color-${color}))`,
  },
])
export default defineConfig({
  rules: [
    ...bgColorRules,
    ...textColorRules,
  ],
})
