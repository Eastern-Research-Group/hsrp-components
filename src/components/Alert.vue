<template>
  <div
    v-show="!dismissed"
    :class="
      `usa-alert usa-alert--${type} ${validation ? 'usa-alert--validation' : ''} ${slim ? 'usa-alert--slim' : ''}`
    "
    role="alert"
    tabindex="0"
  >
    <div class="usa-alert__body">
      <button
        v-if="dismissible"
        type="button"
        aria-label="Close"
        class="alert-close"
        title="Dismiss Alert"
        @click="dismissed = true"
      >
        ×
      </button>
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
    slim: {
      type: Boolean,
      required: false,
    },
    dismissible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dismissed: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.usa-alert {
  margin: 1rem 0;
  font-size: 1rem;
  background-position: 1.5rem;

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

.alert-close {
  padding: 0;
  background-color: transparent;
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;

  &:hover {
    opacity: 0.8;
  }
}
</style>
