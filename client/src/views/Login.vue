<template>
  <div class="login">
    <h1>Log-in</h1>
    <form @submit="requestLogin">
      <label>
        <b>E-mail</b>
        <input id="email" type="email" required>
      </label>
      <label>
        <b>Senha</b>
        <input id="password" type="password" required>
      </label>
      <input type="submit" value="Log-in">
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('authentication', ['login']),
    requestLogin(e) {
      e.preventDefault();
      this.login({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      });
    },
  },
};
</script>

<style>
.login form{
  width: 250px;
  text-align: start;
  display: block;
  margin: auto;
}
.login form input:not([type="submit"]){
  width: 100%;
  box-sizing: border-box;
}
.login form input[type="submit"]{
  display: block;
  margin: auto;
}
</style>
