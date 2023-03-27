<script setup>
import { computed } from 'vue';

const props = defineProps({
  total: Number.required,
  perPage: Number.required,
  currentPage: {
    type: Number,
    default: 1,
  },
});
defineEmits(['changePage']);

const totalPages = computed(() => {
  return Math.ceil(props.total / props.perPage);
});
const pagesArray = computed(() => {
  // Add 1 and shift so that pagesArray starts with 1 instead of 0
  const pages = Array.from(Array(totalPages.value + 1).keys());
  pages.shift();
  return pages;
});
const lastPage = computed(() => {
  return pagesArray.value[pagesArray.value.length - 1];
});

// Logic follows guidance from USWDS (https://designsystem.digital.gov/components/pagination/#using-the-pagination-component)
const pageSlots = computed(() => {
  if (totalPages.value <= 7) {
    return pagesArray.value;
  }
  if (props.currentPage < 5) {
    return [1, 2, 3, 4, 5, '', lastPage.value];
  }
  if (pagesArray.value.indexOf(props.currentPage) > pagesArray.value.length - 5) {
    return [1, '', ...pagesArray.value.slice(pagesArray.value.length - 5)];
  }
  return [1, '', props.currentPage - 1, props.currentPage, props.currentPage + 1, '', lastPage.value];
});
</script>

<template>
  <div class="usa-pagination-container">
    <nav aria-label="Pagination" class="usa-pagination">
      <ul class="usa-pagination__list">
        <li class="usa-pagination__item usa-pagination__arrow">
          <a
            href="javascript:void(0);"
            class="usa-pagination__link usa-pagination__previous-page"
            aria-label="Previous page"
            :disabled="currentPage === 1"
            :tabindex="currentPage === 1 ? -1 : 0"
            @click="currentPage !== 1 && $emit('changePage', currentPage - 1)"
          >
            <span class="fa fa-chevron-left"></span>
            <span class="usa-pagination__link-text">Previous</span></a
          >
        </li>

        <template v-for="(pageNo, index) in pageSlots">
          <li v-if="pageNo !== ''" class="usa-pagination__item usa-pagination__page-no" :key="pageNo">
            <a
              href="javascript:void(0);"
              :class="`usa-pagination__button ${currentPage === pageNo ? 'usa-current' : ''}`"
              :aria-label="`Page ${pageNo}`"
              @click="$emit('changePage', pageNo)"
            >
              {{ pageNo }}
            </a>
          </li>
          <li v-else :key="`slot${index}`" class="usa-pagination__item usa-pagination__overflow" role="presentation">
            <span>…</span>
          </li>
        </template>
        <li class="usa-pagination__item usa-pagination__arrow">
          <a
            href="javascript:void(0);"
            class="usa-pagination__link usa-pagination__next-page"
            aria-label="Next page"
            :disabled="currentPage === lastPage"
            :tabindex="currentPage === lastPage ? -1 : 0"
            @click="currentPage !== lastPage && $emit('changePage', currentPage + 1)"
            ><span class="usa-pagination__link-text">Next </span> <span class="fa fa-chevron-right"></span
          ></a>
        </li>
      </ul>
    </nav>
    <p class="pagination-text">
      Displaying {{ (currentPage - 1) * perPage + 1 }} through
      {{ currentPage * perPage > total ? total : currentPage * perPage }} of {{ total }} records
    </p>
  </div>
</template>

<style scoped lang="scss">
.usa-pagination-container {
  display: flex;
  flex-wrap: wrap;
}

.usa-pagination {
  font-size: size('sans', '2xs');
  margin-right: 1rem;
}

.usa-pagination__list {
  padding-bottom: 0;
}

a.usa-pagination__link:hover {
  text-decoration: none;

  .usa-pagination__link-text {
    text-decoration: underline;
  }
}

.fa-chevron-left {
  margin-right: 0.5rem;
}

.fa-chevron-right {
  margin-left: 0.5rem;
}

.pagination-text {
  font-size: size('sans', '2xs');
  align-self: center;
  padding-bottom: 0;
}
</style>
