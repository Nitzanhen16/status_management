<template>
  <div class="add_status">
    <form v-on:submit.prevent="addStatus">
      <p>name: <input type="text" required v-model="statusName"></p>
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="status in statusList" :key="status.id">
        {{ status.name }}
        <button @click="removeStatus(status.name)">Remove</button>
        <span v-if="status.init">[INIT]</span>
        <span v-if="status.final">[FINAL]</span>
        <span v-if="status.orphan">[ORPHAN]</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AddStatus',
  props: {
    statusList: Array,
  },
  data() {
    return {
      statusName: null,
    }
  },
  methods: {
    addStatus() {
      this.$emit('status-added', this.statusName);
      this.statusName = null
    },
    removeStatus(name) {
      this.$emit('status-deleted', name);
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
a {
  color: #42b983;
}
</style>
