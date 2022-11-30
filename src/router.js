import VueRouter from 'vue-router';
import store from './store/store';
import LoginPage from './pages/LoginPage.vue';
import SearchPage from './pages/SearchPage.vue';
import RedirectPage from './pages/RedirectPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/search'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/redirect',
    name: 'redirect',
    component: RedirectPage
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/searchdemo',
    name: 'searchdemo',
    component: SearchPage,
    meta: {
      requiresAuth: false
    }
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
      return;
    }
    next({name: 'login'});
  } else {
    next();
  }
});

export default router;