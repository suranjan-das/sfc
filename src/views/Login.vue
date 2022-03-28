<template>
  <div class="login-page">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
          <div class="card login">
            <h1>Sign In</h1>
            <form @submit.prevent="login" class="form-group">
              <input
                class="form-control"
                v-model="email"
                placeholder="email"
                required
              />
              <input
                class="form-control"
                v-model="password"
                placeholder="password"
                type="password"
                required
              />
              <input type="submit" class="btn btn-primary" />
              <p>
                Don't have an account?
                <router-link to="/register">Sign up here</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapActions } from "vuex";
import store from "../store/store";
import router from "../router/router";

export default {
  name: "Login",
  data: function () {
    return {
      email: "",
      password: "",
      loginSuccess: true,
    };
  },
  methods: {
    ...mapActions(["fetchAccessToken"]),
    ...mapMutations([
      "loginStart",
      "loginStop",
      "setUser",
      "updateAccessToken",
    ]),
    login() {
      let loginData = {
        email: this.email,
        password: this.password,
      };
      this.doLogin(loginData);
    },
    doLogin(loginData) {
      this.loginStart;
      fetch("http://localhost:8080/login?include_auth_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            this.email = "";
            this.password = "";
            this.makeToast(
              "danger",
              "login credential incorrect, please check username and password"
            );
          }
        })
        .then((data) => {
          localStorage.setItem(
            "accessToken",
            data.response.user.authentication_token
          );
          this.loginStop(null);
          this.updateAccessToken(
            store.state,
            data.response.user.authentication_token
          );
          router.push("/dashboard");
        })
        .catch((error) => {
          this.loginStop(error.response.data.error);
          this.updateAccessToken(null);
        });
    },
    makeToast(variant = null, message) {
      this.$bvToast.toast(message, {
        variant: variant,
        solid: true,
      });
    },
  },
  components: {},
  created() {
    this.fetchAccessToken();
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
