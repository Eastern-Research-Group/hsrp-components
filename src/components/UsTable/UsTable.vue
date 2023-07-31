<script setup>
import { toggleArrayItem } from '../../utils/arrayHelper';
import Button from '../Button.vue';
import TextInput from '../Form/TextInput.vue';
import UsPagination from './UsPagination.vue';
import useColumns from './useColumns';
import useRows from './useRows';

const props = defineProps({
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
  stacked: {
    type: [Boolean, String],
  },
  compact: {
    type: Boolean,
  },
  caption: {
    type: String,
  },
  shouldDisplayFilter: {
    type: Boolean,
  },
  filterValue: {
    type: [String, Object],
  },
});

const { table, tableColumns, hiddenColumns } = useColumns(props);
const { currentPage, currentSortDir, currentSortKey, expandedRowIndexes, sortTable, tableRows, isTableBusy, filter } =
  useRows(props);
</script>

<template>
  <div>
    <TextInput
      v-if="shouldDisplayFilter"
      class="table-filter"
      label="Search"
      v-model="filter"
      :id="Math.random().toString(36).substring(3, 9)"
    />
    <div class="usa-table-container--responsive" tabindex="0" :style="{ maxHeight: height }">
      <table
        :class="`usa-table usa-table--striped usa-table--borderless ${compact ? 'usa-table--compact' : ''}`"
        :aria-busy="isTableBusy"
        ref="table"
      >
        <caption v-if="caption">
          {{
            caption
          }}
        </caption>
        <colgroup>
          <col v-for="column in tableColumns" :key="`col_${column.key}`" :id="`col_${column.key}`" />
        </colgroup>
        <thead>
          <tr>
            <th
              v-for="(column, index) in tableColumns"
              :key="`${column.key}_header`"
              :id="column.id ? column.id : undefined"
              :class="column.thClass"
              scope="col"
              :data-sortable="column.sortable ? true : false"
              :aria-colindex="index + 1"
              :aria-label="`${column.label}, ${
                column.sortable
                  ? `sortable column, currently ${
                      currentSortKey === column.key ? `sorting ${currentSortDir}ending` : 'unsorted'
                    }`
                  : ''
              }`"
              :aria-sort="currentSortKey === column.key ? `${currentSortDir}ending` : false"
            >
              <slot v-if="$scopedSlots[`head(${column.key})`]" :name="`head(${column.key})`" :field="column" />
              <slot v-else-if="$scopedSlots['head()']" name="head()" :field="column" />
              <span v-else>
                {{ column.label }}
              </span>
              <button
                v-if="column.sortable"
                class="usa-table__header__button"
                type="button"
                :aria-label="`Click to sort by ${column.label} in ${
                  currentSortKey === column.key && currentSortDir === 'asc' ? 'descending' : 'ascending'
                } order.`"
                @click="sortTable(column.key)"
              >
                <span
                  :class="`fa ${
                    currentSortKey !== column.key
                      ? 'fa-arrows-alt-v'
                      : `fa-long-arrow-alt-${currentSortDir === 'asc' ? 'up' : 'down'}`
                  }`"
                ></span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="tableRows.length === 0" class="no-data-message">
            <td :colspan="tableColumns.length">
              {{ emptyText }}
            </td>
          </tr>
          <template v-for="(row, index) in tableRows">
            <tr :key="`row_${index}`">
              <td
                v-for="column in tableColumns"
                :key="`${column.key}_row_${index}`"
                :class="column.tdClass"
                :data-sort-active="currentSortKey === column.key"
                :data-label="column.label"
              >
                <Button
                  v-if="column.key === 'showAdditional'"
                  class="expand-row-button"
                  btnStyle="unstyled"
                  :icon="expandedRowIndexes.includes(index) ? 'minus-circle' : 'plus-circle'"
                  :title="expandedRowIndexes.includes(index) ? 'Collapse' : 'Expand additional columns'"
                  @click="toggleArrayItem(expandedRowIndexes, index)"
                />
                <slot
                  v-else-if="$scopedSlots[`cell(${column.key})`]"
                  :name="`cell(${column.key})`"
                  :item="row"
                  :value="row[column.key]"
                  :index="index"
                />
                <slot
                  v-else-if="$scopedSlots['cell()']"
                  name="cell()"
                  :item="row"
                  :value="row[column.key]"
                  :index="index"
                />
                <span v-else>
                  {{ column.formatter ? column.formatter(row[column.key]) : row[column.key] }}
                </span>
              </td>
            </tr>
            <template v-if="expandedRowIndexes.includes(index)">
              <tr aria-hidden="true" role="presentation" class="display-none" :key="`hidden_${index}`"></tr>
              <tr :key="`expanded_${index}`" tabindex="-1">
                <td :colspan="tableColumns.length">
                  <table class="expanded-fields">
                    <thead class="display-none">
                      <tr>
                        <th v-for="column in hiddenColumns" :key="`th-${column.key}`" scope="col">
                          {{ column.label }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="column in hiddenColumns" :key="column.key">
                        <th class="text-right text-middle">{{ column.label }}</th>
                        <td :class="`text-left ${column.tdClass}`">
                          <!-- If slot is available for field, display slot content, otherwise display the value -->
                          <slot
                            v-if="$scopedSlots[`cell(${column.key})`]"
                            :name="`cell(${column.key})`"
                            v-bind="row"
                            :item="row"
                            :value="row[column.key]"
                            :index="index"
                          />
                          <span v-else>
                            {{ row[column.key] }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <UsPagination
      v-if="perPage && total > perPage"
      v-bind="{ total, perPage, currentPage }"
      @changePage="(page) => (currentPage = page)"
    />
  </div>
</template>

<style scoped lang="scss">
@import '../../styles/variables';

.usa-table-container--responsive {
  overflow: auto;
  border: 1px solid color('gray-10');
}

table.usa-table {
  margin: 0;
  font-size: size('sans', '2xs');
  border-collapse: separate;
  min-width: 100%;

  &.usa-table--compact {
    font-size: size('sans', '3xs');

    & th {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  }

  thead th {
    position: sticky;
    top: 0;
    background: color('gray-10');
    border: none;
    border-right: 1px solid color('gray-20');
    border-bottom: 1px solid color('gray-20');
    z-index: 9;

    &:last-child {
      border-right: none;
    }
  }

  td {
    border: none;
  }

  & th[data-sortable] {
    padding-right: 2rem;
  }

  & th[data-sortable] .usa-table__header__button {
    left: 1px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    text-align: right;
    padding-right: 0.75rem;
    word-wrap: normal;
  }

  .no-data-message > td {
    background-color: #fff;
    text-align: center;
    padding: 0.5rem;
    border: 1px solid color('gray-10');
    border-top: none;
  }

  &[aria-busy='true'] {
    opacity: 0.6;
  }
}

.usa-table__header__button .fa {
  font-size: size('sans', 'xs');
  color: color('gray-90');
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
tr:nth-child(odd) {
  background-color: color('gray-5');
}

.expanded-fields {
  margin: 0;
  display: table;

  tr {
    display: table-row;
  }

  th {
    font-weight: bold;
  }

  td,
  th {
    display: table-cell;
    word-break: normal;
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

.show-additional span {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.table-filter {
  display: flex;
  justify-content: right;
  align-items: center;
  margin: 0.5rem 0;

  ::v-deep {
    .usa-label {
      margin-right: 0.5rem;
    }

    .usa-input {
      margin-top: 0;
      width: auto;
    }
  }
}
</style>
