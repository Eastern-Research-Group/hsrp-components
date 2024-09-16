<template>
  <button
    :class="`usa-button usa-button--${btnStyle}`"
    :type="type"
    :title="title"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span v-if="icon" :class="`btn-icon fa fa-${icon} ${label ? 'margin-right-05' : ''}`"></span>
    {{ label }}
    <slot />
    <Loader v-if="isBusy" class="inline" />
  </button>
</template>

<script>
import Loader from './Loader.vue';

export default {
  name: 'Button',
  props: {
    icon: String,
    label: String,
    title: String,
    type: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: null,
    },
    btnStyle: {
      validator(value) {
        // prop value must match one of the following
        return (
          ['', 'default', 'unstyled', 'secondary', 'accent-cool', 'base', 'success', 'outline', 'big'].indexOf(
            value
          ) !== -1
        );
      },
    },
    isBusy: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  components: { Loader },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.usa-button {
  font-size: inherit;
  font-weight: bold;

  &--unstyled {
    text-decoration: none;
    margin: 0 0.25rem;
    padding: 0.25rem;

    &.dark {
      color: $darkBlue;
    }

    &.is-active {
      color: $green;
    }
  }

  &--success:not([disabled]) {
    background-color: $bgGreen;

    &:hover {
      background-color: darken($bgGreen, 5);
    }
  }

  &--big {
    font-size: 1.33rem;
  }

  &:disabled {
    cursor: default;
    pointer-events: auto; // allows for "title" tooltip to display on disabled buttons
  }

  .btn-icon {
    margin-right: 0.2rem;
  }

  &:not([disabled]):focus,
  &:not([disabled]).usa-focus {
    outline-offset: 2px;
  }
}
</style>
