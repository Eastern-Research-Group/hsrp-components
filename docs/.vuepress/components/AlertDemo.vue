<template>
  <div>
    <label for="alertType">Alert Type</label>
    <select id="alertType" v-model="type">
      <option value="info">Info</option>
      <option value="warning">Warning</option>
      <option value="error">Error</option>
      <option value="success">Success</option>
    </select>
    <input id="slim" class="margin-left-2" type="checkbox" v-model="slim"><label for="slim" class="margin-left-1">Slim Style</label>
    <Alert :type="type" :text="`This is a ${type} alert.`" :slim="slim" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'info',
      slim: false,
    };
  },
};
</script>
