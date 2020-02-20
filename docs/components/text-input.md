# Text Input

## Example

### Default

<br>
<TextInput id="test" label="Text Input" />

### Vue-Select

<br>
<TextInput
    id="test"
    label="Vue Select"
    placeholder="Select an option or begin typing to search"
    type="vue-select"
    :vueSelectProps="{ options: ['Option 1', 'Option 2', 'Option 3'] }"
/>

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

### Vue-Select

See documentation for vue-select props here: [https://vue-select.org/](https://vue-select.org/)
