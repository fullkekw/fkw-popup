import React from "react";

export interface IPopupLayerProps extends React.DetailsHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[]
}

export interface IPopupDialogProps extends React.DetailsHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[]
  id: string
}

export interface IPopupButtonProps extends React.DetailsHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode | React.ReactNode[]
  togglePopupId: string

  onClick?: () => void
}