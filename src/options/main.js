import Vue from 'vue';
import App from './App.vue';
import vuetify from '../plugins/vuetify';
import store from '../store';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  vuetify,
  render: (h) => h(App),
});
