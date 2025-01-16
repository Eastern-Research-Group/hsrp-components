<template>
  <component :is="isHyperlink ? 'router-link' : 'div'" :to="hyperlinkPath" class="card-container">
    <div :class="`header-container ${icon ? '' : 'no-icon'}`">
      <Icon v-if="icon" :icon="icon.includes(':') ? icon : `fa-solid:${icon}`" class="fas fa-2x" />
      <h3 class="card-header">{{ header }}</h3>
    </div>
    <div class="card-content">
      <slot />
    </div>
  </component>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
  props: {
    isHyperlink: Boolean,
    hyperlinkPath: String,
    header: String.required,
    icon: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.card-container {
  text-decoration: none;
  color: #1b1b1b;
  display: flex;
  flex-direction: column;
  height: 100%;
  @include u-shadow(1);
  border-radius: 4px;
}

.header-container {
  background-color: color('blue-cool-5');
  padding: 1rem;
  text-align: center;

  .fas {
    color: color('cyan-30');
  }

  .fas.fa-2x {
    font-size: 1.75rem;
    margin-right: 0.5rem;
  }

  &.no-icon {
    padding: 0.5rem 1rem;
  }
}

.card-header {
  display: inline;
  font-size: size('body', 'xs');
  text-decoration-style: none;
  color: $blue;
  padding: 0;
  margin: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: size('body', '2xs');
  padding: 1rem;
}
</style>
