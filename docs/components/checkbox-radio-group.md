# Checkbox/Radio Group

A group of checkbox or radio button inputs

## Props

\*Required

| Name        |          Type           | Description                                                                                                                                        | Default |
| ----------- | :---------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| id\*        |         String          | Input id attribute                                                                                                                                 |         |
| value       | [String, Number, Array] | Value of the selected checkbox/radio button. Can be an array to designate multiple checkboxes checked.                                             |         |
| label\*     |         String          | Label for the group of inputs                                                                                                                      |         |
| type        |         String          | Designates type of input - "checkbox" or "radio"                                                                                                   |         |
| srOnlyLabel |         String          | Label to display for screen-readers only (for accessibility purposes)                                                                              |         |
| options\*   |          Array          | Can be an array of strings if the value and label of each option are the same. Otherwise, should be an array of objects with value and label keys. |         |
