import React from "react";



export interface IPopupLayerProps extends React.DetailsHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[]

  /** Close popup by pressing Escape
   * @default true
   */
  exitOnEscape?: boolean

  /** Close popup by clicking on the layer
   * @default true
   */
  exitOnLayer?: boolean
}

export interface IPopupDialogProps extends React.DetailsHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[]
  id: string

  /** Prevent user from toggling popup */
  preventUserInteractions?: boolean
}

export interface IPopupButtonProps extends React.DetailsHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode | React.ReactNode[]
  togglePopupId: string

  disabled?: boolean
  onClick?: () => void
}