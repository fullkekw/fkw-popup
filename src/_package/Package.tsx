import './styles.scss';

import React, { useEffect, useRef, useState } from "react";
import cn from 'classnames';

import { CN, PopupButtonProps, PopupDialogProps, PopupLayerProps } from "./Interfaces";
import { EFKW } from '../components/handlers';







export const PopupLayer: React.FC<PopupLayerProps> = ({ children, className, exitOnEscape, exitOnLayer, setIsPopupsOpen, preventScrollHiding, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);

  exitOnEscape = exitOnEscape ?? true;
  exitOnLayer = exitOnLayer ?? true;


  // Init
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) throw new EFKW(`Layer ref is not found`);

    const dialogs = layer.querySelectorAll(`.${CN.DIALOG}`);
    if (!dialogs.length) throw new EFKW(`At least one dialog must be present inside PopupLayer`);
  }, []);

  // Observe mutations & handle click/keypress
  useEffect(() => {
    const layer = layerRef.current as HTMLDivElement;

    const observer = new MutationObserver(() => {
      const dialogs = layer.querySelectorAll(`.${CN.DIALOG}`);

      let isPopupActive = false;

      dialogs.forEach(dialog => {
        if (dialog.classList.contains(CN.DIALOG_ACTIVE)) isPopupActive = true;
      });

      setIsOpen(isPopupActive);
    });

    observer.observe(layer, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // Hadnle click/keypress
    layer.addEventListener('mousedown', e => {
      if (!exitOnLayer) return;

      const self = e.target as HTMLDivElement | undefined;
      if (!self) return;

      if (self.classList.contains(CN.LAYER)) closeAll();
    });

    window.addEventListener('keydown', e => {
      if (!exitOnEscape) return;

      const key = e.key;

      if (key === 'Escape') closeAll();
    });
  }, []);

  // Handle isOpen & setIsPopupsOpen
  useEffect(() => {
    if (!preventScrollHiding) {
      if (isOpen) {
        document.body.classList.add(CN.NOSCROLL);
      } else {
        document.body.classList.remove(CN.NOSCROLL);
      }
    }

    if (setIsPopupsOpen) setIsPopupsOpen(isOpen);
  }, [isOpen]);



  function closeAll() {
    const layer = layerRef.current as HTMLDivElement;
    const dialogs = layer.querySelectorAll(`.${CN.DIALOG}`);

    if (!layer.classList.contains(CN.LAYER_ACTIVE)) return;

    dialogs.forEach(el => {
      if (el.classList.contains(CN.DIALOG_ACTIONS_PREVENTED)) return;
      el.classList.add(CN.DIALOG_CLOSE);
    });
  }



  return <div className={cn(CN.LAYER, isOpen && CN.LAYER_ACTIVE, exitOnLayer && CN.LAYER_EXIT_ON_CLICK, className)} ref={layerRef} {...props}>
    {children}
  </div>;
};

export const PopupDialog: React.FC<PopupDialogProps> = ({ children, className, id, preventUserInteractions, state, stateSetter, animation, ...props }) => {
  animation = animation !== null ? animation ?? 'fade' : null;

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
      if (preventUserInteractions) return console.warn(`[fkw-popup]: User action prevented`);

      if (dialog.classList.contains(CN.DIALOG_OPEN)) {
        dialog.classList.remove(CN.DIALOG_OPEN);
        toggle(true);
      }

      if (dialog.classList.contains(CN.DIALOG_CLOSE)) {
        dialog.classList.remove(CN.DIALOG_CLOSE);
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



  return <div className={cn(CN.DIALOG, isOpen && CN.DIALOG_ACTIVE, preventUserInteractions && CN.DIALOG_ACTIONS_PREVENTED, animation && `${CN.DIALOG_ANIMATION_PREFIX}--${animation}`, className)} id={id} ref={dialogRef} role='dialog' aria-modal aria-hidden={!isOpen} {...props}>
    {children}
  </div>;
};

export const PopupButton: React.FC<PopupButtonProps> = ({ children, className, togglePopupId, disabled, onClick, as, ...props }) => {
  const Tag: keyof JSX.IntrinsicElements = as ?? 'button';

  function toggle() {
    if (disabled) return;

    togglePopup(togglePopupId);
    onClick ? onClick() : null;
  }

  return <Tag className={cn(CN.BUTTON, className)} onClick={toggle} aria-haspopup="dialog" tabIndex={0} data-fkw-popup-dialog={togglePopupId} disabled={disabled} aria-disabled={disabled} {...props}>
    {children}
  </Tag>;
};



function togglePopup(id: string) {
  const dialog = document.querySelector(`#${id}`) as HTMLDivElement;
  if (!dialog) throw new EFKW(`Dialog #${id} is not found in DOM`);

  if (dialog.classList.contains(CN.DIALOG_ACTIONS_PREVENTED)) return console.warn(`[fkw-popup]: User action prevented`);

  if (dialog.classList.contains(CN.DIALOG_ACTIVE)) {
    dialog.classList.add(CN.DIALOG_CLOSE);
  } else {
    dialog.classList.add(CN.DIALOG_OPEN);
  }
}