<template>
  <div @scroll.prevent="handleScroll">
    <div
      :style="{
        opacity: 0,
        clear: 'both',
        height: topHeight + 'px',
      }"
    ></div>
    <slot :items="visibleItems"></slot>
    <div
      :style="{
        opacity: 0,
        clear: 'both',
        height: bottomHeight + 'px',
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'VirtualScroll',
  props: {
    items: Array,
    itemHeight: {
      type: Number,
      default: 100,
    },
  },
  watch: {
    items() {
      this.$el.scrollTop = 0;
      this.handleScroll();
    },
  },
  data() {
    return {
      topHeight: 0,
      bottomHeight: 0,
      visibleItems: [],
    };
  },
  mounted() {
    // wait 5ms to make sure scroll is properly set up
    setTimeout(this.handleScroll, 5);
  },
  methods: {
    handleScroll() {
      const visibleItemsCount = Math.ceil(this.$el.clientHeight / this.itemHeight);
      const totalScrollHeight = this.items.length * this.itemHeight;

      const { scrollTop } = this.$el;
      const offset = 5;
      const firstVisibleIndex = Math.floor(scrollTop / this.itemHeight);
      const lastVisibleIndex = firstVisibleIndex + visibleItemsCount;
      const firstCutIndex = Math.max(firstVisibleIndex - offset, 0);
      const lastCutIndex = lastVisibleIndex + offset;

      this.visibleItems = this.items.slice(firstCutIndex, lastCutIndex);

      this.topHeight = firstCutIndex * this.itemHeight;
      this.bottomHeight = totalScrollHeight - this.visibleItems.length * this.itemHeight - this.topHeight;
    },
  },
};
</script>
