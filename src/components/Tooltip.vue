<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createPopper } from '@popperjs/core';
import { Icon } from '@iconify/vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  placement: {
    type: String,
    default: 'top',
  },
  tooltipOnly: {
    type: Boolean,
    default: false,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: 'info-circle',
  },
  delay: {
    type: Number,
    default: 300,
  },
});
const emit = defineEmits(['onClickIcon']);

const popperInstance = ref();
const hoverEl = ref();
const tooltip = ref(null);

const show = () => {
  // Make the tooltip visible
  tooltip.value?.setAttribute('data-show', '');

  // Enable the event listeners
  popperInstance.value.setOptions((options) => ({
    ...options,
    modifiers: [...options.modifiers, { name: 'eventListeners', enabled: true }],
  }));

  // Update its position
  popperInstance.value.update();
};

const hide = () => {
  // Hide the tooltip
  tooltip.value?.removeAttribute('data-show');

  // Disable the event listeners
  popperInstance.value.setOptions((options) => ({
    ...options,
    modifiers: [...options.modifiers, { name: 'eventListeners', enabled: false }],
  }));
};

onMounted(() => {
  hoverEl.value = document.getElementById(props.id);
  popperInstance.value = createPopper(hoverEl.value, tooltip.value, {
    placement: props.placement,
    strategy: 'fixed',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  showEvents.forEach((event) => {
    hoverEl.value?.addEventListener(event, () => setTimeout(show, props.delay));
  });

  hideEvents.forEach((event) => {
    // Important: add 1 ms to delay to prevent tooltip staying open if user mouses over very quickly
    hoverEl.value?.addEventListener(event, () => setTimeout(hide, props.delay + 1));
  });
});
onBeforeUnmount(() => {
  popperInstance.value.destroy();
  if (hoverEl.value) {
    hoverEl.value.removeEventListener('mouseenter', show);
    hoverEl.value.removeEventListener('mouseleave', hide);
    hoverEl.value.removeEventListener('focus', show);
    hoverEl.value.removeEventListener('blur', hide);
  }
});
</script>

<template>
  <span class="hsrp-tooltip-container">
    <component
      v-if="iconOnly || !tooltipOnly"
      :is="iconOnly ? 'span' : 'abbr'"
      :class="iconOnly ? '' : 'hsrp-tooltip-label'"
      :id="id"
      :aria-label="description"
      tabindex="0"
      @click="emit('onClickIcon')"
      @keyup.enter="emit('onClickIcon')"
    >
      <Icon v-if="iconOnly" class="tooltip-icon" :icon="icon.includes(':') ? icon : `fa-solid:${icon}`" />
      <span v-else>{{ label }}</span>
    </component>
    <div ref="tooltip" class="hsrp-tooltip" role="tooltip">
      {{ description }}
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  </span>
</template>

<style lang="scss" scoped>
@import '../styles/variables';

.hsrp-tooltip-label {
  text-decoration: none;
  border-bottom: 1px dashed color('base-darker');
}

// Popper.js styles
.hsrp-tooltip {
  background: #000;
  color: #fff;
  max-width: 300px;
  text-align: center;
  padding: 5px 10px;
  font-size: size('body', '2xs');
  font-weight: normal;
  border-radius: 4px;
  display: none;
  z-index: 999;
  opacity: 0.9;
  // Improtant override of uswds default
  transition-duration: 0ms;
}
.hsrp-tooltip[data-show] {
  display: block;
}
.tooltip-icon {
  cursor: pointer;
  color: color('primary');
  font-size: size('body', 'xs');
}
.tooltip-arrow,
.tooltip-arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
}
.tooltip-arrow {
  visibility: hidden;
  transition-duration: 0ms;
}
.tooltip-arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg);
}
.hsrp-tooltip[data-popper-placement^='top'] > .tooltip-arrow {
  bottom: -4px;
}
.hsrp-tooltip[data-popper-placement^='bottom'] > .tooltip-arrow {
  top: -4px;
}
.hsrp-tooltip[data-popper-placement^='left'] > .tooltip-arrow {
  right: -4px;
}
.hsrp-tooltip[data-popper-placement^='right'] > .tooltip-arrow {
  left: -4px;
}
</style>
