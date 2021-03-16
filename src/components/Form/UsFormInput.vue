<template>
  <div :class="`usa-form-group ${errorMessage ? 'usa-form-group--error' : ''}`">
    <label :for="id" class="usa-label">
      {{ label }}
      <slot name="label"></slot>
    </label>
    <span v-if="errorMessage" class="usa-error-message">{{ errorMessage }}</span>
    <slot />
  </div>
</template>

<script>
export default {
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
    tooltip: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.usa-form-group {
  .usa-label,
  .usa-input,
  .usa-textarea,
  .usa-combo-box {
    max-width: unset;
  }

  .usa-combo-box__input,
  .usa-input,
  .usa-range,
  .usa-select {
    height: 2.25rem;
  }
}

// Vue-Select input styles
.v-select {
  padding: 0;

  ::placeholder {
    color: #999;
  }

  .vs__clear {
    margin-bottom: 0;
  }

  .vs__dropdown-toggle {
    height: 2.25rem;
    border-radius: 0;
    border-color: #565c65;
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
