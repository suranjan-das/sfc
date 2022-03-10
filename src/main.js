import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import PortalVue from 'portal-vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(PortalVue)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
