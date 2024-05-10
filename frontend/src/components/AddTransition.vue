<template>
  <div class="add_transition">
    <form v-on:submit.prevent="addTransition">
      <p>name: <input type="text" required v-model="transitionName"></p>
      <p>From:
        <select v-model="fromItem" required>
          <option v-for="(item, index) in statusList" :key="'from_' + index" :value="item.status_id">{{ item.name }}</option>
        </select>
      </p>
      <p>To:
        <select v-model="toItem" required>
          <option v-for="(item, index) in statusList" :key="'to_' + index" :value="item.status_id" :disabled="item.status_id === fromItem">{{ item.name }}</option>
        </select>
      </p>
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="transition in transitionList" :key="transition.id">
        {{ transition.name }}: {{ getStatusName(transition.from_id) }} -> {{ getStatusName(transition.to_id) }}
        <button @click="removeTransition(transition.name)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AddTransition',
  props: {
    statusList: Array,
    transitionList: Array,
  },
  data() {
    return {
      transitionName: null,
      fromItem: null,
      toItem: null,
    }
  },
  methods: {
    getStatusName(statusId) {
      const status = this.statusList.find(status => status.status_id === statusId);
      return status ? status.name : '';
    },
    addTransition() {
      let transition = {
        name: this.transitionName,
        from_id: this.fromItem,
        to_id: this.toItem
      }
      console.log('transition')
      console.log(transition)
      this.$emit('trans-added', transition);

      this.transitionName = null
      this.fromItem = null;
      this.toItem = null;
    },
    removeTransition(name) {
      this.$emit('trans-deleted', name);
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
li {
  text-align: left;
}
a {
  color: #42b983;
}
</style>
