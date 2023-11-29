<template>
  <div class="usa-form-group">
    <label :for="id" :class="`usa-label ${!label && srOnlyLabel ? 'sr-only' : ''}`">
      <span v-if="srOnlyLabel" class="sr-only">{{ srOnlyLabel }}</span>
      {{ label }}
      <Tooltip v-if="tooltip" :id="`textTooltip${id}`" :iconOnly="true" :description="tooltip" />
      <TooltipQ
        v-if="tooltipq"
        :id="`textTooltip${id}`"
        :iconOnly="true"
        :description="tooltipq"
        @clickedQ="showDetailTooltip"
      />
      <slot name="label"></slot>
    </label>
    <textarea
      v-if="isTextArea"
      :class="`usa-textarea ${errorMessage ? 'usa-input--error' : ''}`"
      :id="id"
      v-bind="{ ...$props, ...$attrs }"
      ref="textarea"
      @input="updateValue"
    />
    <input
      v-else
      :class="`usa-input ${errorMessage ? 'usa-input--error' : ''}`"
      :name="id"
      v-bind="{ ...$props, ...$attrs }"
      @input="updateValue"
    />
    <span v-if="errorMessage" class="usa-error-message">{{ errorMessage }}</span>
  </div>
</template>

<script>
import Tooltip from '../Tooltip.vue';
import TooltipQ from '../TooltipQ.vue'; // question mark tooltip

export default {
  name: 'TextInputUs',
  components: { Tooltip, TooltipQ },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    srOnlyLabel: {
      type: String,
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: [String, Number],
    },
    required: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
    placeholder: {
      type: String,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
    },
    step: {
      type: String,
      default: 'any',
    },
    isTextArea: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: String,
    },
    tooltipq: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
  },
  methods: {
    updateValue(event) {
      this.$emit('input', event.target.value);
    },
    showDetailTooltip() {
      this.$emit('displaydetailtooltip');
    },
  },
  mounted() {
    // If readonly is set, set textarea to height of content so user doesn't have to resize
    if (this.isTextArea && this.readonly) {
      this.$refs.textarea.style.height = '0';
      this.$refs.textarea.style.height = `${this.$refs.textarea.scrollHeight}px`;
      this.$refs.textarea.style.resize = 'none';
    }
  },
};
</script>

<style lang="scss" scoped>
.usa-label {
  margin-top: 1.25rem;
}

.usa-input[readonly] {
  height: 1.25rem;
}

.usa-textarea[readonly] {
  height: 2.5rem;
}

.usa-textarea[readonly],
.usa-input[readonly] {
  padding: 0;
  color: #222;
  border: none;
  background: none;
}

.usa-input--error {
  border-width: 3px;
  border-style: dashed;
}
</style>
