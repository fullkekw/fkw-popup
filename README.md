![cover](https://raw.githubusercontent.com/fullkekw/fkw-popup/main/cover.png)

React typescript ARIA-Accessible Popup (Modal) component. Compatible with NextJS & Vite!

## Features
- **Closing dialog on Escape or by click on the background**
- Programmatically changing popup state
- Prevent user from changing state
- Hight customability
- Headless styles
- Implements [WAI-ARIA Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) pattern

## Examples
Default implementation
```tsx
import React, { useState, useEffect, useId } from "react";
import { PopupLayer, PopupDialog, PopupButton } from '@fullkekw/fkw-popup';
import '@fullkekw/fkw-popup/css'; // Required styling

const Home: React.FC = () => {
  const popupId1 = useId();

  return (
    <div className="Home bg-slate-400 w-full h-full min-h-screen" id="screen">
      <PopupLayer className="flex items-center justify-center">
        <PopupDialog className="w-[500px] h-[200px] bg-white" id={popupId1}>
          <PopupButton togglePopupId={popupId1}>
            <p>close 1</p>
          </PopupButton>
        </PopupDialog>
      </PopupLayer>

      <PopupButton togglePopupId={popupId1}>
        <p>open popup 1</p>
      </PopupButton>
    </div>
  );
};
```

Programmatically change state & prevent user intercations
```tsx
import React, { useState, useEffect, useId } from "react";
import { PopupLayer, PopupDialog, PopupButton } from '@fullkekw/fkw-popup';
import '@fullkekw/fkw-popup/css'; // Required styling

const Home: React.FC = () => {
  const [state, setState] = useState(true);

  const popupId1 = useId();

  return (
    <div className="Home bg-slate-400 w-full h-full min-h-screen" id="screen">
      <PopupLayer className="flex items-center justify-center">
        <PopupDialog className="w-[500px] h-[200px] bg-white" id={popupId1} state={state} stateSetter={setState} preventUserInteractions>
          <PopupButton togglePopupId={popupId1}>
            <p>close 1</p>
          </PopupButton>
        </PopupDialog>
      </PopupLayer>

      <PopupButton togglePopupId={popupId1}>
        <p>open popup 1</p>
      </PopupButton>
    </div>
  );
};
```
## API
```ts
export interface PopupLayerProps extends React.DetailsHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[]

  /** Close popup by pressing Escape
   * @default true
   */
  exitOnEscape?: boolean

  /** Close popup by clicking on the layer
   * @default true
   */
  exitOnLayer?: boolean

  /** Prevent scroll from hiding */
  preventScrollHiding?: boolean

  /** Update out state when inner popups state changed */
  setIsPopupsOpen?: (state: boolean) => void
}

export interface PopupDialogProps extends React.DetailsHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[]
  id: string

  /** Prevent user from toggling popup */
  preventUserInteractions?: boolean

  /** Sync out state with current dialog state */
  state?: boolean

  /** Sync out state with current dialog state */
  stateSetter?: (state: boolean) => void

  /** Appearance animation @default "fade" */
  animation?: 'fade' | 'scale' | null
}

export interface PopupButtonProps extends React.DetailsHTMLAttributes<HTMLElement> {
  children: React.ReactNode | React.ReactNode[]
  togglePopupId: string

  disabled?: boolean
  onClick?: () => void

  /** @default "button" */
  as?: 'button' | 'div'
}
```

## Installation
Using npm
```
npm install @fullkekw/fkw-popup
```

Using pnpm
```
pnpm install @fullkekw/fkw-popup
```

Using yarn
```
yarn add @fullkekw/fkw-popup
```

[changelog](./docs/changelog.md)

Licensed under MIT <br>
fullkekw © 2025