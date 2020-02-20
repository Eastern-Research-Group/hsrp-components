# Table

Displays a data table.

## Example

<TableDemo />

## Props

\*Required

| Name                |  Type   | Description                                                                                                            | Default |
| ------------------- | :-----: | ---------------------------------------------------------------------------------------------------------------------- | ------- |
| columns\*           |  Array  | For a simple table, this can be an array of strings for column headers. Otherwise, use an array of objects (see below) |         |
| rows\*              |  Array  | Array of objects with the object keys matching column keys.                                                            |         |
| shouldDisplayFilter | Boolean | Displays a text filter to search table's content.                                                                      | `false` |

### Column Objects

\*Required

| Name        |  Type   | Description                                                                                                  | Default |
| ----------- | :-----: | ------------------------------------------------------------------------------------------------------------ | ------- |
| key\*       | String  | Unique column identifier                                                                                     |         |
| label       | String  | Displayed in the column header (if null, column key is used)                                                 |         |
| align       | String  | Sets alignment of cell text (left, center, right). Only applies to table cells - headers are always centered | center  |
| disableSort | Boolean | If true, the column will not be sortable                                                                     | `false` |
| style       | Object  | Custom style object which will be applied to column cells, e.g. to set a fixed width                         |         |
