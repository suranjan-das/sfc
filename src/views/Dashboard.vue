<template>
  <div>
    <Navbar />
    <b-table hover :items="items" :fields="fields">
      <template #cell(select_row)="data">
        <b-form-group>
          <b-checkbox  
          @input="onCheckboxSelect($event, data.index, data.item)"/>
        </b-form-group>
      </template>
      <template #cell(deck_name)="data">
        <b-link href="" @click="goToCards(data.item.d_id)">{{
          data.item.deck_name
        }}</b-link>
      </template>
      <template #cell(action)="data">
        <div>
          <b-dropdown
            id="dropdown-1"
            right
            text="action"
            size="sm"
            variant="outline-primary"
            class="m-md-2"
          >
            <b-dropdown-item>Edit</b-dropdown-item>
            <b-dropdown-item @click="deleteDeck(data.item.d_id)"
              >Delete</b-dropdown-item
            >
            <b-dropdown-item>Visit</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item>Export</b-dropdown-item>
          </b-dropdown>
        </div>
      </template>
    </b-table>
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
          key: "select_row",
          label: "",
          class: "text-center",
        },
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
          formatter: (value, key, item) => {
            return value.substring(0, 16);
          },
        },
        {
          key: "action",
          label: "Action",
          class: "text-center",
        },
        {
          key: "score",
          label: "Score",
          class: "text-center",
        },
      ],
      items: [],
      selectedRows: []
    };
  },
  methods: {
    onCheckboxSelect(value, index, row) {
      if (value) {
        this.selectedRows.push(row)
      } else {
        let index = this.selectedRows.indexOf(row)
        this.selectedRows.splice(index, 1)
      }
    },
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
</style>