<template>
  <div id="app" style="height: 100%;">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
// import router from './router';

export default {
  beforeMount() {
    this.configPivot();

    // if (this.isLoggedIn) {
    //   if (!this.user.logged) {
    //     this.me();
    //   }
    // } else {
    //   router.push('/login').catch(() => {});
    // }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapGetters('authentication', ['isLoggedIn']),
  },
  methods: {
    ...mapActions('authentication', ['me', 'configPivot', 'logout']),
  },
};
</script>

<style lang="scss">
body{
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
