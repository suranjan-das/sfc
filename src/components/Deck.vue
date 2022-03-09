<template>
  <div>
    <b-table
      striped
      hover
      :items="items"
      :fields="fields"
    >
      <template v-slot:cell(train)="data">
        <b-link @click="goToCards(data.item.d_id)" href="#"><b-icon scale="1.5" icon="arrow-right-circle-fill"></b-icon></b-link>
      </template>
      <template v-slot:cell(Edit)="data">
        <b-button
          size="sm"
          @click="editDeck(data.item.d_id)"
          variant="outline-success"
          ><b-icon icon="pencil-square"></b-icon
        ></b-button>
        <b-button
          size="sm"
          @click="deleteDeck(data.item.d_id)"
          variant="outline-danger"
          ><b-icon icon="trash-fill"></b-icon
        ></b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import store from "../store/store";

export default {
  mounted() {
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
  data() {
    return {
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [
        {
          key: "deck_name",
          label: "Name",
          class: "text-center",
          //sortable: true
        },
        {
          key: "train",
          label: "",
          class: "text-center",
          //sortable: true
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
          //sortable: true
        },
        {
          key: "score",
          label: "score",
          class: "text-center",
        },
        {
          key: "Edit",
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
    deleteDeck: function (d) {
      console.log("delete deck with id:", d);
    },
    goToCards: function(d) {
      console.log("go to cards with id:", d);
    }
  },
};
</script>