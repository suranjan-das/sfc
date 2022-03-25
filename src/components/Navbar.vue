<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item @click="toDashboard" href="#">Dashboard</b-nav-item>

        <b-nav-item-dropdown text="User" right>
          <b-dropdown-item href="#">Account</b-dropdown-item>
          <b-dropdown-item href="#" @click="toSettings">Settings</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-b-modal.my-modal>Add</b-nav-item>
        
        <b-nav-item v-if="showExport" @click="doExport">Export</b-nav-item>
        
        <b-nav-item>Import</b-nav-item>
        <b-nav-item @click="logout">Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import router from "../router/router";

export default {
  name: "Navbar",
  props: {
    showExport: Boolean,
  },
  methods: {
    ...mapActions(["logout"]),
    toDashboard() {
      router.push("/dashboard");
    },
    doExport:function() {
      this.$emit('export')
    },
    toSettings: function() {
      router.push("/settings")
    }
  }
};
</script>