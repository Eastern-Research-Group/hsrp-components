<template>
  <div class="table-container">
    <div class="grid-row">
      <TextInput
        v-if="shouldDisplayFilter"
        class="table-filter margin-left-auto margin-bottom-1"
        id="filter"
        label="Search"
        @input="shouldVirtualScroll ? filterTable($event) : setFilter($event)"
      />
    </div>

    <VirtualScroller
      v-if="shouldVirtualScroll"
      class="v-scroll-container"
      :items="isServerSide ? rowProvider : filteredRows"
      :item-height="columns.length < 8 ? 60 : 100"
      :style="{ maxHeight: height }"
    >
      <template slot-scope="{ items }">
        <BTable
          v-bind="tableProps"
          ref="tableRef"
          :items="items"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @sort-changed="sortTable"
        >
          <!-- Pass on all named slots -->
          <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />

          <!-- Pass on all scoped slots -->
          <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
            <slot :name="slot" v-bind="scope" />
          </template>

          <!-- Display loader when table is empty and in busy state -->
          <template slot="empty">
            <div v-if="isBusy" class="text-center">
              <Loader />
            </div>
            <div v-else class="text-center">
              {{ emptyText }}
            </div>
          </template>
        </BTable>
      </template>
    </VirtualScroller>
    <BTable
      v-else
      v-bind="tableProps"
      :items="isServerSide ? rowProvider : rows"
      :busy.sync="isBusy"
      :current-page.sync="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :api-url.sync="apiUrl"
      @sort-changed="changeSort"
      @filter="onFiltered"
    >
      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
        <slot :name="slot" v-bind="scope" />
      </template>

      <!-- Display loader when table is empty and in busy state -->
      <template slot="empty">
        <div v-if="isBusy" class="text-center">
          <Loader />
        </div>
        <div v-else class="text-center">
          {{ emptyText }}
        </div>
      </template>
    </BTable>

    <div v-if="perPage && totalRows > perPage">
      <BPagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" :limit="11" />
      <p class="pagination-text">
        Displaying {{ (currentPage - 1) * perPage + 1 }} through
        {{ currentPage * perPage > totalRows ? totalRows : currentPage * perPage }} of {{ totalRows }} records
      </p>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import orderBy from 'lodash/orderBy';
import some from 'lodash/some';
import toLower from 'lodash/toLower';
import { BTable, BPagination } from 'bootstrap-vue';
import VirtualScroller from './VirtualScroller.vue';
import Loader from '../Loader.vue';
import TextInput from '../Form/TextInput.vue';

export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
    },
    height: {
      type: String,
      default: '500px',
    },
    defaultSort: {
      type: String,
    },
    busy: {
      type: Boolean,
      default: false,
    },
    perPage: {
      type: Number,
    },
    shouldDisplayFilter: {
      type: Boolean,
      default: false,
    },
    shouldVirtualScroll: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
    },
    rowProvider: {
      type: Function,
    },
    apiUrl: {
      type: String,
    },
    total: {
      type: Number,
    },
  },
  components: { BTable, BPagination, Loader, TextInput, VirtualScroller },
  data() {
    return {
      sortBy: this.defaultSort || '',
      sortDesc: false,
      tableColumns: [],
      filter: '',
      currentPage: 1,
      totalRows: 0,
      filteredRows: [],
      isBusy: this.busy,
    };
  },
  computed: {
    tableProps() {
      return {
        fields: this.tableColumns,
        'sticky-header': this.shouldVirtualScroll ? false : this.height,
        busy: this.busy,
        'current-page': this.currentPage,
        'per-page': this.perPage,
        filter: this.filter,
        striped: true,
        responsive: !this.shouldVirtualScroll,
        'empty-text': this.emptyText,
        'show-empty': !!this.emptyText,
        'no-sort-reset': true,
      };
    },
    isServerSide() {
      return typeof this.rowProvider === 'function';
    },
  },
  watch: {
    columns() {
      this.buildTableColumns();
      if (this.shouldVirtualScroll) {
        this.calculateColumnWidths();
      }
    },
    rows() {
      if (this.rows) {
        this.currentPage = 1;
        this.filteredRows = cloneDeep(this.rows);
      }
      this.totalRows = this.isServerSide ? this.total : this.filteredRows.length;
    },
    total() {
      this.totalRows = this.total;
    },
    busy() {
      this.isBusy = this.busy;
    },
  },
  methods: {
    buildTableColumns() {
      this.tableColumns = this.columns.map((col) => {
        if (typeof col === 'string') {
          return {
            key: col,
            label: col,
            tdClass: 'text-center',
            sortable: true,
          };
        }
        return {
          key: col.key,
          label: col.label || col.key,
          tdClass: col.tdClass || 'text-center',
          sortable: col.sortable !== undefined ? col.sortable : true,
          headerTitle: col.headerTitle,
          thAttr: { id: `tooltip-${col.key}` },
        };
      });
    },
    /* eslint-disable func-names */
    setFilter: debounce(function(e) {
      this.filter = e.target.value;
    }, 500),
    filterTable: debounce(function(e) {
      // need to re-clone the object for when the user deletes filter term
      let filterData = cloneDeep(this.rows);
      // only filter if value is not blank
      if (e.target.value !== '') {
        filterData = filterData.filter((o) => some(o, (v) => toLower(v).indexOf(toLower(e.target.value)) > -1));
      }
      // set filteredRows to the filtered set
      this.filteredRows = filterData;

      // if table is currently sorted, maintain existing sort order
      if (this.sortBy !== '') {
        this.sortTable({ sortBy: this.sortBy, sortDesc: this.sortDesc });
      }
    }, 500),
    /* eslint-enable func-names */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    // Set currentPage to 1 when sorting
    changeSort() {
      this.currentPage = 1;
    },
    sortTable(ctx) {
      this.filteredRows = orderBy(this.filteredRows, [ctx.sortBy], [ctx.sortDesc ? 'desc' : 'asc']);
    },
    calculateColumnWidths() {
      // Reset layout and width to let table auto-render first
      this.$refs.tableRef.$el.style.tableLayout = 'auto';
      this.$refs.tableRef.$el.style.width = '100%';

      // Wait for initial table to render using setTimeout, then set specific widths for each column
      // Otherwise, column widths can quickly jump around while scrolling leading to less than ideal user experience
      setTimeout(() => {
        const headerEls = this.$refs.tableRef.$el.querySelectorAll('thead th');
        const tableWidth = this.$refs.tableRef.$el.offsetWidth;
        for (let i = 0; i < headerEls.length; i += 1) {
          const headerWidth = headerEls[i].offsetWidth;
          headerEls[i].style.width = `${(headerWidth / tableWidth) * 100}%`;
        }
        // Need to hard-code the full width of the table to still allow horizontal scrolling instead of squishing everything
        this.$refs.tableRef.$el.style.width = `${tableWidth}px`;
        // Need to set layout to fixed after hard-coding the widths, otherwise all cols will be equal width
        this.$refs.tableRef.$el.style.tableLayout = 'fixed';
      }, 50);
    },
  },
  mounted() {
    this.filteredRows = cloneDeep(this.rows);
    this.totalRows = this.isServerSide ? this.total : this.rows.length;
    this.buildTableColumns();

    if (this.shouldVirtualScroll) {
      this.calculateColumnWidths();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.table-container {
  ::v-deep {
    .b-table-sticky-header {
      overflow: auto;

      .b-table th {
        position: sticky;
        position: -webkit-sticky;
        z-index: 99;
        top: -1px;
      }
    }

    .b-table {
      width: 100%;
      font-size: size('sans', '2xs');
      border-collapse: separate;
      border-spacing: 0;

      td,
      thead th {
        border: none;
        padding: 0.6rem;
        vertical-align: middle;
        line-height: 1.25;
      }

      thead th {
        text-align: center;
        background-color: #f1f1f1 !important;
        border-right: 1px solid #fff;
        border-bottom: 1px solid #ddd;

        &[tabindex='0']:focus {
          outline-offset: -2px;
        }

        &[aria-sort] {
          cursor: pointer;
          padding-right: calc(0.75rem + 0.65em);
          background-position: right 0.375rem center;
          background-repeat: no-repeat;
          background-size: 0.65em 1em;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='101' height='101' preserveAspectRatio='none'><path opacity='.3' d='M51 1l25 23 24 22H1l25-22zm0 100l25-23 24-22H1l25 22z'/></svg>");
        }

        &[aria-sort='ascending'] {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='101' height='101' preserveAspectRatio='none'><path d='M51 1l25 23 24 22H1l25-22z'/><path opacity='.3' d='M51 101l25-23 24-22H1l25 22z'/></svg>");
        }

        &[aria-sort='descending'] {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='101' height='101' preserveAspectRatio='none'><path opacity='.3' d='M51 1l25 23 24 22H1l25-22z'/><path d='M51 101l25-23 24-22H1l25 22z'/></svg>");
        }
      }

      &.table-striped tbody tr:nth-of-type(even) {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &[aria-busy='true'] {
        opacity: 0.6;
      }
    }

    .b-pagination {
      margin-top: 1rem;
      display: inline-flex;
      padding-left: 0;
      list-style: none;
      border-radius: 0.25rem;

      .flex-fill {
        flex: 1 1 auto;
      }

      .page-item.disabled .page-link {
        color: #6c757d;
        pointer-events: none;
        cursor: auto;
        background-color: #fff;
        border-color: #dee2e6;
      }

      .page-item:first-child .page-link {
        margin-left: 0;
        border-top-left-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
      }

      .page-item.active .page-link {
        z-index: 3;
        color: #fff;
        background-color: #005ea2;
        border-color: #005ea2;
      }

      .page-link {
        position: relative;
        display: block;
        padding: 0.5rem 0.75rem;
        margin-left: -1px;
        line-height: 1.25;
        color: #005ea2;
        background-color: #fff;
        border: 1px solid #dee2e6;
        border-radius: 0;
      }

      .page-link {
        max-width: inherit;
      }
    }
  }

  .v-scroll-container {
    width: 100%;
    overflow: auto;
    overflow-anchor: none;

    ::v-deep th {
      position: sticky;
      position: -webkit-sticky;
      z-index: 99;
      top: -1px;
    }
  }

  .table-filter ::v-deep {
    .usa-label {
      margin-right: 0.5rem;
      display: inline-block;
    }

    .usa-input {
      display: inline-block;
      width: 200px;
      margin-top: 0;
    }
  }

  .pagination-text {
    display: inline-block;
    margin: auto auto auto 1rem;
    font-size: 0.93rem;
  }
}
</style>
