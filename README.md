![cover](https://raw.githubusercontent.com/fullkekw/fkw-popup/main/cover.png)

React Popup component written on Typescript. Compatible with Next & Vite!

## Features
- **Closing dialog on Escape or by click on background**
- Programmatically changing popup state (open/close)
- Can prevent user from changing state
- Implements [WAI-ARIA Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) pattern

## Examples
Default implementation
```tsx
import {PopupLayer, PopupDialog, PopupButton} from '@fullkekw/fkw-popup';
import '@fullkekw/fkw-popup/css'; // Required styling

const Home: React.FC = () => {
  const popupId1 = 'popup-1';

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
import {PopupLayer, PopupDialog, PopupButton} from '@fullkekw/fkw-popup';
import '@fullkekw/fkw-popup/css'; // Required styling

const Home: React.FC = () => {
  const [state, setState] = useState(true);

  const popupId1 = 'popup-1';

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
export interface IPopupLayerProps extends React.DetailsHTMLAttributes<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[];
    /** Close popup by pressing Escape
     * @default true
     */
    exitOnEscape?: boolean;
    /** Close popup by clicking on the layer
     * @default true
     */
    exitOnLayer?: boolean;
}
export interface IPopupDialogProps extends React.DetailsHTMLAttributes<HTMLDivElement> {
    children: React.ReactNode | React.ReactNode[];
    id: string;
    /** Prevent user from toggling popup */
    preventUserInteractions?: boolean;
    /** Sync out state with current dialog state */
    state?: boolean;
    /** Sync out state with current dialog state */
    stateSetter?: (state: boolean) => void;
}
export interface IPopupButtonProps extends React.DetailsHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode | React.ReactNode[];
    togglePopupId: string;
    disabled?: boolean;
    onClick?: () => void;
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
yatn add @fullkekw/fkw-menu
```

Licensed under MIT <br>
fullkekw © 2025