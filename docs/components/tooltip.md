# Tooltip

## Example

```vue
<Tooltip id="tooltip" label="Tooltip" description="This is tooltip text" />
```

## Props

\*Required

| Name           |          Type           | Description                                                              | Default |
| -------------- | :---------------------: | ------------------------------------------------------------------------ | ------- |
| id\*           |         String          | Input id attribute                                                       |         |
| label\*        |         String          | Label for the group of inputs                                            |         |
| description\*  |         String          | Descriptive text to display upon hover/focus    |         |
| placement      |         String          | top, bottom, left, right - if not provided, will default to top or auto-place based on surrounding elements | top      |
| tooltipOnly    |         Boolean         | If you only want the hover text and already have an element that will trigger the tooltip |         |
| iconOnly       |         Boolean         | If you only want to display an icon that displays the tooltip upon hover/focus     |         |
| triggers       |         String          | triggers to display tooltip. Recommended to use default of both hover and focus for accessibility | hover focus |

### Vue-Select

See documentation for vue-select props here: [https://vue-select.org/](https://vue-select.org/)
