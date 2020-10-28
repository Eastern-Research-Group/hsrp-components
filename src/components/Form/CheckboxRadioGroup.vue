<template>
  <fieldset class="checkbox-radio-group" :readonly="readonly">
    <legend>
      <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
      {{ label }}
      <slot name="hoverInfo" />
    </legend>
    <ul class="checkbox-radio-list">
      <li :key="option.value" v-for="option in optionObjects">
        <input
          :type="type"
          :id="`${id}_${option.value}`"
          :name="id"
          :value="option.value"
          :checked="isChecked(option)"
          :disabled="option.disabled || readonly"
          @input="emitValueChange"
        />
        <label :for="`${id}_${option.value}`" :title="option.title">{{ option.label }}</label>
      </li>
    </ul>
  </fieldset>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
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
    readonly: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
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
  methods: {
    isChecked(option) {
      if (Array.isArray(this.value)) {
        return this.value.indexOf(option.value.toString()) > -1;
      }
      return option.value === this.value;
    },
    emitValueChange(event) {
      const eventVal = event.target.value;
      const currentVal = this.value;

      // Checkbox group requires special logic to store as array of values instead of single selected value
      if (this.type === 'checkbox') {
        if (currentVal.indexOf(eventVal) > -1) {
          currentVal.splice(currentVal.indexOf(eventVal), 1);
        } else {
          currentVal.push(eventVal);
        }
        return this.$emit('change', currentVal);
      }
      return this.$emit('change', event);
    },
  },
};
</script>

<style lang="scss" scoped>
// override EPA fieldset styles
fieldset {
  position: static;
  background: inherit;
  border: inherit;
  margin: 0 0 0.5em 0;
  padding: 0;

  & + fieldset {
    margin-top: 0;
  }

  legend {
    // overwrite EPA template legend styles
    font-family: 'Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Roboto', 'Arial', sans-serif;
    font-size: 1em;
    position: static;
    background: none;
    border: none;
    text-indent: 0;
    text-shadow: none;
    color: inherit;
    line-height: 2;
  }
}

.checkbox-radio-list {
  padding: 0;
  list-style: none;
  margin-left: 0.25rem;

  li {
    display: inline-block;
  }

  label {
    font-weight: normal;

    &:not(last-child) {
      margin-right: 1em;
    }
  }
}

.checkbox-radio-group[readonly] {
  input:not(:checked) + label,
  input:checked + label::before {
    display: none;

    & li {
      display: none;
    }
  }

  // Match vue-select styles to account for multiple selected checkboxes
  input:checked + label {
    cursor: text;
    background-color: #f8f8f8;
    border: 1px solid rgba(60, 60, 60, 0.26);
    border-radius: 4px;
    padding: 0 0.25em;
    color: #333;
  }
}
</style>
