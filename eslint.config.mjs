// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['**/*.md', 'dist/**', '.nuxt/**'],
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})
