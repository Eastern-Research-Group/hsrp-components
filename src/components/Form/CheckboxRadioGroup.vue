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
          :checked="option.value === value"
          :disabled="option.disabled"
          @input="$emit('change', $event)"
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
};
</script>
