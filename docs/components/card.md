# Card

Displays a card with a header, optional icon, and content.

## Example

```vue
<Card header="Card Title" icon="check">
    <p>This is a card with some content in it.</p>
    <p>Here's another paragraph.</p>
</Card>
```

<Card header="Card Title" icon="check" style="max-width:400px">
  <div>
    <p>This is a card with some content in it.</p>
    <p>Here's another paragraph.</p>
  </div>
</Card>

## Props

| Name          |  Type   | Description                                                                                                       | Default |
| ----------    | :-----: | ----------------------------------------------------------------------------------------------------------------- | ------- |
| isHyperlink   | Boolean  | Set to true if entire card should be a hyperlink.                                                                | false   |
| hyperlinkPath | String  | If isHyperlink is true, provide path to go to. Currently only works for internal paths using router-link          |         |
| header*       | String  | Header at the top of the card.                                                                                    |         |
| icon          | String | Optional font-awesome icon to display before header. Use icon name without "fa-" prefix.                                    |         |

## Slots

| Name    | Slot props | Description                                                                   |
| ------- | ---------- | ----------------------------------------------------          |
| default |            | Displays under the card header inside the main content area.  |
