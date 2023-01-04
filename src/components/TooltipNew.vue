<script setup>
import { onMounted, ref } from 'vue';
import { createPopper } from '@popperjs/core';

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
  triggers: {
    type: String,
    default: 'hover focus',
  },
  delay: {
    type: Number,
    default: 300,
  },
});

const popperInstance = ref();
const hoverEl = ref();
const tooltip = ref(null);

const show = () => {
  // Make the tooltip visible
  tooltip.value.setAttribute('data-show', '');

  // Enable the event listeners
  popperInstance.value.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      { name: 'eventListeners', enabled: true },
      { name: 'preventOverflow', options: { rootBoundary: 'document' } },
    ],
  }));

  // Update its position
  popperInstance.value.update();
};

const hide = () => {
  // Hide the tooltip
  tooltip.value.removeAttribute('data-show');

  // Disable the event listeners
  popperInstance.value.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      { name: 'eventListeners', enabled: false },
    ],
  }));
};

onMounted(() => {
  hoverEl.value = document.getElementById(props.id);
  popperInstance.value = createPopper(hoverEl.value, tooltip.value, {
    placement: props.placement,
    // strategy: 'fixed',
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
    hoverEl.value.addEventListener(event, () => setTimeout(show, props.delay));
  });

  hideEvents.forEach((event) => {
    hoverEl.value.addEventListener(event, () => setTimeout(hide, props.delay / 2));
  });
});
</script>

<template>
  <div>
    <component
      v-if="iconOnly || !tooltipOnly"
      :is="iconOnly ? 'span' : 'abbr'"
      :class="iconOnly ? 'fa fa-info-circle' : 'tooltip-label'"
      :id="id"
      :title="description"
      tabindex="0"
    >
      {{ iconOnly ? '' : label }}
    </component>
    <div ref="tooltip" class="hsrp-tooltip" role="tooltip">
      {{ description }}
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/variables';

.hsrp-tooltip-label {
  text-decoration: none;
  border-bottom: 1px dashed color('base-darker');
}

.fa-info-circle {
  cursor: pointer;
  color: $blue;
}

// Popper.js styles
.hsrp-tooltip {
  background: #000;
  color: white;
  padding: 4px 8px;
  font-size: size('body', '2xs');
  font-weight: normal;
  border-radius: 4px;
  display: none;
  z-index: 999;
  opacity: 0.9;
}

.hsrp-tooltip[data-show] {
  display: block;
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
