<template>
  <div>
    <Navbar />
    <div class="card-box text-center">
      <div class="card-top">Front</div>
      <div class="card-middle">
        <h3 class="card-front">{{ card_front }}</h3>
        <h4 v-if="!front_face" class="card-back">{{ card_back }}</h4>
      </div>
      <div class="card-bottom">
        <b-button @click="showAnswer()" v-if="front_face" variant="primary"
          >Show Answer</b-button
        >
        <div v-if="!front_face">
          <b-button class="mx-1" @click="nextCard()">Easy</b-button>
          <b-button class="mx-1" variant="success">Comfortable</b-button>
          <b-button class="mx-1" variant="outline-primary">Hard</b-button>
        </div>
      </div>
    </div>
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
    <b-modal id="my-modal" hide-header-close>
      <template #modal-title> Add new card </template>
      <b-form>
        <b-form-input type="text" placeholder="Card front" />
        <br />
        <b-form-textarea type="text" placeholder="Card back" />
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import store from "../store/store";

export default {
  data() {
    return {
      cards: [],
      card_front: null,
      card_back: null,
      card_score: 0,
      front_face: true,
      card_pos: 0
    };
  },
  props: ["id"],
  components: {
    Navbar,
  },
  created() {
    fetch(store.state.base_url + `api/card/${this.id}`, {
      headers: {
        authentication_token: store.state.accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.cards = data;
      });
  },
  methods: {
    showAnswer: function() {
      this.front_face = !this.front_face;
    },
    nextCard: function() {
      if(this.card_pos < this.cards.length) {
        this.card_front = this.cards[this.card_pos].front
        this.card_back = this.cards[this.card_pos].back
        this.card_pos += 1
      }
      this.showAnswer();
    }
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
  background-color: aquamarine;
  flex: 1 1 15%;
}
.card-middle {
  background-color: coral;
  flex: 1 2 80%;
}
.card-middle h3,
h4 {
  padding: 2rem;
}
.card-bottom {
  background-color: lavender;
  flex: 1 1 20%;
  padding: 1rem;
}
</style>