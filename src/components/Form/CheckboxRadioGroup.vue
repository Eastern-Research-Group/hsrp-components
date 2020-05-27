<template>
  <fieldset class="checkbox-radio-group">
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
          :disabled="option.disabled"
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
