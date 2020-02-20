<template>
  <div>
    <Button label="Show Modal" @click="showModal = true" />
    <Modal v-if="showModal" header="Modal Demo" :closeFnc="() => (showModal = false)">
      <p>This is a modal with some text and an input.</p>
      <TextInput id="text" label="Text Input" />
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
    };
  },
};
</script>
