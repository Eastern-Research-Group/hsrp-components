import * as hsrpComponents from 'hsrp-components';

// Import base USWDS CSS file for component demos in the docs
import 'uswds/dist/css/uswds.min.css';

// Styles for demos on docs pages
import 'hsrp-components/styles/docs.scss';

// Vue-Select demo css
import 'vue-select/dist/vue-select.css';

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  Vue.use(hsrpComponents);
};
