<template>

  <div>
    <nav class="navbar navbar-expand navbar-dark bg-dark justify-content-between">
      <a class="navbar-brand">
        <img src="../assets/header_logo.png"
          alt="hoot" />
      </a>
      <!-- page links -->
      <ul class="navbar-nav mr-auto ml-5">
        <li class="nav-item mr-2">
          <router-link to="/"
            active-class="active"
            class="nav-link">
            Parliament
          </router-link>
        </li>
        <li class="nav-item mr-2">
          <router-link to="/issues"
            active-class="active"
            class="nav-link">
            Issues
          </router-link>
        </li>
        <li class="nav-item mr-2"
          v-if="(hasAuth && loggedIn) || !hasAuth">
          <router-link to="/settings"
            active-class="active"
            class="nav-link">
            Settings
          </router-link>
        </li>
      </ul> <!-- /page links -->
      <form class="form-inline">
        <!-- refresh interval select -->
        <span class="form-group"
          v-if="!showLoginInput">
          <div class="input-group">
            <span class="input-group-prepend cursor-help">
              <span class="input-group-text"
                v-b-tooltip.hover.left
                title="Page data refresh interval">
                <span class="fa fa-refresh">
                </span>
              </span>
            </span>
            <select class="form-control refresh-interval-control"
              tabindex="1"
              v-model="refreshInterval"
              @change="changeRefreshInterval">
              <option value="">Never</option>
              <option value="15000">15 seconds</option>
              <option value="30000">30 seconds</option>
              <option value="45000">45 seconds</option>
              <option value="60000">1 minute</option>
              <option value="300000">5 minutes</option>
            </select>
          </div>
        </span> <!-- /refresh interval select -->
        <!-- password input -->
        <!-- TODO [appAutofocus]="focusOnPasswordInput" -->
        <input class="form-control ml-1"
          tabindex="2"
          type="password"
          v-model="password"
          @keyup.enter="login"
          placeholder="password please"
          :class="{'hide-login':!showLoginInput,'show-login':showLoginInput}"
        /> <!-- /password input -->
        <!-- login button -->
        <a class="btn btn-outline-success cursor-pointer ml-1"
          @click="login"
          tabindex="3"
          v-if="!loggedIn && hasAuth">
          <span class="fa fa-unlock">
          </span>&nbsp;
          Login
        </a> <!-- /login button -->
        <!-- logged in -->
        <a class="btn btn-outline-danger cursor-pointer ml-1"
          @click="logout"
          tabindex="4"
          v-else>
          <span class="fa fa-lock">
          </span>&nbsp;
          Logout
        </a> <!-- /logged in -->
      </form>
    </nav>
  </div>

</template>

<script>
import AuthService from '@/auth';

export default {
  name: 'ParliamentNavbar',
  data: function () {
    return {
      // page errors
      error: '',
      // data refresh interval default
      refreshInterval: 15000,
      // password input vars
      password: '',
      showLoginInput: false
    };
  },
  computed: {
    // auth vars
    hasAuth: function () {
      return this.$store.state.hasAuth;
    },
    loggedIn: function () {
      return this.$store.state.loggedIn;
    }
  },
  mounted: function () {
    AuthService.hasAuth();
    AuthService.isLoggedIn();
  },
  methods: {
    changeRefreshInterval: function () {
      // TODO
      console.log('change refresh interval');
    },
    login: function () {
      this.password = '';
      AuthService.login(this.password);
    },
    logout: function () {
      AuthService.logout();
    }
  }
};
</script>

<style scoped>
nav.navbar > .navbar-brand > img {
  position: absolute;
  height: 52px;
  top: 7px;
}

/* remove browser select box styling */
.refresh-interval-control {
  -webkit-appearance: none;
}
</style>
