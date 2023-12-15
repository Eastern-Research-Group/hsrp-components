import { computed, ref, onMounted, watch } from 'vue';

// USWDS breakpoints
const BREAKPOINTS = {
  tablet: 640,
  'tablet-lg': 800,
  desktop: 1040,
  'desktop-lg': 1200,
};

const useColumns = (props) => {
  const table = ref(null);

  // Add resize event to check for hidden columns by breakpoint
  const windowInnerWidth = ref(window.innerWidth);
  const setWindowWidth = () => {
    windowInnerWidth.value = window.innerWidth;
  };
  onMounted(() => {
    let timeout = false;
    window.addEventListener('resize', () => {
      clearTimeout(timeout);
      timeout = setTimeout(setWindowWidth, 500);
    });
  });
  const hiddenColumns = computed(() => {
    return props.columns.filter(
      (c) => (c.hideOnBreakpoint && windowInnerWidth.value < BREAKPOINTS[c.hideOnBreakpoint]) || c.hideByDefault
    );
  });

  // Build table columns based on columns prop and calculated hiddenColumns
  const tableColumns = computed(() => {
    const columns = [];
    props.columns.forEach((col) => {
      if (typeof col === 'string') {
        columns.push({
          key: col,
          label: col,
          tdClass: 'text-left',
          sortable: true,
        });
      }
      if (!hiddenColumns.value.find((hidden) => hidden.key === col.key)) {
        const hiddenColClass = `${col.hideByDefault ? 'display-none' : ''} ${
          col.hideOnBreakpoint ? `hide-${col.hideOnBreakpoint}` : ''
        }`;
        columns.push({
          ...col,
          key: col.key,
          label: col.label || col.key,
          tdClass: `${col.tdClass || ''} ${hiddenColClass}`,
          thClass: `${col.thClass || ''} ${hiddenColClass}`,
          sortable: col.sortable !== undefined ? col.sortable : true,
          sortCompare: col.sortCompare,
          thAttr: col.thAttr, // { id: `tooltip-${col.key}` },
          id: col.id,
        });
      }
    });
    if (hiddenColumns.value.length) {
      columns.unshift({
        key: 'showAdditional',
        label: 'Show Additional Fields',
        thClass: 'show-additional',
        sortable: false,
      });
    }
    return columns;
  });

  // Set fixed widths after initial render so columns don't move around on pagination or sorting
  const setColumnWidths = () => {
    // Skip manual width setting if autoWidthColumns is passed
    if (props.autoWidthColumns) {
      return;
    }

    table.value.style.width = 'auto';
    table.value.style.tableLayout = 'auto';
    tableColumns.value.forEach((column, index) => {
      const colEl = table.value.querySelector(`th[aria-colindex="${index + 1}"]`);
      if (colEl) {
        colEl.style.width = 'auto';
      }
    });
    setTimeout(() => {
      if (!table.value) return;

      const tableWidth = table.value.getBoundingClientRect().width;
      tableColumns.value.forEach((column, index) => {
        const colEl = table.value.querySelector(`th[aria-colindex="${index + 1}"]`);
        if (colEl) {
          const colWidth = colEl.getBoundingClientRect().width;
          colEl.style.width = `${(colWidth / tableWidth) * 100}%`;
        }
      });
      table.value.style.width = `${tableWidth}px`;
      table.value.style.tableLayout = 'fixed';
    }, 1000);
  };
  watch(
    () => [tableColumns.value, props.rows],
    () => {
      if (table.value && props.rows?.length) {
        setColumnWidths();
      }
    }
  );
  onMounted(() => {
    // Set column widths on initial mount
    setColumnWidths();
  });

  return { table, tableColumns, hiddenColumns };
};

export default useColumns;
