import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import Vue from 'vue'
import axios from 'axios'
import lodash from 'lodash' 

import App from './App.vue'
import router from './router'
import store from './store'

import Global from './components/_global'  // eslint-disable-line no-unused-vars
import { utils } from '@/mixins/utils'

Vue.config.productionTip = false
Vue.prototype.$http = axios;  // axios 사용하는 관레임  이후에는 아래와 같이 사용할 수 있음

Vue.prototype._ = lodash  // main 에서  선언히면 어디서든지 샤용할 수 있다.

Vue.mixin(utils)

const EventBus = new Vue({
  data() {
    return {
      isAdmin : false
    }
  },
  methods: {
  } 
})

Vue.prototype.EventBus = EventBus // // main 에서  선언히면 this. 로 어디서든지 샤용할 수 있다.

Vue.prototype.ApiURL = "http://localhost:7000/apis/"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
