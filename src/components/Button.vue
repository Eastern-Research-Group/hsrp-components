<template>
  <button
    :id="uuid"
    :class="`usa-button usa-button--${btnStyle}`"
    :type="type"
    :title="title"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <Icon v-if="icon" class="btn-icon" :icon="icon.includes(':') ? icon : `fa-solid:${icon}`" />
    <span v-if="label || $slots.default" :class="`btn-label ${icon ? 'margin-left-05' : ''}`">
      {{ label }}
      <slot />
    </span>
    <Loader v-if="isBusy" class="inline" />
    <Tooltip v-if="tooltip" :id="uuid" :description="tooltip" :tooltip="true" :delay="100" />
  </button>
</template>

<script>
import { Icon } from '@iconify/vue';
import Loader from './Loader.vue';
import Tooltip from './Tooltip.vue';

let uuid = 0;

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
    tooltip: {
      type: String,
      default: null,
    },
  },
  emits: ['click'],
  components: { Icon, Loader, Tooltip },
  data() {
    return {
      uuid: uuid.toString(),
    };
  },
  beforeCreate() {
    this.uuid = uuid.toString();
    uuid += 1;
  },
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

  &:not([disabled]):focus,
  &:not([disabled]).usa-focus {
    outline-offset: 2px;
  }

  .btn-icon + .btn-label {
    vertical-align: middle;
  }
}
</style>
