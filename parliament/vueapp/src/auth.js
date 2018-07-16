import Vue from 'vue';
import store from '@/store';

export default {
  login: function (password) {
    Vue.axios.post('api/auth', { password: password })
      .then((response) => {
        this.saveToken(response.data.token);
      })
      .catch((error) => {
        this.saveToken('');
      });
  },

  logout: function () {
    this.saveToken('');
  },

  saveToken: function (token) {
    localStorage.setItem('token', token);
    store.commit('setLoggedIn', !!token);
  },

  getToken: function () {
    return localStorage.getItem('token') || '';
  },

  isLoggedIn: function () {
    Vue.axios.get('api/auth/loggedin')
      .then((response) => {
        store.commit('setLoggedIn', response.data.loggedin);
      })
      .catch((error) => {
        store.commit('setLoggedIn', false);
      });
  },

  hasAuth: function () {
    Vue.axios.get('api/auth')
      .then((response) => {
        store.commit('setHasAuth', response.data.hasAuth);
      })
      .catch((error) => {
        store.commit('setHasAuth', false);
      });
  },

  updatePassword: function (currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      Vue.axios.get('api/auth/update', {
        newPassword: newPassword,
        currentPassword: currentPassword
      })
        .then((response) => {
          this.saveToken(response.data.token);
          resolve(response);
        })
        .catch((error) => {
          this.saveToken('');
          reject(error);
        });
    });
  }
};
