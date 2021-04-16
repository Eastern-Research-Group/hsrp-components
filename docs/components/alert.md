# Alert

Displays an alert icon and message. The icon and colors change depending on the alert type.

## Example

<br>
<AlertDemo />

## Props

| Name       |  Type   | Description                                        | Default |
| ---------- | :-----: | -------------------------------------------------- | ------- |
| type       | String  |                                                    | info    |
| text       | String  | Message inside the alert.                          |         |
| header     | String  | Header above the alert message.                    |         |
| validation | Boolean | Updates styling to use as form validation message. |         |
| slim       | Boolean | Makes the alert slimmer and take up less space.    | false   |

## Slots

| Name    | Slot props | Description                                                                                                                                                                     |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default |            | Displays within the alert in addition or as an alternative to the `text` prop. If both a slot and `text` prop are passed, the slot content will display below the `text` value. |
