<template>
  <div :class="`usa-alert usa-alert--${type} ${validation ? 'usa-alert--validation' : ''}`" role="alert" tabindex="0">
    <div class="usa-alert__body">
      <h3 v-if="header" class="usa-alert__heading">{{ header }}</h3>
      <p v-if="text" class="usa-alert__text">{{ text }}</p>
      <div v-if="$slots.default" class="usa-alert__text">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'info',
    },
    text: {
      type: String,
      required: false,
    },
    header: {
      type: String,
      required: false,
    },
    validation: {
      type: Boolean,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.usa-alert {
  margin: 1rem 0;
  font-size: 1rem;

  ul {
    padding-left: 1.5rem;
    padding-bottom: 0.5rem;
  }

  p {
    margin-bottom: 0.5rem;
    padding-top: 0.25rem;
    padding-bottom: 0;
  }
}
</style>
