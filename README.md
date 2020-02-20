# HSRP Components

> Shared component library for HSRP apps using Vue and documented via [VuePress](https://vuepress.vuejs.org/).

## Setup

```bash
# install dependencies
npm install

# start the VuePress instance for documentation, including live component demos
npm run docs:dev

# build the component library, bundled into dist directory
npm run build

# build the VuePress document site, bundled into docs/.vuepress/dist
npm run docs:build
```

## How it works

### Components

The library is a [Vue plugin](https://vuejs.org/v2/guide/plugins.html). Its `install` function in [install.js](src/install.js) imports all components from `components` folder, registers them to Vue and automatically call itself. You can also import components individually, either in main.js and register globally, or within specific single-file components. This method may be preferred so that IDEs are able to recognize component metadata.

```js
<template>
  <Alert text="This is an alert message" />
  <Button label="Click me" />
</template>
<script>
import { Alert, Button } from 'hsrp-components';

export default {
  components: { Alert, Button },
}
</script>
```

### Third-party libraries

The components within this library currently rely on uswds (U.S. Web Design System), lodash (for computing methods within Table component), and vue-select (for special text input/select functionality)

#### Tree-shaking

To ensure the smallest bundle size, import specific functions from dependencies. For example, lodash is used in the Table component. Use `import sort from 'lodash/sort'` to ensure the full lodash library is not bundled with this component library. Do NOT use `import {sort} from 'lodash'`, otherwise the full library will be bundled.
