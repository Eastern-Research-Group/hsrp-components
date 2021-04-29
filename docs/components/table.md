# Table

Displays a data table. Note: This component is a wrapper of the [Bootstrap-Vue Table component](https://bootstrap-vue.js.org/docs/components/table/).

## Example

<ClientOnly>
  <TableDemo />
</ClientOnly>

Code:

<<< @/docs/.vuepress/components/TableDemo.vue

## Props

\*Required

| Name                |  Type   | Description                                                                                                            | Default |
| ------------------- | :-----: | ---------------------------------------------------------------------------------------------------------------------- | ------- |
| columns\*           |  Array  | For a simple table, this can be an array of strings for column headers. Otherwise, use an array of objects (see below) |         |
| rows\*              |  Array  | Array of objects with the object keys matching column keys.                                                            |         |
| defaultSort         | String  | Set the column key that should be sorted on by default.                                                                |         |
| busy                | Boolean | If true, table will display a loading indicator. Used when fetching data.                                              | `false` |
| shouldDisplayFilter | Boolean | Displays a text filter to search table's content.                                                                      | `false` |

### Columns Array

**hideOnBreakpoint**

Add hideOnBreakpoint prop to field object to hide specific columns depending on screen size. Currently available breakpoints (following USWDS) are below. Use the screen type as the value of hideOnBreakpoint, e.g. `hideOnBreakpoint: 'tablet'`

- `desktop-lg` - 1200px
- `desktop` - 1040px
- `tablet-lg` - 800px
- `tablet` - 640px

You can also set **hideByDefault** to true to always hide the column and display an expand/collapse button to view.

See the [Bootstrap-Vue Table fields documentation](https://bootstrap-vue.js.org/docs/components/table/#fields-column-definitions) for how to build the field objects.
