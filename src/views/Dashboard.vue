<template>
  <div>
    <Navbar />
    <b-table hover :items="items" :fields="fields">
      <template v-slot:cell(deck_name)="data">
        <b-link style="text-decoration: none" href="" @click="goToCards(data.item.d_id)">{{data.item.deck_name}}</b-link>
      </template>
      <template v-slot:cell(export)="data">
        <b-link @click="goToCards(data.item.d_id)"
          ><b-icon scale="1.5" icon="file-earmark-arrow-up"></b-icon
        ></b-link>
      </template>
      <template v-slot:cell(Edit)="data">
        <b-link
          @click="editDeck(data.item.d_id)"
          ><b-icon scale="1.5" variant="success" icon="pencil-square"></b-icon
        ></b-link>
        </template>
        <template v-slot:cell(Delete)="data">
        <b-link
          @click="deleteDeck(data.item.d_id)"
          ><b-icon scale="1.5" variant="danger" icon="trash"></b-icon
        ></b-link>
      </template>
    </b-table>
    <b-button
      id="add-btn"
      variant="primary"
      class="position-absolute bottom-0 end-0"
      size="lg"
      pill
      v-b-modal.my-modal
      >+</b-button
    >
    <!-- The modal -->
    <b-modal
      id="my-modal"
      hide-header-close
      @ok="addNewDeck"
      @hidden="clearAddDeckForm"
    >
      <template #modal-title> Add new deck </template>
      <b-form>
        <b-form-input v-model="deck.name" type="text" placeholder="Deck name" />
        <br />
        <b-form-textarea
          v-model="deck.info"
          type="text"
          placeholder="Deck info"
        />
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import store from "../store/store";
import router from "../router/router";
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

if (window.screen.width < 800) {
  // do stuff
  console.log("adjust table");
}

export default {
  mounted() {
    this.getDecks();
  },
  data() {
    return {
      username: "",
      deck: {
        name: "",
        info: "",
      },
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [
        {
          key: "deck_name",
          label: "Name",
          class: "text-center",
        },
        {
          key: "deck_info",
          label: "Info",
          class: "text-center",
          //sortable: false
        },
        {
          key: "time_created",
          label: "Reviewed on",
          class: "text-center",
        },
        {
          key: "score",
          label: "Score",
          class: "text-center",
        },
        {
          key: "export",
          label: "Export",
          class: "text-center",
        },
        {
          key: "Edit",
          label: "",
        },
        {
          key: "Delete",
          label: "",
        },
      ],
      items: [],
    };
  },
  methods: {
    editDeck: function (d) {
      console.log("edit deck with id:", d);
    },
    deleteDeck: function (id) {
      fetch(`http://localhost:8080/api/deck/${id}`, {
        method: "DELETE",
        headers: {
          authentication_token: store.state.accessToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.getDecks();
        });
    },
    goToCards: function (d) {
      console.log("go to cards with id:", d);
      router.push(`/card/${d}`);
    },
    addNewDeck: function () {
      fetch("http://localhost:8080/api/deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authentication_token: store.state.accessToken,
        },
        body: JSON.stringify({
          deck_name: this.deck.name,
          deck_info: this.deck.info,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.getDecks();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    clearAddDeckForm: function () {
      this.deck.name = "";
      this.deck.info = "";
    },
    getDecks: function () {
      fetch("http://localhost:8080/api/deck", {
        headers: {
          authentication_token: store.state.accessToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.items = data;
        });
    },
  },
  components: {
    Navbar,
  },
};
</script>

<style scoped>
#add-btn {
  margin: 30px;
  font-size: 20px;
  font-weight: bold;
}
</style>