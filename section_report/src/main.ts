import Vue from 'vue';
import App from './App.vue';
import { root } from './store';
import '@mdi/font/css/materialdesignicons.min.css';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/js/uikit.min.js';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');

// Watch store for development
if (process.env.NODE_ENV !== 'production') {
  const dummyElement = document.createElement('div');
  dummyElement.id = '_storeDummyEntry';
  document.body.appendChild(dummyElement);

  new Vue({
    name: 'StoreDummyComponent',
    computed: {
      state: () => root.state
    },
    render: h => h()
  }).$mount('#_storeDummyEntry');
}
