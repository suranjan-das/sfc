<template>
  <div>
    <Navbar :showExport="false"/>
    <div class="card-box text-center">
      <div class="card-top">
        <b-nav pills>
          <b-nav-item>Active</b-nav-item>
          <b-nav-item>Link</b-nav-item>
          <b-nav-item-dropdown
            id="my-nav-dropdown"
            text="Dropdown"
            toggle-class="nav-link-custom"
            right
          >
            <b-dropdown-item :disabled="cards_exhausted" @click="editCard">Edit</b-dropdown-item>
            <b-dropdown-item :disabled="cards_exhausted" @click="deleteCard">Delete</b-dropdown-item>
            <!-- <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item>Three</b-dropdown-item> -->
          </b-nav-item-dropdown>
        </b-nav>
      </div>
      <div>
        <hr />
      </div>
      <div class="card-middle">
        <h3 class="card-front">{{ card_front }}</h3>
        <h4 v-if="!front_face" class="card-back">{{ card_back }}</h4>
      </div>
      <div class="card-bottom">
        <b-button
          @click="showAnswer"
          v-if="front_face"
          variant="primary"
          :disabled="cards_exhausted"
          >Show Answer</b-button
        >
        <div v-if="!front_face">
          <b-button
            class="mx-1"
            @click="setScore(1)"
            variant="outline-secondary"
            >Easy</b-button
          >
          <b-button class="mx-1" @click="setScore(2)" variant="outline-success"
            >Comfortable</b-button
          >
          <b-button class="mx-1" @click="setScore(3)" variant="outline-primary"
            >Hard</b-button
          >
        </div>
      </div>
    </div>
    <!-- The add card modal -->
    <b-modal id="my-modal" hide-header-close @ok="addNewCard">
      <template #modal-title> Add new card </template>
      <b-form>
        <b-form-input
          v-model="newCard.front"
          type="text"
          placeholder="Card front"
        />
        <br />
        <b-form-textarea
          v-model="newCard.back"
          type="text"
          placeholder="Card back"
        />
      </b-form>
    </b-modal>
    <!-- The edit card modal -->
    <b-modal
      id="edit-card-modal"
      hide-header-close
      @ok="updateCardData"
    >
      <template #modal-title> Update card </template>
      <b-form>
        <b-form-input
          v-model="card_front"
          type="text"
          placeholder="Card front"
        />
        <br />
        <b-form-textarea
          v-model="card_back"
          type="text"
          placeholder="Card back"
        />
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import router from "../router/router";
import store from "../store/store";

export default {
  data() {
    return {
      cards: [],
      card_front: null,
      card_back: null,
      card_score: 0,
      front_face: true,
      card_pos: 0,
      cards_exhausted: false,
      newCard: {
        front: "",
        back: "",
      },
    };
  },
  props: ["id"],
  components: {
    Navbar,
  },
  methods: {
    showAnswer: function () {
      this.front_face = !this.front_face;
    },
    nextCard: function () {
      if (this.card_pos < this.cards.length) {
        this.card_front = this.cards[this.card_pos].front;
        this.card_back = this.cards[this.card_pos].back;
        //this.card_pos += 1
      } else {
        // all card has been read
        this.card_front = "No more cards to show";
        this.cards_exhausted = true;
      }
    },
    setScore: function (difficultyLevel) {
      this.cards[this.card_pos].score = difficultyLevel;
      this.card_pos += 1;
      this.nextCard();
      this.showAnswer();
    },
    addNewCard() {
      fetch(store.state.base_url + `api/card/${this.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authentication_token: store.state.accessToken,
        },
        body: JSON.stringify({
          front: this.newCard.front,
          back: this.newCard.back,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.makeToast("success", "card added in the deck");
        })
        .catch((error) => console.error(error));
      // clear add new card fields
      this.newCard.front = "";
      this.newCard.back = "";
    },
    updateCard() {
      // update the cards data while leaving
      fetch(store.state.base_url + `api/card/${this.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authentication_token: store.state.accessToken,
        },
        body: JSON.stringify(this.cards),
      })
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => console.error(error));
    },
    deleteCard: function () {
      let card_id = this.cards[this.card_pos].c_id;
      fetch(store.state.base_url + `api/card/${card_id}`, {
        method: "DELETE",
        headers: {
          authentication_token: store.state.accessToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.makeToast("success", "card deleted from deck");
        })
        .catch((error) => console.error(error));
      this.cards.splice(this.card_pos, 1);
      if (this.front_face) {
        this.nextCard();
      } else {
        this.nextCard();
        this.showAnswer();
      }
    },
    editCard: function () {
      this.$bvModal.show("edit-card-modal");
    },
    updateCardData: function () {
      this.cards[this.card_pos].front = this.card_front;
      this.cards[this.card_pos].back = this.card_back;
    },
    makeToast(variant = null, message) {
      this.$bvToast.toast(message, {
        title: `${variant || "default"}`,
        variant: variant,
        solid: true,
      });
    },
  },
  created() {
    fetch(store.state.base_url + `api/card/${this.id}`, {
      headers: {
        "Content-Type": "application/json",
        authentication_token: store.state.accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.cards = data;
        if (this.cards.length) {
          this.card_front = this.cards[0].front;
          this.card_back = this.cards[0].back;
        } else {
          // No card available, start adding cards
          this.card_front = "No cards to show, lets add one";
          this.cards_exhausted = true;
        }
      });
  },
  beforeDestroy() {
    this.updateCard();
  },
};
</script>

<style scoped>
#add-btn {
  margin: 30px;
  font-size: 20px;
  font-weight: bold;
}

.card-display {
  display: flex;
  background-color: antiquewhite;
  height: 100vh;
}

.card-box {
  height: 90vh;
  display: flex;
  flex-direction: column;
  /* gap: 1rem; */
}

.card-top {
  margin: 0.5rem;
}
.card-middle {
  flex: 1 2 80%;
}
.card-middle h3,
h4 {
  padding: 2rem;
}
.card-bottom {
  flex: 1 1 20%;
  padding: 1rem;
}
</style>