<template>
  <div class="table-container">
    <div class="grid-row">
      <TextInput
        v-if="shouldDisplayFilter"
        class="table-filter margin-left-auto margin-bottom-1"
        id="filter"
        label="Search"
        :value="filter"
        @input="setFilter($event)"
      />
    </div>

    <BTable
      v-bind="tableProps"
      :items="isServerSide ? rowProvider : items"
      :busy.sync="isBusy"
      :current-page.sync="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :api-url.sync="apiUrl"
      :filter.sync="filter"
      :filter-debounce="500"
      @sort-changed="changeSort"
      :stacked="stacked"
    >
      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
        <slot :name="slot" v-bind="scope" />
      </template>

      <!-- Custom Filters row -->
      <template v-if="shouldFilter && filterableFields.length" #top-row="{ fields }">
        <td v-for="field in fields" :key="field.key">
          <TextInput
            v-if="filterableFields.map((f) => f.key).includes(field.key) && field.filterType === 'text'"
            :id="`filter_${field.key}`"
            class="field-filter"
            :srOnlyLabel="`Filter ${field.key}`"
            v-model="fieldFilters[field.key]"
            @change="$emit('onFieldFilter')"
          />
          <VueSelectInput
            v-else-if="filterableFields.map((f) => f.key).includes(field.key) && field.filterType === 'list'"
            :id="`filter_${field.key}`"
            class="field-filter"
            :srOnlyLabel="`Filter ${field.key}`"
            :vueSelectProps="{
              options: getFilterOptions(field),
              appendToBody: true,
            }"
            v-model="fieldFilters[field.key]"
            @change="$emit('onFieldFilter')"
          />
        </td>
      </template>

      <!-- Display drilldown for hidden columns on mobile -->
      <template :slot="`cell(showAdditional)`" slot-scope="row">
        <Button
          v-if="hiddenColumns.length"
          class="expand-row-button"
          btnStyle="unstyled"
          :icon="row.detailsShowing ? 'minus-circle' : 'plus-circle'"
          :title="row.detailsShowing ? 'Collapse' : 'Expand additional columns'"
          @click="row.toggleDetails"
        />
      </template>
      <template v-slot:row-details="row">
        <table class="expanded-fields">
          <thead class="display-none">
            <tr>
              <th v-for="field in hiddenColumns" :key="`th-${field.key}`" scope="col">
                {{ field.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in hiddenColumns" :key="field.key">
              <th class="text-right text-middle">{{ field.label }}</th>
              <td :class="`text-left ${field.tdClass}`">
                <!-- If slot is available for field, display slot content, otherwise display the value -->
                <slot v-if="$scopedSlots[`cell(${field.key})`]" :name="`cell(${field.key})`" v-bind="row" />
                <span v-else>
                  {{ row.item[field.key] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- Display loader when table is empty and in busy state -->
      <template slot="empty">
        <div class="margin-top-1 text-center" style="max-width: 60rem">
          <Loader v-if="isBusy" style="height: 410px" />
          <p v-else>{{ emptyText }}</p>
        </div>
      </template>
      <template slot="emptyfiltered">
        <div class="margin-top-1 text-center" style="max-width: 60rem; height: 410px">
          <Loader v-if="isBusy" />
          <p v-else>{{ emptyText }}</p>
        </div>
      </template>
    </BTable>

    <div v-if="perPage">
      <BPagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" :limit="11" />
      <p class="pagination-text">
        Displaying {{ (currentPage - 1) * perPage + 1 }} through
        {{ currentPage * perPage > totalRows ? totalRows : currentPage * perPage }} of {{ totalRows }} records
      </p>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';
import debounce from 'lodash.debounce';
import { BTable, BPagination } from 'bootstrap-vue';
import Loader from '../Loader.vue';
import TextInput from '../Form/TextInput.vue';
import VueSelectInput from '../Form/VueSelectInput.vue';

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
    rowHeight: {
      type: Number,
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
    emptyText: {
      type: String,
      default: 'No data to display.',
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
    tableFilter: {
      type: String,
    },
    breakpoint: {
      type: String,
    },
    fieldFilters: {
      type: Object,
      default: () => ({}),
    },
    shouldFilter: {
      type: Boolean,
    },
    stacked: {
      type: [Boolean, String],
    },
  },
  components: { BTable, BPagination, Loader, TextInput, VueSelectInput },
  data() {
    return {
      sortBy: this.defaultSort || '',
      sortDesc: false,
      tableColumns: [],
      pendingFilter: '',
      filter: this.tableFilter || '',
      currentPage: 1,
      totalRows: 0,
      filteredRows: [],
      isBusy: this.busy,
      windowWidth: window.innerWidth,
      breakpoints: {
        tablet: 640,
        'tablet-lg': 800,
        desktop: 1040,
        'desktop-lg': 1200,
      },
    };
  },
  computed: {
    tableProps() {
      return {
        fields: this.tableColumns,
        'sticky-header': this.height,
        busy: this.busy,
        'current-page': this.currentPage,
        'per-page': this.perPage,
        striped: true,
        responsive: true,
        'empty-text': this.emptyText,
        'show-empty': !!this.emptyText,
        'no-sort-reset': true,
      };
    },
    isServerSide() {
      return typeof this.rowProvider === 'function';
    },
    largestBreakpoint() {
      const breakpoints = this.tableColumns
        .filter((c) => c.hideOnBreakpoint)
        .map((c) => this.breakpoints[c.hideOnBreakpoint]);
      return Math.max(...breakpoints);
    },
    hiddenColumns() {
      return this.columns.filter(
        (c) => (c.hideOnBreakpoint && this.windowWidth < this.breakpoints[c.hideOnBreakpoint]) || c.hideByDefault
      );
    },
    filterableFields() {
      return this.columns.filter((col) => !!col.filterType);
    },
    items() {
      if (this.isServerSide) {
        return this.rows;
      }
      if (this.rows && this.rows.length > 0) {
        const filtered = this.rows.filter((item) => {
          return Object.keys(this.filter).every((key) =>
            String(item[key])
              .toLowerCase()
              .includes(this.filter[key] ? this.filter[key].toLowerCase() : '')
          );
        });
        return filtered.length > 0
          ? filtered
          : [
              Object.keys(this.rows[0]).reduce((obj, value) => {
                // eslint-disable-next-line
                obj[value] = '';
                return obj;
              }, {}),
            ];
      }
      return this.rows;
    },
  },
  watch: {
    columns() {
      this.buildTableColumns();
      if (this.filterableFields.length) {
        this.buildFilterValues();
      }
    },
    rows() {
      if (this.rows) {
        this.currentPage = 1;
        this.filteredRows = cloneDeep(this.rows);
      }
      this.totalRows = this.isServerSide ? this.total : this.filteredRows.length;
    },
    filteredRows() {
      if (this.filterableFields.length) {
        this.positionFilterRow();
      }
    },
    total() {
      this.totalRows = this.total;
    },
    busy() {
      this.isBusy = this.busy;
    },
    tableFilter() {
      this.currentPage = 1;
      this.filter = this.tableFilter;
    },
    // eslint-disable-next-line
    fieldFilters: debounce(function(value) {
      this.filter = value;
    }, 500),
  },
  methods: {
    buildTableColumns() {
      const columns = [];
      this.columns.forEach((col) => {
        if (typeof col === 'string') {
          columns.push({
            key: col,
            label: col,
            tdClass: 'text-center',
            sortable: true,
          });
        }
        if (!this.hiddenColumns.find((hidden) => hidden.key === col.key)) {
          columns.push({
            ...col,
            key: col.key,
            label: col.label || col.key,
            tdClass: `${col.tdClass || 'text-center'} ${this.getHiddenColClass(col)}`,
            thClass: `${col.thClass || ''} ${this.getHiddenColClass(col)}`,
            sortable: col.sortable !== undefined ? col.sortable : true,
            thAttr: col.thAttr, // { id: `tooltip-${col.key}` },
          });
        }
      });
      if (this.hiddenColumns.length) {
        columns.unshift({
          key: 'showAdditional',
          label: 'Show Additional Fields',
          thClass: 'show-additional',
          sortable: false,
        });
      }
      this.tableColumns = columns;
    },
    /* eslint-disable func-names */
    setFilter: debounce(function (value) {
      this.filter = value;
    }, 500),
    /* eslint-enable func-names */
    // Set currentPage to 1 when sorting
    changeSort() {
      this.currentPage = 1;
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    getHiddenColClass(col) {
      if (col.hideOnBreakpoint) {
        return `hide-${col.hideOnBreakpoint}`;
      }
      if (col.hideByDefault) {
        return 'display-none';
      }
      return '';
    },
    buildFilterValues() {
      const filters = {};
      this.filterableFields.forEach((field) => {
        filters[field.key] = '';
      });
    },
    positionFilterRow() {
      // Set timeout is required for header cell to be found
      setTimeout(() => {
        const head = document.querySelector('.b-table thead tr th');
        const filterCells = document.querySelectorAll('.b-table-top-row td');

        // Observe first header cell for height changes (due to Bootstrap-Vue's rendering), then set top value to make filter row sticky
        const observer = new ResizeObserver(() => {
          for (let i = 0; i < filterCells.length; i += 1) {
            filterCells[i].style.top = `${head.offsetHeight - 2}px`;
          }
        });

        if (head) observer.observe(head);
      }, 0);
    },
    getFilterOptions(field) {
      if (this.isServerSide) return field.filterOptions;
      const rawField = this.filterableFields.find((f) => f.key === field.key);
      let options = this.rows.map((row) => row[field.key]).filter((v, i, a) => a.indexOf(v) === i && !!v);
      // If options need to be sorted in specific way, check for "customFilterSort" prop in field object and sort accordingly
      if (rawField.customFilterSort) {
        options = rawField.customFilterSort.filter((val) => options.includes(val));
      }
      return options;
    },
  },
  mounted() {
    this.filteredRows = cloneDeep(this.rows);
    this.totalRows = this.isServerSide ? this.total : this.rows.length;
    this.buildTableColumns();
    if (this.filterableFields.length) {
      this.buildFilterValues();
      this.positionFilterRow();
    }

    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
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

    .filter-table th {
      border-bottom: none !important;
    }

    .b-pagination {
      max-width: 100%;
      overflow-x: auto;
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

    // Responsive styles for hiding columns and expanding below the row
    .expand-row-button {
      margin: 0;
      padding: 0;

      .btn-icon {
        margin-right: 0;
      }

      &:focus {
        outline-offset: -2px;
      }
    }

    // Breakpoints for hiding columns (follows USWDS breakpoints)
    @media screen and (max-width: 1200px) {
      th.hide-desktop-lg,
      td.hide-desktop-lg {
        display: none;
      }
    }

    @media screen and (max-width: 1040px) {
      th.hide-desktop,
      td.hide-desktop {
        display: none;
      }
    }

    @media screen and (max-width: 800px) {
      th.hide-tablet-lg,
      td.hide-tablet-lg {
        display: none;
      }
    }

    @media screen and (max-width: 640px) {
      th.hide-tablet,
      td.hide-tablet {
        display: none;
      }
    }

    // Display hidden columns after clicking to expand
    .expanded-fields {
      margin: 0;
      display: table;

      th.text-middle {
        vertical-align: middle !important;
      }

      tr {
        display: table-row;
      }

      td,
      th {
        display: table-cell;
      }

      td,
      th,
      tr {
        border: none;
        background-color: transparent !important;
        padding: 0.25rem 0.75rem;
      }

      tr {
        padding: 0 0.5rem;
      }
    }

    .show-additional div {
      border: 0;
      clip: rect(0, 0, 0, 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    // Stacked styles
    @media (max-width: 575.98px) {
      .table.b-table.b-table-stacked-sm {
        display: block;
        width: 100%;
      }
      .table.b-table.b-table-stacked-sm > caption,
      .table.b-table.b-table-stacked-sm > tbody,
      .table.b-table.b-table-stacked-sm > tbody > tr,
      .table.b-table.b-table-stacked-sm > tbody > tr > td,
      .table.b-table.b-table-stacked-sm > tbody > tr > th {
        display: block;
      }
      .table.b-table.b-table-stacked-sm > thead,
      .table.b-table.b-table-stacked-sm > tfoot {
        display: none;
      }
      .table.b-table.b-table-stacked-sm > thead > tr.b-table-top-row,
      .table.b-table.b-table-stacked-sm > thead > tr.b-table-bottom-row,
      .table.b-table.b-table-stacked-sm > tfoot > tr.b-table-top-row,
      .table.b-table.b-table-stacked-sm > tfoot > tr.b-table-bottom-row {
        display: none;
      }
      .table.b-table.b-table-stacked-sm > caption {
        caption-side: top !important;
      }
      .table.b-table.b-table-stacked-sm > tbody > tr > [data-label]::before {
        content: attr(data-label);
        width: 40%;
        float: left;
        text-align: right;
        overflow-wrap: break-word;
        font-weight: bold;
        font-style: normal;
        padding: 0 calc(1rem / 2) 0 0;
        margin: 0;
      }
      .table.b-table.b-table-stacked-sm > tbody > tr > [data-label]::after {
        display: block;
        clear: both;
        content: '';
      }
      .table.b-table.b-table-stacked-sm > tbody > tr > [data-label] > div {
        display: inline-block;
        width: calc(100% - 40%);
        padding: 0 0 0 calc(1rem / 2);
        margin: 0;
      }
      .table.b-table.b-table-stacked-sm > tbody > tr.top-row,
      .table.b-table.b-table-stacked-sm > tbody > tr.bottom-row {
        display: none;
      }
      .table.b-table.b-table-stacked-sm > tbody > tr > :first-child {
        border-top-width: 3px;
      }
      .table.b-table.b-table-stacked-sm > tbody > tr > [rowspan] + td,
      .table.b-table.b-table-stacked-sm > tbody > tr > [rowspan] + th {
        border-top-width: 3px;
      }
    }
    @media (max-width: 767.98px) {
      .table.b-table.b-table-stacked-md {
        display: block;
        width: 100%;
      }
      .table.b-table.b-table-stacked-md > caption,
      .table.b-table.b-table-stacked-md > tbody,
      .table.b-table.b-table-stacked-md > tbody > tr,
      .table.b-table.b-table-stacked-md > tbody > tr > td,
      .table.b-table.b-table-stacked-md > tbody > tr > th {
        display: block;
      }
      .table.b-table.b-table-stacked-md > thead,
      .table.b-table.b-table-stacked-md > tfoot {
        display: none;
      }
      .table.b-table.b-table-stacked-md > thead > tr.b-table-top-row,
      .table.b-table.b-table-stacked-md > thead > tr.b-table-bottom-row,
      .table.b-table.b-table-stacked-md > tfoot > tr.b-table-top-row,
      .table.b-table.b-table-stacked-md > tfoot > tr.b-table-bottom-row {
        display: none;
      }
      .table.b-table.b-table-stacked-md > caption {
        caption-side: top !important;
      }
      .table.b-table.b-table-stacked-md > tbody > tr > [data-label]::before {
        content: attr(data-label);
        width: 40%;
        float: left;
        text-align: right;
        overflow-wrap: break-word;
        font-weight: bold;
        font-style: normal;
        padding: 0 calc(1rem / 2) 0 0;
        margin: 0;
      }
      .table.b-table.b-table-stacked-md > tbody > tr > [data-label]::after {
        display: block;
        clear: both;
        content: '';
      }
      .table.b-table.b-table-stacked-md > tbody > tr > [data-label] > div {
        display: inline-block;
        width: calc(100% - 40%);
        padding: 0 0 0 calc(1rem / 2);
        margin: 0;
      }
      .table.b-table.b-table-stacked-md > tbody > tr.top-row,
      .table.b-table.b-table-stacked-md > tbody > tr.bottom-row {
        display: none;
      }
      .table.b-table.b-table-stacked-md > tbody > tr > :first-child {
        border-top-width: 3px;
      }
      .table.b-table.b-table-stacked-md > tbody > tr > [rowspan] + td,
      .table.b-table.b-table-stacked-md > tbody > tr > [rowspan] + th {
        border-top-width: 3px;
      }
    }
    @media (max-width: 991.98px) {
      .table.b-table.b-table-stacked-lg {
        display: block;
        width: 100%;
      }
      .table.b-table.b-table-stacked-lg > caption,
      .table.b-table.b-table-stacked-lg > tbody,
      .table.b-table.b-table-stacked-lg > tbody > tr,
      .table.b-table.b-table-stacked-lg > tbody > tr > td,
      .table.b-table.b-table-stacked-lg > tbody > tr > th {
        display: block;
      }
      .table.b-table.b-table-stacked-lg > thead,
      .table.b-table.b-table-stacked-lg > tfoot {
        display: none;
      }
      .table.b-table.b-table-stacked-lg > thead > tr.b-table-top-row,
      .table.b-table.b-table-stacked-lg > thead > tr.b-table-bottom-row,
      .table.b-table.b-table-stacked-lg > tfoot > tr.b-table-top-row,
      .table.b-table.b-table-stacked-lg > tfoot > tr.b-table-bottom-row {
        display: none;
      }
      .table.b-table.b-table-stacked-lg > caption {
        caption-side: top !important;
      }
      .table.b-table.b-table-stacked-lg > tbody > tr > [data-label]::before {
        content: attr(data-label);
        width: 40%;
        float: left;
        text-align: right;
        overflow-wrap: break-word;
        font-weight: bold;
        font-style: normal;
        padding: 0 calc(1rem / 2) 0 0;
        margin: 0;
      }
      .table.b-table.b-table-stacked-lg > tbody > tr > [data-label]::after {
        display: block;
        clear: both;
        content: '';
      }
      .table.b-table.b-table-stacked-lg > tbody > tr > [data-label] > div {
        display: inline-block;
        width: calc(100% - 40%);
        padding: 0 0 0 calc(1rem / 2);
        margin: 0;
      }
      .table.b-table.b-table-stacked-lg > tbody > tr.top-row,
      .table.b-table.b-table-stacked-lg > tbody > tr.bottom-row {
        display: none;
      }
      .table.b-table.b-table-stacked-lg > tbody > tr > :first-child {
        border-top-width: 3px;
      }
      .table.b-table.b-table-stacked-lg > tbody > tr > [rowspan] + td,
      .table.b-table.b-table-stacked-lg > tbody > tr > [rowspan] + th {
        border-top-width: 3px;
      }
    }
    @media (max-width: 1199.98px) {
      .table.b-table.b-table-stacked-xl {
        display: block;
        width: 100%;
      }
      .table.b-table.b-table-stacked-xl > caption,
      .table.b-table.b-table-stacked-xl > tbody,
      .table.b-table.b-table-stacked-xl > tbody > tr,
      .table.b-table.b-table-stacked-xl > tbody > tr > td,
      .table.b-table.b-table-stacked-xl > tbody > tr > th {
        display: block;
      }
      .table.b-table.b-table-stacked-xl > thead,
      .table.b-table.b-table-stacked-xl > tfoot {
        display: none;
      }
      .table.b-table.b-table-stacked-xl > thead > tr.b-table-top-row,
      .table.b-table.b-table-stacked-xl > thead > tr.b-table-bottom-row,
      .table.b-table.b-table-stacked-xl > tfoot > tr.b-table-top-row,
      .table.b-table.b-table-stacked-xl > tfoot > tr.b-table-bottom-row {
        display: none;
      }
      .table.b-table.b-table-stacked-xl > caption {
        caption-side: top !important;
      }
      .table.b-table.b-table-stacked-xl > tbody > tr > [data-label]::before {
        content: attr(data-label);
        width: 40%;
        float: left;
        text-align: right;
        overflow-wrap: break-word;
        font-weight: bold;
        font-style: normal;
        padding: 0 calc(1rem / 2) 0 0;
        margin: 0;
      }
      .table.b-table.b-table-stacked-xl > tbody > tr > [data-label]::after {
        display: block;
        clear: both;
        content: '';
      }
      .table.b-table.b-table-stacked-xl > tbody > tr > [data-label] > div {
        display: inline-block;
        width: calc(100% - 40%);
        padding: 0 0 0 calc(1rem / 2);
        margin: 0;
      }
      .table.b-table.b-table-stacked-xl > tbody > tr.top-row,
      .table.b-table.b-table-stacked-xl > tbody > tr.bottom-row {
        display: none;
      }
      .table.b-table.b-table-stacked-xl > tbody > tr > :first-child {
        border-top-width: 3px;
      }
      .table.b-table.b-table-stacked-xl > tbody > tr > [rowspan] + td,
      .table.b-table.b-table-stacked-xl > tbody > tr > [rowspan] + th {
        border-top-width: 3px;
      }
    }
    .table.b-table.b-table-stacked {
      display: block;
      width: 100%;
    }
    .table.b-table.b-table-stacked > caption,
    .table.b-table.b-table-stacked > tbody,
    .table.b-table.b-table-stacked > tbody > tr,
    .table.b-table.b-table-stacked > tbody > tr > td,
    .table.b-table.b-table-stacked > tbody > tr > th {
      display: block;
    }
    .table.b-table.b-table-stacked > thead,
    .table.b-table.b-table-stacked > tfoot {
      display: none;
    }
    .table.b-table.b-table-stacked > thead > tr.b-table-top-row,
    .table.b-table.b-table-stacked > thead > tr.b-table-bottom-row,
    .table.b-table.b-table-stacked > tfoot > tr.b-table-top-row,
    .table.b-table.b-table-stacked > tfoot > tr.b-table-bottom-row {
      display: none;
    }
    .table.b-table.b-table-stacked > caption {
      caption-side: top !important;
    }
    .table.b-table.b-table-stacked > tbody > tr > [data-label]::before {
      content: attr(data-label);
      width: 40%;
      float: left;
      text-align: right;
      overflow-wrap: break-word;
      font-weight: bold;
      font-style: normal;
      padding: 0 calc(1rem / 2) 0 0;
      margin: 0;
    }
    .table.b-table.b-table-stacked > tbody > tr > [data-label]::after {
      display: block;
      clear: both;
      content: '';
    }
    .table.b-table.b-table-stacked > tbody > tr > [data-label] > div {
      display: inline-block;
      width: calc(100% - 40%);
      padding: 0 0 0 calc(1rem / 2);
      margin: 0;
    }
    .table.b-table.b-table-stacked > tbody > tr.top-row,
    .table.b-table.b-table-stacked > tbody > tr.bottom-row {
      display: none;
    }
    .table.b-table.b-table-stacked > tbody > tr > :first-child {
      border-top-width: 3px;
    }
    .table.b-table.b-table-stacked > tbody > tr > [rowspan] + td,
    .table.b-table.b-table-stacked > tbody > tr > [rowspan] + th {
      border-top-width: 3px;
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

  .b-table-top-row td {
    position: sticky;
    z-index: 1;
    background: #f1f1f1;
    border-bottom: 1px solid #ddd;
    padding: 0.5rem;
  }

  .field-filter ::v-deep {
    max-width: 300px;
    margin: auto;

    .v-select {
      background-color: #fff;
    }

    .vs__dropdown-toggle {
      margin: 0;
      min-height: 2rem;
    }

    .vs__dropdown-menu {
      width: 500px;
    }

    .usa-input {
      height: 2rem;
      width: auto;
      margin: auto;
    }
  }

  .pagination-text {
    display: inline-block;
    margin: auto auto auto 1rem;
    font-size: 0.93rem;
  }
}
</style>
