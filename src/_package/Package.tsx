import './styles.scss';

import React, { useEffect, useRef, useState } from "react";
import cn from 'classnames';

import { IPopupButtonProps, IPopupDialogProps, IPopupLayerProps } from "./Interfaces";
import { EFKW } from '../components/handlers';



export const PopupLayer: React.FC<IPopupLayerProps> = ({ children, className, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);


  // Init
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) throw new EFKW(`Layer ref is not found`);

    const dialogs = layer.querySelectorAll(`.fkw-popup-dialog`);
    if (!dialogs.length) throw new EFKW(`At least one dialog must be present inside PopupLayer`);
  }, []);

  // Observe mutations
  useEffect(() => {
    const layer = layerRef.current as HTMLDivElement;

    const observer = new MutationObserver(() => {
      const dialogs = layer.querySelectorAll(`.fkw-popup-dialog`);

      let isPopupActive = false;

      dialogs.forEach(dialog => {
        if (dialog.classList.contains('fkw-popup-dialog--active')) isPopupActive = true;
      });

      setIsOpen(isPopupActive);
    });

    observer.observe(layer, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }, []);

  useEffect(() => {
    console.log(`layer - `, isOpen);
  }, [isOpen]);



  return <div className={cn("fkw-popup-layer", isOpen && 'fkw-popup-layer--active', className)} ref={layerRef} {...props}>
    {children}
  </div>;
};

export const PopupDialog: React.FC<IPopupDialogProps> = ({ children, className, id, ...props }) => {
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

    const observer = new MutationObserver(() => {
      if (dialog.classList.contains('fkw-popup-dialog--active')) {
        toggle(true);
      } else {
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



  return <div className={cn("fkw-popup-dialog", className)} id={id} ref={dialogRef} role='dialog' aria-modal aria-hidden={!isOpen} {...props}>
    {children}
  </div>;
};

export const PopupButton: React.FC<IPopupButtonProps> = ({ children, className, togglePopupId, ...props }) => {
  return <button className={cn("fkw-popup-button", className)} onClick={() => togglePopup(togglePopupId)} aria-haspopup="dialog" tabIndex={0} data-fkw-popup-dialog={togglePopupId} {...props}>
    {children}
  </button>;
};



function togglePopup(id: string) {
  const dialog = document.querySelector(`#${id}`) as HTMLDivElement;
  if (!dialog) throw new EFKW(`Dialog #${id} is not found in DOM`);

  dialog.classList.toggle(`fkw-popup-dialog--active`);
}