# Text Input

## Example

```vue
<TextInput id="test" label="Text Input" />
```

<TextInput id="test" label="Text Input" />

## Props

\*Required

| Name           |          Type           | Description                                                              | Default |
| -------------- | :---------------------: | ------------------------------------------------------------------------ | ------- |
| id\*           |         String          | Input id attribute                                                       |         |
| value          | [String, Number, Array] | Value of the text input. Can be an array for a vue-select multiple input |         |
| label\*        |         String          | Label for the group of inputs                                            |         |
| type           |         String          | Designates type of text input, e.g. "number", "text-area", "vue-select"  | "text"  |
| srOnlyLabel    |         String          | Label to display for screen-readers only (for accessibility purposes)    |         |
| placeholder    |         String          | Input placeholder                                                        |         |
| min            |         Number          | If type is "number", set the minimum allowed value                       |         |
| vueSelectProps |         Object          | If type is "vue-select", pass specific vue-select props in an object     |         |
