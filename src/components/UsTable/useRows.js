import { ref, computed, watch, onMounted } from 'vue';

const useRows = (props) => {
  const isServerSide = typeof props.rowProvider === 'function';

  const expandedRowIndexes = ref([]);

  const currentPage = ref(1);

  const currentSortKey = ref(props.defaultSort);
  const currentSortDir = ref('asc');
  const sortTable = (columnKey) => {
    // Collapse any expanded rows (otherwise order will be lost from sorting)
    expandedRowIndexes.value = [];
    if (currentSortKey.value === columnKey) {
      currentSortDir.value = currentSortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortDir.value = 'asc';
    }
    currentSortKey.value = columnKey;
    currentPage.value = 1;
  };

  const filter = ref(null);

  const tableRows = computed(() => {
    if (isServerSide) return [];

    let rows = [...props.rows];

    if (filter.value) {
      rows = rows.filter((row) =>
        Object.keys(row).some(
          (key) => row[key] && row[key].toString().toLowerCase().includes(filter.value.toLowerCase())
        )
      );
    }

    if (currentSortKey.value) {
      const column = props.columns.find((col) => col.key === currentSortKey.value);
      const sortRows = (a, b) => {
        // If value is an object, column should have sortObjectKey to get the correct key to sort on
        const values = {
          aVal: a[currentSortKey.value],
          bVal: b[currentSortKey.value],
        };
        if (column && column.sortObjectKey) {
          values.aVal = a[currentSortKey.value]?.[column.sortObjectKey];
          values.bVal = b[currentSortKey.value]?.[column.sortObjectKey];
        }
        const { aVal, bVal } = values;

        if (currentSortDir.value === 'asc') {
          if (typeof aVal === 'number') {
            return aVal - bVal;
          }
          if (aVal === null || aVal === undefined) {
            return -1;
          }
          if (bVal === null || bVal === undefined) {
            return 1;
          }
          return aVal.localeCompare(bVal);
        }
        if (typeof bVal === 'number') {
          return bVal - aVal;
        }
        if (aVal === null || aVal === undefined) {
          return 1;
        }
        if (bVal === null || bVal === undefined) {
          return -1;
        }
        return bVal.localeCompare(aVal);
      };
      // If custom sort function is in column def, use instead of default sortRows above
      rows.sort(column.sortCompare ?? sortRows);
    }

    if (!props.perPage) {
      return rows;
    }
    return rows.slice(props.perPage * (currentPage.value - 1), props.perPage * currentPage.value);
  });

  // Server-side logic using rowProvider function
  const isTableBusy = ref(false);
  const serverRows = ref([]);
  const updateServerRows = () => {
    isTableBusy.value = true;
    props
      .rowProvider({
        apiUrl: props.apiUrl,
        currentPage: currentPage.value,
        currentSortKey: currentSortKey.value,
        currentSortDir: currentSortDir.value,
        filterValue: props.filterValue,
      })
      .then((rows) => {
        serverRows.value = rows;
        isTableBusy.value = false;
      });
  };
  watch(
    [currentPage, currentSortKey, currentSortDir, () => props.apiUrl, () => JSON.stringify(props.filterValue)],
    () => {
      if (!isServerSide) return;
      updateServerRows();
    }
  );
  onMounted(() => {
    if (isServerSide) {
      updateServerRows();
    }
  });

  return {
    currentPage,
    currentSortDir,
    currentSortKey,
    expandedRowIndexes,
    sortTable,
    tableRows: isServerSide ? serverRows : tableRows,
    isTableBusy,
    filter,
  };
};

export default useRows;
