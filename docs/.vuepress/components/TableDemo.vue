<template>
  <div class="margin-top-2">
    <Table :columns="columns" :rows="rows" :shouldDisplayFilter="true" >
      <!-- Custom cell render slot -->
      <template v-slot:cell(Column5)="data">
        <a href="#">{{ data.value }}</a>
      </template>

      <!-- Row drilldown/details functionality -->
      <template v-slot:cell(Column6)="row">
        <Button label="Drilldown" @click="row.toggleDetails" />
      </template>

      <template v-slot:row-details="row">
        <Alert type="warning" :text="row.item.Column2" />
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { key: 'Column1', label: 'Left Column', tdClass: 'text-left' },
        { key: 'Column2', label: 'Center Column' },
        { key: 'Column3', label: 'Right Column', tdClass: 'text-right' },
        { key: 'Column4', label: 'Sort-Disabled Column', sortable: false },
        { key: 'Column5', label: 'Custom Cell Render' },
        { key: 'Column6', label: 'Drilldown', sortable: false },
      ],
      rows: [
        { Column1: '1 test', Column2: 'a test', Column3: 'test', Column4: 'test', Column5: 'link1', Column6: 'test' },
        { Column1: '2 test', Column2: 'b test', Column3: 'test', Column4: 'test', Column5: 'link2', Column6: 'test' },
        { Column1: '3 test', Column2: 'c test', Column3: 'test', Column4: 'test', Column5: 'link3', Column6: 'test' },
        { Column1: '4 test', Column2: 'd test', Column3: 'test', Column4: 'test', Column5: 'link4', Column6: 'test' },
        { Column1: '5 test', Column2: 'e test', Column3: 'test', Column4: 'test', Column5: 'link5', Column6: 'test' },
      ],
    };
  },
};
</script>
