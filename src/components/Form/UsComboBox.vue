<template>
  <div :class="`usa-form-group ${errorMessage ? 'usa-form-group--error' : ''}`">
    <label :for="id" :class="`usa-label ${!label && srOnlyLabel ? 'sr-only' : ''}`">
      <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
      {{ label }}
      <slot name="label"></slot>
      <UsTooltip v-if="tooltip" :id="`textTooltip${id}`" :iconOnly="true" :description="tooltip" />
    </label>
    <div class="usa-combo-box">
      <select class="usa-select" name="fruit" id="fruit">
        <option value>{{ placeholder }}</option>
        <option v-for="option in optionObjects" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import comboBox from 'uswds/src/js/components/combo-box';
import UsTooltip from '../UsTooltip.vue';

export default {
  components: { UsTooltip },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    srOnlyLabel: {
      type: String,
    },
    options: {
      type: Array.required,
    },
    value: {
      type: [String, Number],
    },
    required: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
    placeholder: {
      type: String,
    },
    tooltip: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
  },
  computed: {
    optionObjects() {
      return this.options.map((option) => {
        if (typeof option === 'string') {
          return {
            value: option,
            label: option,
          };
        }
        return option;
      });
    },
  },
  mounted() {
    // Initialize component with USWDS javascript
    comboBox.on();
  },
};
</script>

<style lang="scss">
.usa-combo-box__input-button-separator {
  top: 0;
}

.usa-combo-box__toggle-list,
.usa-combo-box__clear-input {
  margin: 0;
  padding: 0;
}
</style>
