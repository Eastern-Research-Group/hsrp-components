<template>
  <span class="hsrp-tooltip">
    <abbr v-if="!tooltipOnly && !iconOnly" class="tooltip-label" :id="id" :title="description" tabindex="0">
      {{ label }}
    </abbr>
    <span v-else-if="iconOnly" class="fa fa-info-circle" :id="id" :title="description" tabindex="0"></span>
    <BTooltip :target="id" :triggers="triggers" :placement="placement" boundary="window">
      {{ description }}
    </BTooltip>
  </span>
</template>

<script>
import { BTooltip } from 'bootstrap-vue';

export default {
  props: {
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
  },
  components: { BTooltip },
};
</script>

<style scoped>
.tooltip-label {
  text-decoration: none;
  border-bottom: 1px dashed color('base-darker');
}

.fa-info-circle {
  cursor: pointer;
  color: $blue;
}
</style>

<style lang="scss">
.tooltip {
  position: absolute;
  z-index: 1070;
  display: block;
  margin: 0;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  text-align: start;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  word-break: normal;
  word-spacing: normal;
  white-space: normal;
  line-break: auto;
  font-size: 0.875rem;
  word-wrap: break-word;
  opacity: 0;
}

.tooltip.show {
  opacity: 0.9;
}

.tooltip .arrow {
  position: absolute;
  display: block;
  width: 0.8rem;
  height: 0.4rem;
}

.tooltip .arrow::before {
  position: absolute;
  content: '';
  border-color: transparent;
  border-style: solid;
}

.bs-tooltip-top,
.bs-tooltip-auto[x-placement^='top'] {
  padding: 0.4rem 0;
}

.bs-tooltip-top .arrow,
.bs-tooltip-auto[x-placement^='top'] .arrow {
  bottom: 0;
}

.bs-tooltip-top .arrow::before,
.bs-tooltip-auto[x-placement^='top'] .arrow::before {
  top: 0;
  border-width: 0.4rem 0.4rem 0;
  border-top-color: #000;
}

.bs-tooltip-right,
.bs-tooltip-auto[x-placement^='right'] {
  padding: 0 0.4rem;
}

.bs-tooltip-right .arrow,
.bs-tooltip-auto[x-placement^='right'] .arrow {
  left: 0;
  width: 0.4rem;
  height: 0.8rem;
}

.bs-tooltip-right .arrow::before,
.bs-tooltip-auto[x-placement^='right'] .arrow::before {
  right: 0;
  border-width: 0.4rem 0.4rem 0.4rem 0;
  border-right-color: #000;
}

.bs-tooltip-bottom,
.bs-tooltip-auto[x-placement^='bottom'] {
  padding: 0.4rem 0;
}

.bs-tooltip-bottom .arrow,
.bs-tooltip-auto[x-placement^='bottom'] .arrow {
  top: 0;
}

.bs-tooltip-bottom .arrow::before,
.bs-tooltip-auto[x-placement^='bottom'] .arrow::before {
  bottom: 0;
  border-width: 0 0.4rem 0.4rem;
  border-bottom-color: #000;
}

.bs-tooltip-left,
.bs-tooltip-auto[x-placement^='left'] {
  padding: 0 0.4rem;
}

.bs-tooltip-left .arrow,
.bs-tooltip-auto[x-placement^='left'] .arrow {
  right: 0;
  width: 0.4rem;
  height: 0.8rem;
}

.bs-tooltip-left .arrow::before,
.bs-tooltip-auto[x-placement^='left'] .arrow::before {
  left: 0;
  border-width: 0.4rem 0 0.4rem 0.4rem;
  border-left-color: #000;
}

.tooltip-inner {
  max-width: 200px;
  padding: 0.25rem 0.5rem;
  color: #fff;
  text-align: center;
  background-color: #000;
  border-radius: 0.25rem;
}

.tooltip.b-tooltip {
  display: block;
  opacity: 0.9;
  outline: 0;
}

.tooltip.b-tooltip.fade:not(.show) {
  opacity: 0;
}

.tooltip.b-tooltip.show {
  opacity: 0.9;
}

.tooltip.b-tooltip.noninteractive {
  pointer-events: none;
}

.tooltip.b-tooltip .arrow {
  margin: 0 0.25rem;
}

.tooltip.b-tooltip.bs-tooltip-right .arrow,
.tooltip.b-tooltip.bs-tooltip-left .arrow {
  margin: 0.25rem 0;
}
</style>
