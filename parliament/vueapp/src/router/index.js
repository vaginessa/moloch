import Vue from 'vue';
import Router from 'vue-router';
import Parliament from '@/components/Parliament';
import Issues from '@/components/Issues';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/parliament/',
  routes: [
    {
      path: '',
      name: 'Parliament',
      component: Parliament
    },
    {
      path: '/issues',
      name: 'Issues',
      component: Issues
    }
  ]
});
