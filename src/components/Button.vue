<template>
  <button :class="`usa-button usa-button--${btnStyle}`" :type="type" :title="title" @click="$emit('click')">
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
    btnStyle: String,
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.usa-button {
  margin: 0;
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
}
</style>
