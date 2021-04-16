<template>
  <div>
    <label class="margin-bottom-2 display-inline-block" for="btnStyle">Button Style</label>
    <select id="btnStyle" v-model="type">
      <option value="">Default</option>
      <option value="unstyled">Unstyled</option>
      <option value="outline">Outline</option>
      <option value="secondary">Secondary</option>
      <option value="accent-cool">Accent Cool</option>
      <option value="base">Base</option>
      <option value="big">Big</option>
    </select>
    <br>
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
