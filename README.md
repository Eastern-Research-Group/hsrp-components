[![Netlify Status](https://api.netlify.com/api/v1/badges/23227650-0d14-46e8-8582-a4a9b278d403/deploy-status)](https://app.netlify.com/sites/hsrp-components/deploys)

# HSRP Components

> Shared component library for HSRP apps using Vue and documented via [VuePress](https://vuepress.vuejs.org/).

## Full Documentation

[View component demos and documentation here](https://hsrp-components.netlify.com/)

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

The components within this library currently rely on uswds (U.S. Web Design System), and vue-select (for special text input/select functionality)

#### Tree-shaking

To ensure the smallest bundle size, import specific functions from dependencies.
