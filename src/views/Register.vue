<template>
  <div class="login-page">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
          <div class="card register">
            <h1>Sign Up</h1>
            <form class="form-group" @submit.prevent="register">
              <input
                class="form-control"
                v-model="user_name"
                type="text"
                placeholder="name"
                required
              />
              <input
                class="form-control"
                v-model="user_email"
                type="email"
                placeholder="email"
                required
              />
              <input
                class="form-control"
                v-model="user_password"
                type="password"
                placeholder="password"
                required
              />
              <input class="btn btn-primary" type="submit" />
              <p>
                Already have an account
                <router-link to="/login">Sign in here</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router/router"

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
        .then((response) => {
          if (response.ok) {
            response.json();
            this.makeToast('success', 'Sign up succesfull, go to login page');
          } else if (response.status == 435) {
            this.makeToast(
              "danger",
              "This email already in use, please use a separate email"
            );
          }
        })
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
    makeToast(variant = null, message) {
      this.$bvToast.toast(message, {
        variant: variant,
        solid: true,
      });
    },
  },
};
</script>

<style scoped>
p {
  line-height: 1rem;
}

.card {
  padding: 20px;
}

.form-group input {
  margin-bottom: 20px;
}

.login-page {
  align-items: center;
  display: flex;
  height: 100vh;
}

h1 {
  margin-bottom: 1.5rem;
}
</style>