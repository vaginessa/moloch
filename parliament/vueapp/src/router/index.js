import Vue from 'vue';
import Router from 'vue-router';
import Parliamnet from '@/components/Parliament';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/parliament/',
  routes: [
    {
      path: '/',
      name: 'Parliamnet',
      component: Parliamnet
    }
  ]
});
