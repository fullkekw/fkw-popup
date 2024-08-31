import React, { useState, useEffect, useRef, HTMLProps } from "react";
import * as uuid from 'uuid';

import '../styles/popup.scss';

export interface IPopupSettings {
  /** Hide body scroll when popup active
   * @default true
   */
  hideScroll?: boolean

  /** Close popup on escape
   * @default true
   */
  exitOnEscape?: boolean

  /** Close popup on clicking on layer
   * @default true
   */
  exitOnLayer?: boolean

  /** Prevent user from changing popup state
   * @default false
   */
  preventUserInteractions?: boolean
}



interface ILayerProps {
  children: React.ReactNode | React.ReactNode[]
  className?: string

  /** Popup settings */
  settings?: IPopupSettings
}

interface IDialogProps {
  children: React.ReactNode | React.ReactNode[]
  className?: string

  /** Popup ID */
  id: string

  /** Out state */
  state?: boolean

  /** Out state setter */
  stateSetter?: (state: boolean) => void
}

interface ITriggerProps {
  children: React.ReactNode | React.ReactNode[]
  className?: string
  onClick?: () => void

  /** Popup ID */
  id: string
}



/** Popup layer */
export const Layer: React.FC<ILayerProps> = ({ children, settings, className }) => {
  settings = settings || {};

  settings.exitOnEscape = setDefault(settings.exitOnEscape, true);
  settings.hideScroll = setDefault(settings.hideScroll, true);
  settings.preventUserInteractions = setDefault(settings.preventUserInteractions, false);
  settings.exitOnLayer = setDefault(settings.exitOnLayer, true);

  return (
    <div className={`uvc-popup-layer ${className ? className : ''}`} data-uvc-settings={JSON.stringify(settings)} aria-hidden>
      {children}
    </div>
  );
};



/** Popup dialog */
export const Dialog: React.FC<IDialogProps> = ({ children, id, state, stateSetter, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);



  // State observer
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return console.warn(`[uvc-popup]: Dialog ${id} ref is not found`);

    const observer = new MutationObserver(e => {
      setIsOpen(dialog.classList.contains('uvc-popup-dialog--active'));
    });

    observer.observe(dialog, {
      attributes: true
    });
  }, []);

  // Handle events
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return console.warn(`[uvc-popup]: Dialog ${id} ref is not found`);

    const layer = dialog.closest('.uvc-popup-layer');
    if (!layer) return console.warn(`[uvc-popup]: Layer for dialog ${id} is not found`);

    const settings = JSON.parse(layer.getAttribute('data-uvc-settings') || '{}') as IPopupSettings;

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyboard);

    function handleKeyboard(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        if (!settings.exitOnEscape) return;

        if (!settings.preventUserInteractions) {
          dialog!.classList.remove('uvc-popup-dialog--active');
        } else {
          console.warn('[uvc-popup]: Action prevented');
        }
      }
    }

    function handleClick(e: MouseEvent) {
      const self = e.target as HTMLElement;

      if (!settings.exitOnLayer) return;
      if (!self.classList.contains('uvc-popup-layer')) return;

      if (!settings.preventUserInteractions) {
        dialog!.classList.remove('uvc-popup-dialog--active');
      } else {
        console.warn('[uvc-popup]: Action prevented');
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyboard);
      window.removeEventListener('click', handleClick);
    };
  }, [isOpen]);

  // State handling
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return console.warn(`[uvc-popup]: Dialog ${id} ref is not found`);

    const layer = dialog.closest('.uvc-popup-layer');
    const triggers = document.querySelectorAll(`[data-uvc-target="${id}"]`);
    if (!layer || !triggers.length) return console.warn(`[uvc-popup]: Layer or triggers for dialog ${id} is not found`);

    const settings = JSON.parse(layer.getAttribute('data-uvc-settings') || '{}') as IPopupSettings;

    if (isOpen) {
      //* Open

      layer.classList.add('uvc-popup-layer--active');
      layer.setAttribute('aria-hidden', 'false');
      dialog.setAttribute('aria-hidden', 'false');

      triggers.forEach(trigger => {
        trigger.classList.add('uvc-popup-trigger--active');
      });

      if (settings.hideScroll) toggleScroll(true);
    } else {
      //* Close

      layer.classList.remove('uvc-popup-layer--active');
      layer.setAttribute('aria-hidden', 'true');
      dialog.setAttribute('aria-hidden', 'true');

      triggers.forEach(trigger => {
        trigger.classList.remove('uvc-popup-trigger--active');
      });

      if (settings.hideScroll) toggleScroll(false);
    }
  }, [isOpen]);

  // Sync outer state
  useEffect(() => {
    if (stateSetter && state === undefined) stateSetter(isOpen);
  }, [isOpen]);

  // Sync inner state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return console.warn(`[uvc-popup]: Dialog ${id} ref is not found`);

    if (stateSetter && state !== undefined) {
      if (state) dialog.classList.add('uvc-popup-dialog--active');
      if (!state) dialog.classList.remove('uvc-popup-dialog--active');
    }
  }, [state]);



  return (
    <div className={`uvc-popup-dialog ${className ? className : ''}`} id={id} ref={dialogRef} role="dialog" aria-modal aria-hidden>
      {children}
    </div>
  );
};



//* Triggers changes dialog class > dialog observes change > dialog toggle trigger active class
/** Popup trigger */
export const Trigger: React.FC<ITriggerProps> = ({ children, id, className, onClick }) => {
  function toggle() {
    const dialog = document.querySelector(`#${id}`) as HTMLDivElement;
    if (!dialog) throw new Error(`[uvc-popup]: Dialog ${id} is not found`);

    const layer = dialog.closest('.uvc-popup-layer');
    if (!layer) throw new Error(`[uvc-popup]: Layer for dialog ${id} is not found`);

    const settings = JSON.parse(layer.getAttribute('data-uvc-settings') || '{}') as IPopupSettings;

    if (!settings.preventUserInteractions) {
      dialog.classList.toggle('uvc-popup-dialog--active');
    } else {
      console.warn('[uvc-popup]: Action prevented');
    }
  }

  return (
    <button className={`uvc-popup-trigger ${className ? className : ''}`} data-uvc-target={id} onClick={() => { toggle(); onClick ? onClick() : null }} aria-haspopup="dialog" tabIndex={0}>
      {children}
    </button>
  );
};




//* Handlers
// /** Toggle popup
//  * @param id Popup ID
//  * @param hide Specify toggle action
//  */
// export function togglePopup(id: string, hide?: boolean) {
//   const popup = document.querySelector(`#${id}`) as HTMLDivElement | undefined;
//   if (!popup) throw new Error(`[UVC-Popup]: Can not find popup with id #${id}`);

//   const layer = popup.closest('.uvc-popup-layer') as HTMLDivElement | undefined;
//   if (!layer) throw new Error(`[UVC-Popup]: Can not find layer for popup with id #${id}`);

//   const settings = JSON.parse(layer.getAttribute('data-uvc-popup-settings')!) as IPopupSettings;
//   const triggers = document.querySelectorAll(`[data-uvc-popup-target="${id}"]`);



//   // Define action
//   if (hide || popup.classList.contains('uvc-popup--active')) {
//     // Hide
//     popup.classList.remove('uvc-popup--active');
//     popup.setAttribute('aria-hidden', 'true');

//     triggers.forEach(trigger => {
//       trigger.classList.remove('uvc-popup-trigger--active');
//     });
//   } else {
//     // Show
//     popup.classList.add('uvc-popup--active');
//     popup.setAttribute('aria-hidden', 'false');

//     triggers.forEach(trigger => {
//       trigger.classList.add('uvc-popup-trigger--active');
//     });
//   }



//   // Toggle layer
//   let isLayerActive = false;

//   layer.childNodes.forEach(node => {
//     const child = node as HTMLDivElement;

//     if (child.classList.contains('uvc-popup--active')) isLayerActive = true;
//   });

//   if (isLayerActive) {
//     // Show
//     layer.classList.add('uvc-popup-layer--active');
//     layer.setAttribute('aria-hidden', 'true');

//     if (settings.scrollBehaivour === 'hide') toggleScroll(true, layer);
//   } else {
//     // Hide
//     layer.classList.remove('uvc-popup-layer--active');
//     layer.setAttribute('aria-hidden', 'false');

//     if (settings.scrollBehaivour === 'hide') toggleScroll(false, layer);
//   }
// }

/** Return current value if specified or default if not */
function setDefault(value: any, initial: any): any {
  return value === undefined ? initial : value
}

/** Hide scrollbar with saving scroll width
 * @param extendElement HTML element to extend. Default - document.body
 */
export function toggleScroll(hide: boolean, extendElement?: HTMLElement) {
  extendElement = extendElement || document.body;

  const offset = window.innerWidth - document.documentElement.clientWidth;

  if (hide) {
    document.body.style.overflowY = 'hidden';
    extendElement.style.paddingRight = `${offset}px`;
  } else {
    document.body.style.overflowY = 'visible';
    extendElement.style.paddingRight = '0';
  }
}

export function createUVCID() {
  return `uvc-${uuid.v4()}`;
}