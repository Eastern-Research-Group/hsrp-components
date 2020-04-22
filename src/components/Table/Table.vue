<template>
  <div class="table-container">
    <TextInput
      v-if="shouldDisplayFilter"
      class="text-right"
      id="filter"
      label="Search"
      @input="shouldVirtualScroll ? filterTable($event) : setFilter($event)"
    />

    <VirtualScroller
      v-if="shouldVirtualScroll"
      class="v-scroll-container"
      :items="filteredRows"
      :item-height="columns.length < 8 ? 60 : 150"
      :style="{ maxHeight: height }"
    >
      <template slot-scope="{ items }">
        <BTable v-bind="tableProps" :items="items" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" />
      </template>
    </VirtualScroller>
    <BTable
      v-else
      v-bind="tableProps"
      :items="rows"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @filter="onFiltered"
    >
      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </BTable>

    <BPagination v-if="perPage" v-model="currentPage" :total-rows="totalRows" :per-page="perPage" :limit="11" />
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
import TextInput from '../Form/TextInput.vue';

export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
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
  },
  components: { BTable, BPagination, TextInput, VirtualScroller },
  data() {
    return {
      sortBy: this.defaultSort || '',
      sortDesc: false,
      tableColumns: [],
      filter: '',
      currentPage: 1,
      totalRows: 0,
      filteredRows: [],
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
      };
    },
  },
  watch: {
    columns() {
      this.buildTableColumns();
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
        filterData = filterData.filter((o) => some(o, (v) => toLower(v).indexOf(e.target.value) > -1));
      }
      // set filteredRows to the filtered set
      this.filteredRows = filterData;

      // if table is currently sorted, maintain existing sort order
      if (this.sortBy !== '') {
        this.sortTable();
      }
    }, 500),
    /* eslint-enable func-names */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    sortTable() {
      this.filteredRows = orderBy(this.filteredRows, [this.sortBy], [this.sortDesc ? 'desc' : 'asc']);
    },
  },
  mounted() {
    this.filteredRows = cloneDeep(this.rows);
    this.totalRows = this.rows.length;
    this.buildTableColumns();
  },
};
</script>

<style lang="scss" scoped>
.table-container {
  ::v-deep {
    #filter {
      margin: 0 0 0.5rem 0.5rem;
    }

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
      font-size: 0.95rem;
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
        position: relative;
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
          background-image: url('./sort-inactive.svg');
        }

        &[aria-sort='ascending'] {
          background-image: url('./sort-asc.svg');
        }

        &[aria-sort='descending'] {
          background-image: url('./sort-desc.svg');
        }
      }

      &.table-striped tbody tr:nth-of-type(even) {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    .b-pagination {
      margin-top: 1rem;
      display: flex;
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
}
</style>
