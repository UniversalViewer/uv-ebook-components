# uv-ebook-reader



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type     | Default  |
| ---------------- | ------------------ | ----------- | -------- | -------- |
| `height`         | `height`           |             | `string` | `"100%"` |
| `minSpreadWidth` | `min-spread-width` |             | `number` | `800`    |
| `mobileWidth`    | `mobile-width`     |             | `number` | `300`    |
| `width`          | `width`            |             | `string` | `"100%"` |


## Events

| Event                | Description | Type               |
| -------------------- | ----------- | ------------------ |
| `bookReady`          |             | `CustomEvent<any>` |
| `loadedBookMetadata` |             | `CustomEvent<any>` |
| `loadedNavigation`   |             | `CustomEvent<any>` |
| `relocated`          |             | `CustomEvent<any>` |
| `renditionAttached`  |             | `CustomEvent<any>` |


## Methods

### `display(href: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `load(url: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `resize() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
