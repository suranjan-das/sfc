import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/router';
import Login from '../views/Login'

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
    },
  },
  actions: {
    fetchAccessToken({ commit }) {
      commit('updateAccessToken', localStorage.getItem('accessToken'));
    },
    logout({ commit }) {
      localStorage.removeItem('accessToken');
      commit('logout');
      router.push('/login');
    },
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