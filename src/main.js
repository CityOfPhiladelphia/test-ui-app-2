import Vue from 'vue';
import configMixin from './util/config-mixin';
import createStore from './store';
import config from './config.js';
import controllerMixin from '@phila/vue-datafetch/src/controller.js';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import fonts from './fa';

import App from './App.vue';
import { ResponsiveHelpers } from '@phila/phila-ui';

Vue.config.productionTip = false;
Vue.use(ResponsiveHelpers);

// create store
const store = createStore(config);

Vue.use(controllerMixin, { config, store });

Vue.use(configMixin, config);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.prototype.$appType = config.app.type;

new Vue({
  render: h => h(App),
  store,
}).$mount('#app');
