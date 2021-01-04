import Vue from 'vue';
import VueI18n from 'vue-i18n';
import configMixin from './util/config-mixin';
import createStore from './store';
import config from './config.js';
import controllerMixin from '@phila/vue-datafetch/src/controller.js';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import fonts from './fa';

import App from './App.vue';
import router from './router';
// import { ResponsiveHelpers } from '@phila/phila-ui';
import ResponsiveHelpers from './plugins/ResponsiveHelpers.js';

import VueGtag from 'vue-gtag';

Vue.config.productionTip = false;
Vue.use(ResponsiveHelpers);

// create store
const store = createStore(config);

Vue.use(controllerMixin, { config, store });

Vue.use(configMixin, config);

const customComps = config.customComps || [];
console.log('in main.js, customComps:', customComps, 'Object.keys($config.customComps):', Object.keys(customComps));
for (let key of Object.keys(customComps)) {
  console.log('in loop, key:', key, 'customComps[key]:', customComps[key]);
  Vue.component(key, customComps[key]);
}

Vue.use(VueI18n)
let i18nData;
if (config.i18n && config.i18n.data) {
  i18nData = config.i18n.data;
} else {
  i18nData = {};
}
const i18n = new VueI18n(i18nData);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueGtag, {
  config:{
    id: 'UA-860026-1',
    appName: 'My application',
    pageTrackerScreenviewEnabled: true,
    params: {},
  },
}, router);

Vue.prototype.$appType = config.app.type;

new Vue({
  render: h => h(App),
  i18n,
  store,
}).$mount('#app');
