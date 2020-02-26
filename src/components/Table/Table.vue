<template>
  <section>
    <div class="table-filter" v-if="shouldDisplayFilter">
      <label for="tableSearch">Search</label>
      <input id="tableSearch" type="text" @input="filterTable($event)" />
    </div>

    <VirtualScroller :items="tableData" :item-height="rowHeight || (columns.length < 8 ? 60 : 150)" class="data-table">
      <template slot-scope="{ items }">
        <table>
          <thead>
            <tr>
              <th v-for="col in tableColumns" :key="col.key">
                <Button
                  btnStyle="unstyled"
                  :class="`header-cell ${col.disableSort ? 'disabled' : ''}`"
                  @click="col.disableSort ? false : sortTable(col.key)"
                >
                  <span class="header-label">{{ col.label }}</span>
                  <span v-if="sortCol === col.key" :class="`arrow ${sortDir === 'asc' ? 'up' : 'down'}`"></span>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in items" :key="`row_${index}`">
              <td v-for="(col, i) in tableColumns" :key="col.key + i" :class="`text-${col.align}`" :style="col.style">
                {{ row[col.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </VirtualScroller>
  </section>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import some from 'lodash/some';
import toLower from 'lodash/toLower';
import debounce from 'lodash/debounce';
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
  },
  data() {
    return {
      tableData: [],
      tableColumns: [],
      sortCol: '',
      sortDir: 'asc',
    };
  },
  components: { VirtualScroller },
  methods: {
    sortTable(col) {
      if (col === this.sortCol) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortDir = 'asc';
      }
      this.sortCol = col;
      this.tableData = orderBy(this.tableData, [col], [this.sortDir]);
    },
    /* eslint-disable func-names */
    filterTable: debounce(function(e) {
      // need to re-clone the object for when the user deletes filter term
      let filterData = cloneDeep(this.rows);
      // only filter if value is not blank
      if (e.target.value !== '') {
        filterData = filterData.filter((o) => some(o, (v) => toLower(v).indexOf(e.target.value) > -1));
      }
      // set tableData to the filtered set
      this.tableData = filterData;

      // if table is currently sorted, maintain existing sort order
      if (this.sortCol !== '') {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        this.sortTable(this.sortCol);
      }
    }, 500),
    /* eslint-enable func-names */
  },
  mounted() {
    this.tableData = cloneDeep(this.rows);

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

.data-table {
  width: 100%;
  max-height: 75vh;
  overflow: auto;
  overflow-anchor: none;

  table {
    font-size: 0.95rem;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;

    tr:nth-child(2n) {
      background-color: #f2f2f2;
    }

    /* tr:hover {
      background-color: #ddd;
    } */

    td,
    th {
      border: none;
      padding: 0.6rem;
    }

    th {
      padding: 0;
      background-color: #f1f1f1;
      border-right: 1px solid #fff;
      border-bottom: 1px solid #ddd;
      position: sticky;
      position: -webkit-sticky;
      z-index: 999;
      top: -1px;

      .header-cell {
        // width: max-content;
        width: 100%;
        margin: 0;
        padding: 0.6rem;
        text-align: center;
        color: #2c3e50;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover,
        &:active {
          text-decoration: none;
          background-color: #d6d7d9;

          &.disabled {
            cursor: default;
            background-color: unset;
          }
        }

        &:focus {
          outline-offset: 0;

          &.disabled {
            outline: none;
          }
        }
      }

      .header-label {
        margin: auto;
      }
    }
  }

  .arrow {
    display: inline-block;
    margin-left: 0.25rem;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;

    &.up {
      border-bottom: 5px solid black;
    }
    &.down {
      border-top: 5px solid black;
    }
  }
}
</style>
