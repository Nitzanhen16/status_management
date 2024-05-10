<template>
  <div id="app">
    <div id="body" style="display:flex;justify-content:space-between;margin:5%;padding:5%">
      <div id="statuses" style="margin:15px;padding:15px">
        <h1> Add status</h1>
        <AddStatus
            @status-added="addStatus"
            @status-deleted="removeStatus"
            :statusList="statusList"/>
      </div>
      <div id="transitions" style="margin:15px;padding:15px">
        <h1> add transition</h1>
        <AddTransition
            @trans-added="addTransition"
            @trans-deleted="removeTransition"
            :statusList="statusList" :transitionList="transitionList"/>
      </div>
    </div>
    <div id="reset" style="height:50%">
<!--      <h1> Reset</h1>-->
      <button @click="reset()" class="reset-button">reset</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AddStatus from './components/AddStatus.vue'
import AddTransition from './components/AddTransition.vue'

export default {
  name: 'App',
  components: {
    AddStatus,
    AddTransition,
  },
  data() {
    return {
      statusList: [],
      transitionList: []
    }
  },
  mounted() {
    this.fetchData(); // Fetch data when the component is mounted
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:3000/')
          .then(response => {
            console.log(response.data.statuses)
            this.statusList = response.data.statuses;
            this.transitionList = response.data.transitions;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },
    reset() {
      axios.post('http://localhost:3000/reset')
          .then(response => {
            console.log(response.data.statuses)
            this.statusList = response.data.statuses;
            this.transitionList = response.data.transitions;
          })
          .catch(error => {
            console.error('Error resetting data:', error);
          });
    },
    addStatus(status_name) {
      axios.post('http://localhost:3000/add_status', { name: status_name })
          .then(response => {
            console.log(response.data.statuses)
            this.statusList = response.data.statuses;
            this.transitionList = response.data.transitions;
          })
          .catch(error => {
            console.error('Error adding status:', error);
          });
    },
    removeStatus(status_name) {
      axios.post('http://localhost:3000/del_status', { name: status_name })
          .then(response => {
            console.log(response.data.statuses)
            this.statusList = response.data.statuses;
            this.transitionList = response.data.transitions;
          })
          .catch(error => {
            console.error('Error deleting status:', error);
          });
    },
    addTransition(transition) {
      axios.post('http://localhost:3000/add_transition',
          {
            name: transition.name,
            from_id: transition.from_id,
            to_id: transition.to_id,
          })
          .then(response => {
            console.log(response.data.statuses)
            this.statusList = response.data.statuses;
            this.transitionList = response.data.transitions;
          })
          .catch(error => {
            console.error('Error adding transition:', error);
          });
    },
    removeTransition(trans_name) {
      axios.post('http://localhost:3000/del_transition', { name: trans_name })
          .then(response => {
            console.log(response.data.statuses)
            this.statusList = response.data.statuses;
            this.transitionList = response.data.transitions;
          })
          .catch(error => {
            console.error('Error deleting transition:', error);
          });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.reset-button {
  font-size: 20px; /* Set font size to make the button large */
  color: white; /* Set text color to white */
  background-color: red; /* Set background color to red */
  padding: 10px 20px; /* Set padding to create some space around the text */
  border: none; /* Remove border */
  border-radius: 5px; /* Add border radius for rounded corners */
  cursor: pointer; /* Set cursor to pointer for better UX */
}
</style>