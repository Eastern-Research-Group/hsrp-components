<template>
  <fieldset class="usa-fieldset" :readonly="readonly">
    <legend class="usa-legend usa-legend">
      <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
      {{ label }}
      <slot name="hoverInfo" />
    </legend>
    <div
      v-for="option in optionObjects"
      :key="option.value"
      :class="`usa-${type} ${isInline ? 'usa-options-inline' : ''}`"
    >
      <input
        :class="`usa-${type}__input`"
        :id="`${id}_${option.value}`"
        :type="type"
        :name="id"
        :value="option.value"
        :checked="isChecked(option)"
        :disabled="option.disabled || readonly"
        :required="type === 'radio' && required"
        @input="updateValue"
      />
      <label :class="`usa-${type}__label`" :for="`${id}_${option.value}`" :title="option.title">
        {{ option.label }}
      </label>
    </div>
  </fieldset>
</template>

<script>
export default {
  name: 'CheckboxRadioGroup',
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Array],
    },
    modelValue: {
      type: [String, Number, Array],
    },
    label: {
      type: String,
      required: true,
    },
    srOnlyLabel: {
      type: String,
    },
    type: {
      type: String,
      default: 'checkbox',
    },
    required: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    isInline: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['input', 'update:modelValue'],
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
  methods: {
    isChecked(option) {
      const value = this.modelValue ?? this.value;
      if (Array.isArray(value)) {
        return value.indexOf(option.value.toString()) > -1;
      }
      return option.value === value;
    },
    updateValue(event) {
      if (this.type === 'radio') {
        return this.$emit('input', event.target.value);
      }

      // Checkbox group requires special logic to store as array of values instead of single selected value
      const value = this.modelValue ?? this.value;
      const eventVal = event.target.value;
      const currentVal = value || [];

      if (currentVal.indexOf(eventVal) > -1) {
        currentVal.splice(currentVal.indexOf(eventVal), 1);
      } else {
        currentVal.push(eventVal);
      }
      this.$emit('update:modelValue', currentVal);
      return this.$emit('input', currentVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.usa-fieldset {
  margin-top: 1.25rem;
}

.usa-options-inline {
  display: inline-block;
  margin-right: 0.75rem;
}

.usa-checkbox,
.usa-radio {
  position: relative;
}

.usa-checkbox__label,
.usa-radio__label {
  display: inline-block;
  margin-top: 0.25rem;
}

.usa-checkbox__label::before {
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
}

.usa-radio__label::before,
.usa-checkbox__label::before {
  box-shadow: 0 0 0 1pt #71767a;
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  top: 1px;
}

.usa-fieldset[readonly] {
  input:not(:checked) + label,
  input:checked + label::before {
    display: none;
  }

  // Match vue-select styles to account for multiple selected checkboxes
  input:checked + label {
    font-size: size('sans', 'xs');
    cursor: text;
    background-color: #f8f8f8;
    border: 1px solid rgba(60, 60, 60, 0.26);
    border-radius: 4px;
    padding: 2px 0.25rem 2px 2.25rem;
    margin-left: 2px;
    margin-right: 2px;
    color: #333;
  }

  input + label::before {
    cursor: text;
    width: 0.93rem;
    height: 0.93rem;
    top: 2px;
  }
}

// Needed in order to display browser validation message on required radios
input[type='radio'][required] {
  left: unset;
  opacity: 0;
}
</style>
