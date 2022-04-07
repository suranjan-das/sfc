<template>
  <div>
    <Navbar :showExport="true" @export="exportTo" />
    <div class="empty-message" v-if="!items.length">
      <h1>Nothing to show start adding deck now!!!</h1>
    </div>
    <b-table v-else hover :items="items" :fields="fields" class="text-center">
      <template #cell(select_row)="data">
        <b-form-group>
          <b-checkbox
            @input="onCheckboxSelect($event, data.index, data.item)"
          />
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
            <b-dropdown-item @click="editDeck(data.item)">Edit</b-dropdown-item>
            <b-dropdown-item @click="deleteDeck(data.item.d_id)"
              >Delete</b-dropdown-item
            >
            <b-dropdown-item @click="goToCards(data.item.d_id)"
              >Visit</b-dropdown-item
            >
            <!-- <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="exportTo">Export</b-dropdown-item> -->
          </b-dropdown>
        </div>
      </template>
    </b-table>
    <!-- The add deck modal -->
    <b-modal
      id="my-modal"
      hide-header-close
      @ok="handleOk"
      @show="clearAddDeckForm"
      @hidden="clearAddDeckForm"
    >
      <template #modal-title> Add new deck </template>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="deck.name"
            :state="nameState"
            type="text"
            placeholder="Deck name"
            required
          />
          <br />
          <b-form-textarea
            v-model="deck.info"
            type="text"
            placeholder="Deck info"
          />
        </b-form-group>
      </form>
    </b-modal>
    <!-- The edit deck modal -->
    <b-modal
      id="edit-modal"
      hide-header-close
      @ok="updateDeck"
      @hidden="clearAddDeckForm"
    >
      <template #modal-title> Update deck </template>
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
    <!-- The export deck modal -->
    <b-modal id="export-modal" hide-header-close @ok="exportDecks">
      <b-form-file
        v-model="file1"
        :state="Boolean(file1)"
        @submit="exportDecks"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
    </b-modal>
  </div>
</template>

<script>
import store from "../store/store";
import router from "../router/router";
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
  created() {
    this.items = " ";
    this.getDecks();
  },
  mounted() {
    console.log("after mounting data is ", this.items);
  },
  data() {
    return {
      nameState: null,
      file1: null,
      deck: {
        id: null,
        name: "",
        info: "",
      },
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [
        {
          key: "select_row",
          label: "",
        },
        {
          key: "deck_name",
          label: "Name",
        },
        {
          key: "deck_info",
          label: "Info",
        },
        {
          key: "time_created",
          label: "Reviewed on",
          formatter: (value, key, item) => {
            return value.substring(0, 16);
          },
        },
        {
          key: "action",
          label: "Action",
        },
        {
          key: "score",
          label: "Score",
          sortable: true,
        },
      ],
      items: [],
      selectedRows: [],
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      if (!this.checkFormValidity()) {
        return;
      }
      this.addNewDeck();
      this.$nextTick(() => {
        this.$bvModal.hide("my-modal");
      });
    },
    onCheckboxSelect(value, index, row) {
      if (value) {
        this.selectedRows.push(row);
      } else {
        let index = this.selectedRows.indexOf(row);
        this.selectedRows.splice(index, 1);
      }
    },
    editDeck: function (deckData) {
      this.modal_title = "Update deck";
      this.deck.id = deckData.d_id;
      this.deck.name = deckData.deck_name;
      this.deck.info = deckData.deck_info;
      this.$bvModal.show("edit-modal");
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
          this.getDecks();
        });
      this.makeToast("info", "Deck deleted successfully");
    },
    updateDeck: function () {
      fetch(store.state.base_url + `api/deck/${this.deck.id}`, {
        method: "PUT",
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
          this.getDecks();
        })
        .catch((error) => console.error(error));
    },
    addNewDeck: function () {
      this.modal_title = "Add new deck";
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
          this.getDecks();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    goToCards: function (d) {
      console.log("go to cards with id:", d);
      router.push(`/card/${d}`);
    },
    clearAddDeckForm: function () {
      this.nameState = null;
      this.deck.id = null;
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
    exportTo: function () {
      if (!this.selectedRows.length) {
        this.makeToast("danger", "select atleast one deck");
      } else {
        this.$bvModal.show("export-modal");
      }
    },
    exportDecks: function () {
      console.log(this.file1);
      fetch(store.state.base_url + "/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authentication_token: store.state.accessToken,
        },
        body: JSON.stringify(this.selectedRows),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    makeToast(variant = null, message) {
      this.$bvToast.toast(message, {
        variant: variant,
        solid: true,
      });
    },
  },
  components: {
    Navbar,
  },
};
</script>

<style scoped>
.empty-message {
  font-family:cursive;
  position: fixed;
  top: 50%;
  left: 20%;
  color:cadetblue;
}
</style>