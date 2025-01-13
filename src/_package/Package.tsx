import './styles.scss';

import React, { useEffect, useRef, useState } from "react";
import cn from 'classnames';

import { IPopupButtonProps, IPopupDialogProps, IPopupLayerProps } from "./Interfaces";
import { EFKW } from '../components/handlers';



enum CLASS {
  LAYER = 'fkw-popup-layer',
  LAYER_ACTIVE = 'fkw-popup-layer--active',
  LAYER_EXIT_ON_CLICK = 'fkw-popup-layer--exitOnLayer',

  DIALOG = 'fkw-popup-dialog',
  DIALOG_ACTIVE = 'fkw-popup-dialog--active',
  DIALOG_OPEN = 'fkw-popup-dialog--open',
  DIALOG_CLOSE = 'fkw-popup-dialog--close',
  DIALOG_ACTIONS_PREVENTED = 'fkw-popup-dialog--actionsPrevented',

  BUTTON = 'fkw-popup-button',
  BUTTON_ACTIVE = 'fkw-popup-button--active',
}



export const PopupLayer: React.FC<IPopupLayerProps> = ({ children, className, exitOnEscape, exitOnLayer, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);

  exitOnEscape = exitOnEscape ?? true;
  exitOnLayer = exitOnLayer ?? true;


  // Init
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) throw new EFKW(`Layer ref is not found`);

    const dialogs = layer.querySelectorAll(`.${CLASS.DIALOG}`);
    if (!dialogs.length) throw new EFKW(`At least one dialog must be present inside PopupLayer`);
  }, []);

  // Observe mutations & handle click/keypress
  useEffect(() => {
    const layer = layerRef.current as HTMLDivElement;

    const observer = new MutationObserver(() => {
      const dialogs = layer.querySelectorAll(`.${CLASS.DIALOG}`);

      let isPopupActive = false;

      dialogs.forEach(dialog => {
        if (dialog.classList.contains(CLASS.DIALOG_ACTIVE) && !dialog.classList.contains(CLASS.DIALOG_ACTIONS_PREVENTED)) isPopupActive = true;
      });

      setIsOpen(isPopupActive);
    });

    observer.observe(layer, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // Hadnle click/keypress
    layer.addEventListener('click', e => {
      const self = e.target as HTMLDivElement | undefined;
      if (!self) return;

      if (self.classList.contains(CLASS.LAYER)) closeAll();
    });

    window.addEventListener('keydown', e => {
      const key = e.key;

      if (key === 'Escape') closeAll();
    });
  }, []);



  function closeAll() {
    const layer = layerRef.current as HTMLDivElement;
    const dialogs = layer.querySelectorAll(`.${CLASS.DIALOG}`);

    if (!layer.classList.contains(CLASS.LAYER_ACTIVE)) return;

    dialogs.forEach(el => {
      if (el.classList.contains(CLASS.DIALOG_ACTIONS_PREVENTED)) return;
      el.classList.add(CLASS.DIALOG_CLOSE);
    });
  }



  return <div className={cn(CLASS.LAYER, isOpen && CLASS.LAYER_ACTIVE, exitOnLayer && CLASS.LAYER_EXIT_ON_CLICK, className)} ref={layerRef} {...props}>
    {children}
  </div>;
};

export const PopupDialog: React.FC<IPopupDialogProps> = ({ children, className, id, preventUserInteractions, state, stateSetter, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);



  // Init
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) throw new EFKW(`Dialog ref is not found`);
  }, []);

  // Observe mutations
  useEffect(() => {
    const dialog = dialogRef.current as HTMLDivElement;

    const observer = new MutationObserver(mutations => {
      if (preventUserInteractions) return console.warn(`[fkw-popup]: User action prevented`);

      if (dialog.classList.contains(CLASS.DIALOG_OPEN)) {
        dialog.classList.remove(CLASS.DIALOG_OPEN);
        toggle(true);
      }

      if (dialog.classList.contains(CLASS.DIALOG_CLOSE)) {
        dialog.classList.remove(CLASS.DIALOG_CLOSE);
        toggle(false);
      }
    });

    observer.observe(dialog, {
      attributes: true
    });
  }, []);

  // Handle isOpen
  useEffect(() => {
    const buttons = document.querySelectorAll(`[data-fkw-popup-dialog="${id}"]`);

    buttons.forEach(button => {
      if (isOpen) {
        button.classList.add('fkw-popup-button--active');
      } else {
        button.classList.remove('fkw-popup-button--active');
      }
    });
  }, [isOpen]);

  //* Sync inner state when out changed
  useEffect(() => {
    if (state === undefined) return;

    setIsOpen(state);
  }, [state]);



  function toggle(forceState?: boolean) {
    const to = forceState ?? !isOpen;

    if (stateSetter !== undefined && state !== undefined) {
      //* Sync only out state with inner
      stateSetter(to);
    } else if (stateSetter !== undefined && state === undefined) {
      //* Sync both states
      stateSetter(to);
      setIsOpen(to);
    } else {
      //* Sync only inner state with out
      setIsOpen(to);
    }
  }



  return <div className={cn(CLASS.DIALOG, isOpen && CLASS.DIALOG_ACTIVE, preventUserInteractions && CLASS.DIALOG_ACTIONS_PREVENTED, className)} id={id} ref={dialogRef} role='dialog' aria-modal aria-hidden={!isOpen} {...props}>
    {children}
  </div>;
};

export const PopupButton: React.FC<IPopupButtonProps> = ({ children, className, togglePopupId, disabled, onClick, ...props }) => {
  function toggle() {
    if (disabled) return;

    togglePopup(togglePopupId);
    onClick ? onClick() : null;
  }

  return <button className={cn(CLASS.BUTTON, className)} onClick={toggle} aria-haspopup="dialog" tabIndex={0} data-fkw-popup-dialog={togglePopupId} disabled={disabled} {...props}>
    {children}
  </button>;
};



function togglePopup(id: string) {
  const dialog = document.querySelector(`#${id}`) as HTMLDivElement;
  if (!dialog) throw new EFKW(`Dialog #${id} is not found in DOM`);

  if (dialog.classList.contains(CLASS.DIALOG_ACTIONS_PREVENTED)) return console.warn(`[fkw-popup]: User action prevented`);

  if (dialog.classList.contains(CLASS.DIALOG_ACTIVE)) {
    dialog.classList.add(CLASS.DIALOG_CLOSE);
  } else {
    dialog.classList.add(CLASS.DIALOG_OPEN);
  }
}