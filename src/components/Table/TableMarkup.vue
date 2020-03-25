<template>
  <table class="data-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">
          <Button
            btnStyle="unstyled"
            :class="`header-cell ${col.disableSort ? 'disabled' : ''}`"
            @click="col.disableSort ? false : $emit('sort', col.key)"
          >
            <span class="header-label">{{ col.label }}</span>
            <span v-if="sortCol === col.key" :class="`arrow ${sortDir === 'asc' ? 'up' : 'down'}`"></span>
          </Button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="`row_${index}`">
        <td v-for="(col, i) in columns" :key="col.key + i" :class="`text-${col.align}`" :style="col.style">
          {{ row[col.key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
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
    sortCol: {
      type: String,
      required: false,
    },
    sortDir: {
      type: String,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.data-table {
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
</style>
