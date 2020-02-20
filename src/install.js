import * as components from './components';

const install = (Vue, options = {}) => {
  Object.keys(components).forEach((key) => {
    const componentName = options.prefix ? options.prefix + key : key;
    Vue.component(componentName, components[key]);
  });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export { install };
