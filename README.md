![cover](./cover.png)

React Popup component written on Typescript. Compatible with Next & Vite!

**[Live examples](https://example.com)**

## Features
- **Closing dialog on Escape or by click on Layout**
- Smooth scroll hiding without reseting content
- Manipulating Dialog state out of component
- Will return focus to the button that triggered opening
- Possibility to prevent user change state of popup
- Flexible settings
- Fancy in-box styling
- Implements [WAI-ARIA Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) pattern


## Examples
**[Live examples](https://example.com)**

## API
Open popup will hide any elements with tabindex. To prevent this, add ```fkw-prevent_hideIndexes``` class to element with tabindex.
Trigger which open popup will have ```fkw-popup-trigger_triggeredBy``` class

## Handlers
```ts
/** Hide scrollbar with saving scroll width
 * @param extendElement HTML element to extend. Default - document.body
 */
export function toggleScroll(hide: boolean, extendElement?: HTMLElement)

/** Hide tab indexes 
 * Will store them in data-fkw-prevTabIndex
 * @param except Class that this function will pass. Will except fkw-prevent_hideIndexes by default
*/
export function hideTabIndexes(except?: string)

/** Return tab indexes from data-fkw-prevTabIndex */
export function showTabIndexes()

/** Force element focus */
export function forceFocus(el: HTMLElement)
```

## Get it now!
```bash
npm install @fullkekw/fkw-popup
```

Licensed under MIT <br>
fullkekw © 2023 - 2024