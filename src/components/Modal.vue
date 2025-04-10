<template>
  <div
    class="modal-container"
    @keyup.esc="typeof closeFnc === 'function' ? closeFnc() : () => {}"
    @click="typeof closeFnc === 'function' ? closeFnc() : () => {}"
  >
    <div class="modal" :style="customStyle" @click.stop role="dialog">
      <div class="modal-header">
        <span>{{ header }}</span>
        <Button v-if="closeFnc" class="close-btn" btnStyle="unstyled" icon="times" @click="closeFnc">
          <span class="usa-sr-only">Close</span>
        </Button>
      </div>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button.vue';

export default {
  props: {
    header: {
      type: String,
    },
    closeFnc: {
      type: Function,
    },
    customStyle: {
      type: Object,
    },
  },
  components: { Button },
  data() {
    return {
      focusableEls: [],
    };
  },
  methods: {
    // Implement "focus trap" - force focus to remain inside modal to ensure accessibility
    handleFocus(e) {
      // Close modal on Escape keypress
      if (e.key === 'Escape' && typeof this.closeFnc === 'function') {
        this.closeFnc();
      }

      if (
        (e.target === this.focusableEls[this.focusableEls.length - 1] && e.key === 'Tab' && !e.shiftKey) ||
        (e.key === 'Tab' && this.focusableEls.indexOf(e.target) === -1)
      ) {
        e.preventDefault();
        this.focusableEls[0].focus();
      } else if (e.target === this.focusableEls[0] && e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        this.focusableEls[this.focusableEls.length - 1].focus();
      }
    },
  },
  mounted() {
    // Get focusable elements within modal content, then push the modal close button to the end
    this.focusableEls = Array.from(
      document.querySelector('.modal-content').querySelectorAll('input, button, select, textarea, [href]')
    );
    if (this.closeFnc) {
      this.focusableEls.push(document.querySelector('.close-btn'));
    }

    // Set custom tab indices so that the close button is focused last, after modal content inputs
    this.focusableEls.forEach((el, index) => {
      el.tabIndex = index + 1; // eslint-disable-line no-param-reassign
    });

    // Add event listener for accessible focus
    document.addEventListener('keydown', this.handleFocus);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleFocus);
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.modal-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  border: 4px solid $darkBlue;
  border-radius: 3px;
  max-width: 90%;
  overflow: auto;

  &:focus {
    outline: none;
  }
}

.modal-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: $darkBlue;
  color: #fff;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 18px;
}

.modal-content {
  padding: 1rem;
  overflow: auto;
  max-height: calc(95vh - 4rem);
}

.close-btn {
  color: #fff;
  margin: 0 0 0 0.75rem;
  padding: 0;
}
</style>
