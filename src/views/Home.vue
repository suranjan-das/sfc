<template>
  <div id="home">
    <Navbar :msg="username"/>
    <router-view class="view deck" name="Dashboard"></router-view>
  </div>
</template>

<script>
import store from '../store/store'
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Deck from "@/components/Deck.vue"
import Dashboard from "./Dashboard.vue"

export default {
  name: "Home",
  data() {
    return {
      username: "",
    };
  },
  methods: {
    
  },
  computed: {},
  created: function () {
    fetch("http://localhost:8080/api/user", {
      headers: {
        authentication_token: store.state.accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.username = "Welcome " + data["name"];        
        // this.setUser(data["name"]);
      });
  },
  components: {
    Navbar, Deck, Dashboard
  },
};
</script>

<style>
</style>