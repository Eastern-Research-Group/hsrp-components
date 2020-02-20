# Quick Start

## Install

npm:

```bash
$ npm install hsrp-components --save
```

yarn:

```bash
$ yarn add hsrp-components
```

Register individual components:

```js
// main.js
import { Alert, Button } from 'hsrp-components';
Vue.component('Alert', Alert);
Vue.component('Button', Button);
```

Register `hsrp-components` in your app's entry:

```js
// main.js
import Vue from 'vue';
import * as hsrpComponents from 'hsrp-components';

Vue.use(hsrpComponents);
```

Note that most IDEs will not be able to recognize components if registered via `Vue.use`
