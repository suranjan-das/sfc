<template>
  <div>
    <Navbar :showExport="false" />
    <b-list-group>
      <b-list-group-item>
        Cras justo odio
        <b-button>I am a Button</b-button>
      </b-list-group-item>
      <b-list-group-item>Dapibus ac facilisis in</b-list-group-item>
      <b-list-group-item>Morbi leo risus</b-list-group-item>
      <b-list-group-item>Porta ac consectetur ac</b-list-group-item>
      <b-list-group-item>Vestibulum at eros</b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
export default {
  components: { Navbar },
};
</script>

<style>
</style>