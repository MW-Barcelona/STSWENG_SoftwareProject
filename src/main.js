import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from '@/firebase'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VuePersist from 'vue-persist'
import AsyncComputed from 'vue-async-computed'

Vue.config.productionTip = false

Vue.use(AsyncComputed)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VuePersist)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

auth.onAuthStateChanged(user => {
  store.dispatch('setUser', user);
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

