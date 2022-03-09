import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/router';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    accessToken: null,
    loggingIn: false,
    loginError: null,
    base_url: "http://localhost:8080/",
  },
  mutations: {
    loginStart: state => state.loggingIn = true,
    loginStop: (state, errorMessage) => {
      state.loggingIn = false;
      state.loginError = errorMessage;
    },
    setUser: (state, user) => {
      state.user = user;
    },
    updateAccessToken: (state, accessToken) => {
      state.accessToken = accessToken;
    },
    logout: (state) => {
      state.accessToken = null;
    }
  },
  actions: {
    doLogin({ commit }, loginData) {
      console.log(loginData);
      commit('loginStart');

      fetch("http://localhost:8080/login?include_auth_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('accessToken', data.response.user.authentication_token);
        commit('loginStop', null);
        commit('updateAccessToken', data.response.user.authentication_token);
        router.push("/dashboard")
        })
      .catch(error => {
        commit('loginStop', error.response.data.error);
        commit('updateAccessToken', null);
      })
    },
    fetchAccessToken({ commit }) {
      commit('updateAccessToken', localStorage.getItem('accessToken'));
    },
    logout({ commit }) {
      console.log("log out pressed")
      localStorage.removeItem('accessToken');
      commit('logout');
      router.push('/login');
    }
  },
  modules: {
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
  }
})

export default store;