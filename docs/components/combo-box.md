# ComboBox

Select input from USWDS: [https://designsystem.digital.gov/components/combo-box/](https://designsystem.digital.gov/components/combo-box/)

## Example

```vue
<ComboBox
    id="comboBox"
    label="Combo Box"
    :options="[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' },
    ]"
    v-model="comboBox"
/>
```

<ComboBox
    id="comboBox"
    label="Combo Box"
    :options="[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' },
    ]"
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
| options        |         Array           | Array of select options. Should be array of objects include value and label props.     |         |
