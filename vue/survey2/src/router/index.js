import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue'
//import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  mode: 'history',                  // cf hash
  base: process.env.BASE_URL,
  linkExactActiveClass: 'active',   // 이 router 로가면 간 router 에 active 를 붙여 주는 것.
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/survey/:id', name: 'survey', component: () => import('../views/Survey')
    },
    {
      path: '/adm', name: 'adm', component: () => import('../views/Adm')
    },
    {
      path: '/surveylist', name: 'surveylist', component: () => import('../views/SurveyList'),
      children: [
        {
          path: '/surveylist/surveyedit/:id', name: 'surveyedit', component: () => import('../views/SurveyEdit')
        },
      ]
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }

  ]
});
