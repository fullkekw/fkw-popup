import './styles.scss';

import React, { useEffect, useRef, useState } from "react";
import cn from 'classnames';

import { IPopupButtonProps, IPopupDialogProps, IPopupLayerProps } from "./Interfaces";
import { EFKW } from '../components/handlers';



export const PopupLayer: React.FC<IPopupLayerProps> = ({ children, className, exitOnEscape, exitOnLayer, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);

  exitOnEscape = exitOnEscape ?? true;
  exitOnLayer = exitOnLayer ?? true;


  // Init
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) throw new EFKW(`Layer ref is not found`);

    const dialogs = layer.querySelectorAll(`.fkw-popup-dialog`);
    if (!dialogs.length) throw new EFKW(`At least one dialog must be present inside PopupLayer`);
  }, []);

  // Observe mutations & handle click/keypress
  useEffect(() => {
    const layer = layerRef.current as HTMLDivElement;

    const observer = new MutationObserver(() => {
      const dialogs = layer.querySelectorAll(`.fkw-popup-dialog`);

      let isPopupActive = false;

      dialogs.forEach(dialog => {
        if (dialog.classList.contains('fkw-popup-dialog--active') && !dialog.classList.contains('fkw-popup-dialog--actionsPrevented')) isPopupActive = true;
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

      if (self.classList.contains('fkw-popup-layer')) closeAll();
    });

    window.addEventListener('keydown', e => {
      const key = e.key;

      if (key === 'Escape') closeAll();
    });
  }, []);

  useEffect(() => {
    console.log(`layer - `, isOpen);
  }, [isOpen]);



  function closeAll() {
    const layer = layerRef.current as HTMLDivElement;
    const dialogs = layer.querySelectorAll(`.fkw-popup-dialog`);

    if (!layer.classList.contains('fkw-popup-layer--active')) return;

    dialogs.forEach(el => {
      if (el.classList.contains('fkw-popup-dialog--actionsPrevented')) return;
      el.classList.add('fkw-popup-dialog--close');
    });
  }



  return <div className={cn("fkw-popup-layer", isOpen && 'fkw-popup-layer--active', exitOnLayer && 'fkw-popup-layer--exitOnLayer', className)} ref={layerRef} {...props}>
    {children}
  </div>;
};

export const PopupDialog: React.FC<IPopupDialogProps> = ({ children, className, id, preventUserInteractions, ...props }) => {
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

      if (dialog.classList.contains('fkw-popup-dialog--open')) {
        dialog.classList.remove('fkw-popup-dialog--open');
        toggle(true);
      }

      if (dialog.classList.contains('fkw-popup-dialog--close')) {
        dialog.classList.remove('fkw-popup-dialog--close');
        toggle(false);
      }
    });

    observer.observe(dialog, {
      attributes: true
    });
  }, []);

  useEffect(() => {
    console.log(`dialog - `, isOpen);
  }, [isOpen]);



  function toggle(forceState?: boolean) {
    const to = forceState ?? !isOpen;

    setIsOpen(to);
  }



  return <div className={cn("fkw-popup-dialog", isOpen && 'fkw-popup-dialog--active', preventUserInteractions && 'fkw-popup-dialog--actionsPrevented', className)} id={id} ref={dialogRef} role='dialog' aria-modal aria-hidden={!isOpen} {...props}>
    {children}
  </div>;
};

export const PopupButton: React.FC<IPopupButtonProps> = ({ children, className, togglePopupId, disabled, onClick, ...props }) => {
  function toggle() {
    if (disabled) return;

    togglePopup(togglePopupId);
    onClick ? onClick() : null;
  }

  return <button className={cn("fkw-popup-button", className)} onClick={toggle} aria-haspopup="dialog" tabIndex={0} data-fkw-popup-dialog={togglePopupId} disabled={disabled} {...props}>
    {children}
  </button>;
};



function togglePopup(id: string) {
  const dialog = document.querySelector(`#${id}`) as HTMLDivElement;
  if (!dialog) throw new EFKW(`Dialog #${id} is not found in DOM`);

  if (dialog.classList.contains('fkw-popup-dialog--actionsPrevented')) return console.warn(`[fkw-popup]: User action prevented`);

  if (dialog.classList.contains('fkw-popup-dialog--active')) {
    dialog.classList.add(`fkw-popup-dialog--close`);
  } else {
    dialog.classList.add(`fkw-popup-dialog--open`);
  }
}