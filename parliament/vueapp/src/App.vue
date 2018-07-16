<template>
  <div id="app">
    <parliament-navbar />
    <router-view />
  </div>
</template>

<script>
import ParliamentNavbar from './components/Navbar';

export default {
  name: 'App',
  components: {
    ParliamentNavbar
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.cursor-pointer, .pointer-cursor {
  cursor: pointer;
}
.cursor-help, .help-cursor {
  cursor: help;
}
</style>
