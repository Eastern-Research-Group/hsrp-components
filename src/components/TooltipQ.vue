<template>
  <Tooltip
    :id="id"
    :description="description"
    icon="question-circle"
    :iconOnly="true"
    @onClickIcon="$emit('clickedQ', description)"
  />
</template>

<script>
import { Tooltip } from 'hsrp-components';

export default {
  name: 'TooltipQ',
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
  components: { Tooltip },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.tooltip-label {
  text-decoration: none;
  border-bottom: 1px dashed color('base-darker');
}

::v-deep .fa-question-circle {
  cursor: pointer;
  color: color('primary-light');
}
</style>
