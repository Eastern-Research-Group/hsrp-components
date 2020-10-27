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
  </button>
</template>

<script>
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
      default: false,
    },
    btnStyle: {
      validator(value) {
        // prop value must match one of the following
        return ['unstyled', 'secondary', 'accent', 'base', 'success', 'outline', 'big'].indexOf(value) !== -1;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.usa-button {
  margin-bottom: 0;
  font-size: inherit;
  font-weight: bold;

  &--unstyled {
    text-decoration: none;
    margin: 0 0.25rem;
    padding: 0.25rem;
    color: $blue;

    &.dark {
      color: $darkBlue;
    }

    &.is-active {
      color: $green;
    }
  }

  &--success {
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
}
</style>
