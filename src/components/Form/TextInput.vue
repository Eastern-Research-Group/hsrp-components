<template>
  <div class="input-container">
    <label class="label" :for="id">
      <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
      {{ label }}
      <slot />
    </label>
    <VueSelect
      v-if="type === 'vue-select'"
      class="input"
      v-bind="{ ...inputProps, ...vueSelectProps, options: vueSelectOptions }"
      :selectable="(option) => !option.group"
      @input="$emit('input', $event)"
    >
      <template #search="{attributes, events}">
        <input
          class="vs__search"
          :required="required && (!value || (value && value.length === 0))"
          v-bind="attributes"
          v-on="events"
        />
      </template>
      <template #option="option">
        <div v-if="option.group" class="option-group">
          {{ option.group }}
        </div>
        {{ option[vueSelectProps.label || inputProps.label || 'label'] }}
      </template>
      <span slot="no-options" class="no-options-msg">{{ vueSelectProps.noOptionsMsg || 'No matching options.' }}</span>
    </VueSelect>
    <textarea
      v-else-if="type === 'textarea'"
      class="input"
      v-bind="inputProps"
      @input="$emit('input', $event)"
    ></textarea>
    <input v-else class="input" v-bind="inputProps" @input="$emit('input', $event)" />
  </div>
</template>

<script>
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Array, Object],
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
      default: 'text',
    },
    required: {
      type: Boolean,
    },
    placeholder: {
      type: String,
    },
    min: {
      type: Number,
      default: 0,
    },
    step: {
      type: String,
      default: '1',
    },
    disabled: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
    vueSelectProps: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { VueSelect },
  computed: {
    inputProps() {
      return {
        id: this.id,
        value: this.value,
        label: this.label,
        srOnlyLabel: this.srOnlyLabel,
        type: this.type,
        placeholder: this.placeholder,
        required: this.required,
        min: this.min,
        step: this.step,
        disabled: this.disabled || (this.type === 'vue-select' && this.readonly),
        readonly: this.readonly,
      };
    },
    // Logic to allow for header groups within options list
    // "group" must be added to all options passed to this component, and must be pre-sorted in order by group
    vueSelectOptions() {
      // No need to run if input is not vue-select
      if (this.type !== 'vue-select' || !this.vueSelectProps.options) return [];

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
};
</script>
<style lang="scss" scoped>
.input {
  padding: 0.25rem;

  &[readonly] {
    color: #222;
    border: none;
    background: none;
  }
}

// Vue-Select input styles
::v-deep .v-select {
  padding: 0;

  ::placeholder {
    color: #999;
  }

  .vs__clear {
    margin-bottom: 0;
  }

  .vs__dropdown-toggle {
    border-radius: 0;
    border-color: rgb(169, 169, 169);
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
    max-width: calc(100% - 14px);

    & + .vs__search {
      width: 0;
    }
  }

  .vs__selected {
    margin: 2px 2px 2px;
  }

  .option-group {
    font-weight: bold;
    color: #222;
    margin-left: -0.5rem;
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
