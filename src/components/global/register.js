import Vue from 'vue'

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  '.',
  // Look in subdirectories
  false,
  // Only prefixed .vue, .js and .ts files
  /[\w-]+\.vue$|js$|ts$/
)


requireComponent.keys().forEach((fileName) => {
  if (fileName == './register.js') return
  const componentConfig = requireComponent(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})