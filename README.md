# ember-sidenotes

An easy way to place side notes with a vertical reference position for EmberJS
(inspired by https://github.com/curvenote/sidenotes)

## Compatibility

- Ember.js v3.20 or above
- Ember CLI v3.20 or above
- Node.js v12 or above

## Installation

```
ember install ember-sidenotes
```

## Usage

This is a basic example of what this addon allow you to do.

```hbs
<SidenotesWrapper @items={{this.items}} as |Sidenote item|>
  <Sidenote @id={{item.id}} @offsetY={{item.y}} @data={{item.data}} as |s|>
    <p>
      {{item.data.content}}
    </p>
    {{#if s.isActive}}
      <button type='button' {{on 'click' s.unselect}}>Unselect</button>
    {{else}}
      <button type='button' {{on 'click' s.select}}>Select</button>
    {{/if}}
  </Sidenote>
</SidenotesWrapper>
```

There are two ways of using this addon, controlled and non-controlled mode.

## Controlled & Non-controlled modes

### Controlled mode

The controlled mode makes it possible to managed which side note is selected with an argument named `selectedSidenoteId`. This has to match the argument `id` passed to a component `<Sidenote @id={{...}} />`.

As two actions `select` and `unselect` are exposed in each sidenote component, calling them will raise an action on the wrapper (respectively `onSelect` and `onUnselect`) with all the data necessary to be aware of which sidenote has been selected (`{ element, id, offsetY, data }`).

Then, this is your job to mutate your argument `selectedSidenoteId` to make the new sidenote selected.

_MyComponent.hbs_

```hbs
<SidenotesWrapper
  @items={{this.items}}
  @onSelect={{this.onSelect}}
  @onUnselect={{this.onUnselect}}
  @selectedSidenoteId={{this.selectedSidenoteId}}
  as |Sidenote item|
>
  <Sidenote @id={{item.id}} @offsetY={{item.y}} @data={{item.data}} as |s|>
    {{#if s.isActive}}
      <button type='button' {{on 'click' s.unselect}}>Unselect</button>
    {{else}}
      <button type='button' {{on 'click' s.select}}>Select</button>
    {{/if}}
  </Sidenote>
</SidenotesWrapper>
```

_MyComponent.js_

```js
export default class MyComponent extends Component {
  @tracked items = [
    { id: 1, offsetY: 104, data: null },
    // ...
  ];

  @action
  onSelect({ id }) {
    this.selectedSidenoteId = id;
  }

  @action
  onUnselect() {
    this.selectedSidenoteId = null;
  }
}
```

### Non-controlled mode

The non-controlled mode is the way to use this addon in a simpler way. The selected sidenote will be handled internally by the components.

Both `select` and `unselect` actions will raised the matching action on the wrapper (respectively `onSelect` and `onUnselect`) but only for notify purpose.

You can also specify a `defaultSidenoteId` argument to the wrapper to choose the sidenote selected on component load. If it's not specified or the one specified does not match any sidenote, this will default to the first sidenote.

_MyComponent.hbs_

```hbs
<SidenotesWrapper
  @defaultSidenoteId={{6}}
  @items={{this.items}}
  as |Sidenote item|
>
  <Sidenote @id={{item.id}} @offsetY={{item.y}} @data={{item.data}} as |s|>
    {{#if s.isActive}}
      <button type='button' {{on 'click' s.unselect}}>Unselect</button>
    {{else}}
      <button type='button' {{on 'click' s.select}}>Select</button>
    {{/if}}
  </Sidenote>
</SidenotesWrapper>
```

_MyComponent.js_

```js
export default class MyComponent extends Component {
  @tracked items = [
    { id: 1, offsetY: 104, data: null },
    // ...
    { id: 6, offsetY: 495, data: null },
  ];
}
```

## Components details

### SidenotesWrapper

| Argument          | Type   | Default | Mode           | Description                                                                                                        |
| ----------------- | ------ | ------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| activeSidenoteId  | Number | null    | Controlled     | Selected sidenote id (presence of this property will enable controlled mode)                                       |
| defaultSidenoteId | Number | null    | Non-controlled | Default selected sidenote id on wrapper load                                                                       |
| gutter            | Number | 0       | Both           | Vertical spacing added between every sidenotes                                                                     |
| key            | String | '@identity'       | Both           | Key passed to `#each` helper when iterating over `@items`. It will be used to determine if render is needed on change (See [#each doc](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/if?anchor=each) cf. 'Specifying keys')                                                                     |
| items             | Array  | -       | Both           | List of items corresponding to wanted sidenotes                                                                    |
| onSelect          | Action | -       | Both           | Action raised when using `select` exposed action on `Sidenote` component                                           |
| onSidenotesMoved  | Action | -       | Both           | Action raised after sidenotes finished moving (called after load, selection, unselection, or sidenote size change) |
| onUnselect        | Action | -       | Both           | Action raised when using `unselect` exposed action on `Sidenote` component                                         |

This component expose two variables.

- [0] is a `Sidenote` component instance
- [1] is the current item to process (as `SidenotesWrapper` iterate over `@items`)

### Sidenote

| Argument | Type   | Default | Description                                                                                         |
| -------- | ------ | ------- | --------------------------------------------------------------------------------------------------- |
| id       | Number | -       | Sidenote id used as the unique identifier of this sidenote (should be unique)                       |
| offsetY  | Number | -       | Preferred vertical position of the sidenote (the sidenote will position at this offset if possible) |
| data     | Any    | -       | Custom data (this will be passed to `@onSelect` and `@onUnselect` of the wrapper)                   |

This component expose one variable which has 3 properties

- `isActive` is a boolean value that reflects if current sidenote is the one selected
- `select` is an action to use to select current sidenote (will behave differently depending on the mode used)
- `unselect` is an action to use to unselect current sidenote (will behave differently depending on the mode used)

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
