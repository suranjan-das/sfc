<template>
  <div class="login">
    <router-link to="/register">Register</router-link>
    <HelloWorld msg='Welcome to Your Vue.js App'/>
    <p></p>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <form @submit.prevent="login">
      <input v-model="email" placeholder="email" />
      <br />
      <br />
      <input v-model="password" placeholder="password" type="password" />
      <br />
      <br />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld'
import { mapMutations } from "vuex";
import { mapActions } from 'vuex'
import store from '../store/store'

export default {
  name: 'Login',
  data: function() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    // ...mapMutations(["setUser", "setToken"]),
    ...mapActions(["doLogin", "fetchAccessToken"]),
    login() {
      let loginData = {email: this.email, password: this.password};
      this.doLogin(loginData);
    },
  },
  components: {
    HelloWorld
  },
  created() {
    this.fetchAccessToken();
  }
}
</script>
