<template>
  <section>
    <div class="table-filter" v-if="shouldDisplayFilter">
      <slot name="filters" />
      <label for="tableSearch">Search</label>
      <input id="tableSearch" type="text" @input="filterTable($event)" />
    </div>

    <VirtualScroller
      v-if="shouldVirtualScroll"
      :items="tableRows"
      :item-height="rowHeight || (columns.length < 8 ? 60 : 150)"
      class="table-container"
    >
      <template slot-scope="{ items }">
        <TableMarkup :columns="tableColumns" :rows="items" :sortCol="sortCol" :sortDir="sortDir" @sort="sortTable" />
      </template>
    </VirtualScroller>
    <div v-else class="table-container">
      <TableMarkup :columns="tableColumns" :rows="tableRows" :sortCol="sortCol" :sortDir="sortDir" @sort="sortTable" />
    </div>
  </section>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import some from 'lodash/some';
import toLower from 'lodash/toLower';
import debounce from 'lodash/debounce';
import TableMarkup from './TableMarkup.vue';
import VirtualScroller from './VirtualScroller.vue';

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
    rowHeight: {
      type: Number,
    },
    longCols: {
      type: Array,
      default: () => [],
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
  components: { TableMarkup, VirtualScroller },
  data() {
    return {
      tableRows: [],
      tableColumns: [],
      sortCol: '',
      sortDir: 'asc',
    };
  },
  watch: {
    columns() {
      this.buildTableColumns();
    },
    rows() {
      this.tableRows = cloneDeep(this.rows);
    },
  },
  methods: {
    sortTable(col) {
      if (col === this.sortCol) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortDir = 'asc';
      }
      this.sortCol = col;
      this.tableRows = orderBy(this.tableRows, [col], [this.sortDir]);
    },
    /* eslint-disable func-names */
    filterTable: debounce(function(e) {
      // need to re-clone the object for when the user deletes filter term
      let filterData = cloneDeep(this.rows);
      // only filter if value is not blank
      if (e.target.value !== '') {
        filterData = filterData.filter((o) => some(o, (v) => toLower(v).indexOf(e.target.value) > -1));
      }
      // set tableRows to the filtered set
      this.tableRows = filterData;

      // if table is currently sorted, maintain existing sort order
      if (this.sortCol !== '') {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        this.sortTable(this.sortCol);
      }
    }, 500),
    /* eslint-enable func-names */
    buildTableColumns() {
      this.tableColumns = this.columns.map((col) => {
        if (typeof col === 'string') {
          return {
            key: col,
            label: col,
            align: 'center',
          };
        }
        return {
          key: col.key,
          label: col.label || col.key,
          align: col.align || 'center',
          style: col.style,
          disableSort: col.disableSort || false,
        };
      });
    },
  },
  mounted() {
    this.tableRows = cloneDeep(this.rows);
    this.buildTableColumns();

    // todo: add IE polyfill for sticky
  },
};
</script>

<style lang="scss" scoped>
.table-filter {
  margin-bottom: 1em;
  text-align: right;

  label {
    display: inline-block;
    margin-right: 0.5em;
  }
}

.table-container {
  width: 100%;
  max-height: 75vh;
  overflow: auto;
  overflow-anchor: none;
}
</style>
