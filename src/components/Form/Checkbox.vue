<template>
  <div class="input-container">
    <input
      class="input"
      :id="id"
      :value="value"
      :checked="checked"
      type="checkbox"
      :disabled="disabled"
      @change="$emit('change', $event)"
    />
    <label class="label" :for="id">
      <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
    },
    checked: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    label: {
      type: String,
      required: true,
    },
    srOnlyLabel: {
      type: String,
    },
  },
};
</script>
