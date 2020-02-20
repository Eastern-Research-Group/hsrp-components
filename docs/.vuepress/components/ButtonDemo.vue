<template>
  <div>
    <label for="btnStyle">Button Style</label>
    <select id="btnStyle" v-model="type">
      <option value="">Default</option>
      <option value="unstyled">Unstyled</option>
      <option value="outline">Outline</option>
      <option value="base">Base</option>
    </select>
    <Button :btnStyle="type" label="Click Me" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: '',
    };
  },
};
</script>
