import React from "react";



/** Enum of package classes */
export enum CN {
  NOSCROLL = 'fkw-popup--noScroll',

  LAYER = 'fkw-popup-layer',
  LAYER_ACTIVE = 'fkw-popup-layer--active',
  LAYER_EXIT_ON_CLICK = 'fkw-popup-layer--exitOnLayer',

  DIALOG = 'fkw-popup-dialog',
  DIALOG_ACTIVE = 'fkw-popup-dialog--active',
  DIALOG_OPEN = 'fkw-popup-dialog--open',
  DIALOG_CLOSE = 'fkw-popup-dialog--close',
  DIALOG_ACTIONS_PREVENTED = 'fkw-popup-dialog--actionsPrevented',
  DIALOG_ANIMATION_PREFIX = 'fkw-popup-animation',

  BUTTON = 'fkw-popup-button',
  BUTTON_ACTIVE = 'fkw-popup-button--active',
}

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



/** @deprecated use PopupButtonProps instead */
export type IPopupButtonProps = PopupButtonProps;
/** @deprecated use PopupLayerProps instead */
export type IPopupLayerProps = PopupLayerProps;
/** @deprecated use PopupDialogProps instead */
export type IPopupDialogProps = PopupDialogProps;