<template>
  <div class="input-container">
    <label class="label" :for="id">
      <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
      {{ label }}
    </label>
    <VueSelect
      v-if="type === 'vue-select'"
      class="input"
      v-bind="{ ...inputProps, ...vueSelectProps }"
      @input="$emit('input', $event)"
    >
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
    placeholder: {
      type: String,
    },
    min: {
      type: Number,
      default: 0,
    },
    disabled: {
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
        min: this.min,
        disabled: this.disabled,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.input {
  padding: 0.25rem;
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
}
</style>
