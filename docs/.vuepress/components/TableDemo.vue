<template>
  <div>
    <Table :columns="columns" :rows="rows" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { key: 'Column1', label: 'Left Column', align: 'left' },
        { key: 'Column2', label: 'Center Column' },
        { key: 'Column3', label: 'Right Column', align: 'right' },
        { key: 'Column4', label: 'Sort-Disabled Column', disableSort: true },
        { key: 'Column5', label: 'Wide Column', style: { width: '200px' } },
      ],
      rows: [
        { Column1: 'test', Column2: 'test', Column3: 'test', Column4: 'test', Column5: 'test' },
        { Column1: 'test', Column2: 'test', Column3: 'test', Column4: 'test', Column5: 'test' },
        { Column1: 'test', Column2: 'test', Column3: 'test', Column4: 'test', Column5: 'test' },
        { Column1: 'test', Column2: 'test', Column3: 'test', Column4: 'test', Column5: 'test' },
        { Column1: 'test', Column2: 'test', Column3: 'test', Column4: 'test', Column5: 'test' },
      ],
    };
  },
};
</script>
