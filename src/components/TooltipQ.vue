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
import Tooltip from './Tooltip.vue';

export default {
  name: 'TooltipQ',
  props: {
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  components: { Tooltip },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

:deep() .iconify {
  cursor: pointer;
  color: color('primary-light');
}
</style>
