<template>
  <div class="about">
    <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
    <h3>New user registration</h3>
    <form @submit.prevent="register">
      <input v-model="user_name" type="text" placeholder="name" />
      <br />
      <br />
      <input v-model="user_email" type="email" placeholder="email" />
      <br />
      <br />
      <input v-model="user_password" type="password" placeholder="password" />
      <p></p>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data: function () {
    return {
      user_name: null,
      user_email: null,
      user_password: null,
    };
  },
  methods: {
    register() {
      fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.user_name,
          email: this.user_email,
          password: this.user_password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
        this.user_name = null;
        this.user_email = null;
        this.user_password = null;
    },
  },
};
</script>