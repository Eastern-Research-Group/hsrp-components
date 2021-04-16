# Vue Select Input

## Example

```vue
<VueSelectInput
    id="test"
    label="Vue Select"
    placeholder="Select an option or begin typing to search"
    :vueSelectProps="{ 
        options: ['Option 1', 'Option 2', 'Option 3'],
        multiple: true 
    }"
    v-model="value"
/>
```

<VueSelectInput
    id="test"
    label="Vue Select"
    placeholder="Select an option or begin typing to search"
    :vueSelectProps="{ options: ['Option 1', 'Option 2', 'Option 3'], multiple: true }"
    v-model="value"
/>

## Props

\*Required

| Name           |          Type           | Description                                                              | Default |
| -------------- | :---------------------: | ------------------------------------------------------------------------ | ------- |
| id\*           |         String          | Input id attribute                                                       |         |
| value          | [String, Number, Array] | Value of the text input. Can be an array for a vue-select multiple input |         |
| label\*        |         String          | Label for the group of inputs                                            |         |
| srOnlyLabel    |         String          | Label to display for screen-readers only (for accessibility purposes)    |         |
| placeholder    |         String          | Input placeholder                                                        |         |
| vueSelectProps |         Object          | Pass specific vue-select props in an object (see vue-select docs for all props)    |         |

### Vue-Select

See documentation for vue-select props here: [https://vue-select.org/](https://vue-select.org/)
