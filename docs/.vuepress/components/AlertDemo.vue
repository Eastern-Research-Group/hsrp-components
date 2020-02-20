<template>
  <div>
    <label for="alertType">Alert Type</label>
    <select id="alertType" v-model="type">
      <option value="info">Info</option>
      <option value="warning">Warning</option>
      <option value="error">Error</option>
      <option value="success">Success</option>
    </select>
    <Alert :type="type" :text="`This is a ${type} alert.`" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'info',
    };
  },
};
</script>
