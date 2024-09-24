<template>
  <div :class="`usa-form-group ${errorMessage ? 'usa-form-group--error' : ''}`">
    <label :for="id" :class="`usa-label ${!label && srOnlyLabel ? 'sr-only' : ''}`">
      <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
      {{ label }}
      <slot name="label"></slot>
      <Tooltip v-if="tooltip" :id="`textTooltip${id}`" :iconOnly="true" :description="tooltip" />
    </label>
    <span v-if="errorMessage" class="usa-error-message">{{ errorMessage }}</span>
    <VueSelect
      v-bind="{ ...inputProps, ...vueSelectProps, inputId: id, options: vueSelectOptions }"
      class="input"
      :selectable="(option) => (areGroupsSelectable ? true : !option.group)"
      @update:modelValue="updateValue"
      @input="$emit('search', $event)"
    >
      <template #search="{ attributes, events }">
        <input
          v-bind="attributes"
          class="vs__search"
          :required="
            required && (!inputProps.modelValue || (inputProps.modelValue && inputProps.modelValue.length === 0))
          "
          v-on="events"
        />
      </template>
      <template #option="option">
        <span v-if="option.group" class="option-group">
          {{ option.group }}
        </span>
        {{ option[vueSelectProps.label || inputProps.label || 'label'] }}
        {{ option.append }}
      </template>
      <template #selected-option="value">
        <slot name="selected-option" :value="value" />
      </template>
      <template #no-options>
        <span slot="no-options" class="no-options-msg">{{
          vueSelectProps.noOptionsMsg || 'No matching options.'
        }}</span>
      </template>
    </VueSelect>
  </div>
</template>

<script>
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import Tooltip from '../Tooltip.vue';

export default {
  name: 'VueSelectInput',
  components: { Tooltip, VueSelect },
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
    value: {
      type: [String, Number, Array, Object],
    },
    modelValue: {
      type: [String, Number, Array, Object],
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
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    step: {
      type: Number,
    },
    tooltip: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    vueSelectProps: {
      type: Object,
      default: () => ({}),
    },
    areGroupsSelectable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    inputProps() {
      return {
        modelValue: this.modelValue ?? this.value,
        label: this.label,
        srOnlyLabel: this.srOnlyLabel,
        placeholder: this.placeholder,
        required: this.required,
        min: this.min,
        step: this.step,
        disabled: this.disabled || this.readonly,
        readonly: this.readonly,
      };
    },
    // Logic to allow for header groups within options list
    // "group" must be added to all options passed to this component, and must be pre-sorted in order by group
    vueSelectOptions() {
      // No need to run if no options are passed
      if (!this.vueSelectProps.options) return [];

      const labelProp = this.vueSelectProps.label || 'label';
      if (this.vueSelectProps.options.filter((option) => !!option.group).length > 0) {
        let currentGroup = this.vueSelectProps.options[0].group;
        const options = [{ group: currentGroup, [labelProp]: null }];
        this.vueSelectProps.options.forEach((option) => {
          if (option.group !== currentGroup) {
            options.push({ group: option.group, [labelProp]: null });
            currentGroup = option.group;
          }
          options.push({ ...option, group: null });
        });
        return options;
      }
      return this.vueSelectProps.options;
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
      this.$emit('update:modelValue', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.usa-label {
  margin-top: 1.25rem;
}

// Vue-Select input styles
:deep() .v-select {
  padding: 0;

  ::placeholder {
    color: #999;
  }

  .vs__clear {
    margin-bottom: 0;
  }

  .vs__dropdown-toggle {
    height: auto;
    min-height: 2.25rem;
    border-radius: 0;
    border-color: #565c65;
    margin-top: 0.25rem;
    margin-bottom: 0.5em;
    padding: 0;
  }

  .vs__deselect {
    margin: 0 0.2rem 0 0.4rem;
  }

  .vs__search {
    width: inherit;
    padding: 0 5px;
    margin: 0;

    &:focus {
      margin: 0;
    }
  }

  &.vs--single .vs__selected {
    max-width: calc(100% - 15px);

    & + .vs__search {
      width: 0;
    }
  }

  .vs__selected {
    margin: 2px 2px 2px;
  }

  .option-group {
    font-weight: bold;
    margin-left: -0.5rem;
  }

  .vs__dropdown-option--disabled {
    color: #222;
  }

  &[readonly] .vs__dropdown-toggle {
    border: none;
    background: none;

    .vs__selected,
    .vs__selected:hover {
      cursor: text;
    }

    input,
    .vs__actions,
    .vs__selected button {
      display: none;
    }
  }
}
</style>
