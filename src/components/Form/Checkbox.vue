<template>
  <div>
    <div class="usa-checkbox">
      <input
        class="usa-checkbox__input"
        :id="id"
        :value="value"
        :checked="checked"
        type="checkbox"
        :disabled="disabled"
        @change="$emit('change', $event)"
      />
      <label :class="`usa-checkbox__label ${!label && srOnlyLabel ? 'margin-top-0' : ''}`" :for="id">
        <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
        {{ label }}
        <slot name="label"></slot>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckboxUs',
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
    },
    srOnlyLabel: {
      type: String,
    },
  },
};
</script>

<style scoped>
.usa-checkbox {
  position: relative;
}

.usa-checkbox__label {
  display: inline-block;
  margin-top: 0.25rem;
}

.usa-checkbox__label::before {
  box-shadow: 0 0 0 1pt #71767a;
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  top: 2px;
}
</style>
