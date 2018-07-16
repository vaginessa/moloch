import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    hasAuth: false,
    loggedIn: false
  },
  mutations: {
    setLoggedIn (state, value) {
      state.loggedIn = value;
    },
    setHasAuth (state, value) {
      state.hasAuth = value;
    }
  }
});

export default store;
