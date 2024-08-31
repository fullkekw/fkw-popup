import React, { useState, useEffect, useRef, HTMLProps } from "react";

import '../styles/popup.scss';

export interface IPopupSettings {
  /** Hide body scroll when popup isactive
   * @default true
   */
  hideScroll?: boolean

  /** Close popup on escape
   * @default true
   */
  exitOnEscape?: boolean

  /** Close popup by clicking on the layer
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
    <div className={`fkw-popup-layer ${className ? className : ''}`} data-fkw-settings={JSON.stringify(settings)} aria-hidden style={{ cursor: settings.exitOnLayer ? 'pointer' : 'auto' }} tabIndex={settings.exitOnLayer ? 0 : -1}>
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

    if (!dialog) return console.warn(`[fkw-popup]: Dialog ${id} ref is not found`);

    const observer = new MutationObserver(e => {
      setIsOpen(dialog.classList.contains('fkw-popup-dialog--active'));
    });

    observer.observe(dialog, {
      attributes: true
    });

    const triggersInside = dialog.querySelectorAll('.fkw-popup-trigger');

    triggersInside.forEach(el => {
      el.classList.add('fkw-prevent_hideIndexes');
    });
  }, []);

  // Handle events
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return console.warn(`[fkw-popup]: Dialog ${id} ref is not found`);

    const layer = dialog.closest('.fkw-popup-layer');
    if (!layer) return console.warn(`[fkw-popup]: Layer for dialog ${id} is not found`);

    const settings = JSON.parse(layer.getAttribute('data-fkw-settings') || '{}') as IPopupSettings;

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyboard);

    function handleKeyboard(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        if (!settings.exitOnEscape) return;

        if (!settings.preventUserInteractions) {
          dialog!.classList.remove('fkw-popup-dialog--active');
        } else {
          console.warn('[fkw-popup]: Action prevented');
        }
      }
    }

    function handleClick(e: MouseEvent) {
      const self = e.target as HTMLElement;

      if (!settings.exitOnLayer) return;
      if (!self.classList.contains('fkw-popup-layer')) return;

      if (!settings.preventUserInteractions) {
        dialog!.classList.remove('fkw-popup-dialog--active');
      } else {
        console.warn('[fkw-popup]: Action prevented');
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
    if (!dialog) return console.warn(`[fkw-popup]: Dialog ${id} ref is not found`);

    const layer = dialog.closest('.fkw-popup-layer') as HTMLDivElement;
    const triggers = document.querySelectorAll(`[data-fkw-target="${id}"]`);
    if (!layer || !triggers.length) return console.warn(`[fkw-popup]: Layer or triggers for dialog ${id} is not found`);

    const settings = JSON.parse(layer.getAttribute('data-fkw-settings') || '{}') as IPopupSettings;

    if (isOpen) {
      //* Open

      hideTabIndexes('fkw-prevent_hideIndexes');



      layer.classList.add('fkw-popup-layer--active');
      layer.setAttribute('aria-hidden', 'false');
      dialog.setAttribute('aria-hidden', 'false');

      triggers.forEach(trigger => {
        trigger.classList.add('fkw-popup-trigger--active');
      });

      if (settings.hideScroll) toggleScroll(true);
    } else {
      //* Close

      showTabIndexes();

      layer.classList.remove('fkw-popup-layer--active');
      layer.setAttribute('aria-hidden', 'true');
      dialog.setAttribute('aria-hidden', 'true');

      triggers.forEach(trigger => {
        trigger.classList.remove('fkw-popup-trigger--active');
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
    if (!dialog) return console.warn(`[fkw-popup]: Dialog ${id} ref is not found`);

    if (stateSetter && state !== undefined) {
      if (state) dialog.classList.add('fkw-popup-dialog--active');
      if (!state) dialog.classList.remove('fkw-popup-dialog--active');
    }
  }, [state]);



  return (
    <div className={`fkw-popup-dialog ${className ? className : ''} fkw-prevent_hideIndexes`} id={id} ref={dialogRef} role="dialog" aria-modal aria-hidden>
      {children}
    </div>
  );
};



//* Triggers changes dialog class > dialog observes change > dialog toggle trigger active class
/** Popup trigger. Already returning button element, nesting anither one can cause Hydration error in Next.JS */
export const Trigger: React.FC<ITriggerProps> = ({ children, id, className, onClick }) => {
  function toggle() {
    const dialog = document.querySelector(`#${id}`) as HTMLDivElement;
    if (!dialog) throw new Error(`[fkw-popup]: Dialog ${id} is not found`);

    const layer = dialog.closest('.fkw-popup-layer');
    if (!layer) throw new Error(`[fkw-popup]: Layer for dialog ${id} is not found`);

    const settings = JSON.parse(layer.getAttribute('data-fkw-settings') || '{}') as IPopupSettings;

    if (!settings.preventUserInteractions) {
      dialog.classList.toggle('fkw-popup-dialog--active');
    } else {
      console.warn('[fkw-popup]: Action prevented');
    }
  }

  return (
    <button className={`fkw-popup-trigger ${className ? className : ''}`} data-fkw-target={id} onClick={() => { toggle(); onClick ? onClick() : null; }} aria-haspopup="dialog" tabIndex={0}>
      {children}
    </button>
  );
};




//* Handlers
/** Return current value if specified or default if not */
function setDefault(value: any, initial: any): any {
  return value === undefined ? initial : value;
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

/** Hide tab indexes 
 * @param except Class that this function will pass. Will except fkw-prevent_hideIndexes by default
*/
export function hideTabIndexes(except?: string) {
  const elements: HTMLElement[] = [];

  (document.querySelectorAll('[tabindex]') as NodeListOf<HTMLElement>).forEach(el => el.classList.contains(except || 'fkw-prevent_hideIndexes') || el.classList.contains('fkw-prevent_hideIndexes') ? null : elements.push(el));

  elements.forEach(el => {
    el.setAttribute('fkw-prevTabIndex', el.getAttribute('tabindex')!);
    el.setAttribute('tabindex', '-1');
  });
}

/** Return tab indexes */
export function showTabIndexes() {
  (document.querySelectorAll('[fkw-prevTabIndex]') as NodeListOf<HTMLElement>).forEach(el => {
    el.setAttribute('tabindex', el.getAttribute('fkw-prevTabIndex')!);
    el.removeAttribute('fkw-prevTabIndex');
  });
}