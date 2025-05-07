- [1.2.5](#125)
- [1.2.4](#124)

### 1.2.5
- Added ```as``` property in PopupButton to specify rendered tag
- Fixed overflow behaivour, html tag will no longer be hidden
- Fixed important specified touch-action for inner elements
- Expose classnames enum
- Renamed: 
  - IPopupButtonProps > PopupButtonProps 
  - IPopupLayerProps > PopupLayerProps 
  - IPopupDialogProps > PopupDialogProps 

### 1.2.4
**Added**:
- setIsPopupsOpen to LayerComponent, which defines if at least one popup dialog is open now
- Hide body scroll when popup is open (can be disabled via preventScrollHiding={true})

**Fixed**:
- Open layer set to all children elemens user-select: auto !important, instead of set it only to active childrens
- exitOnEscape and exitOnLayer does not work at all
- Programmatically changing state with preventUserInteractions throw user prevent warning and does nothing
- Specifying id via react useId hook throws an "Invalid selector" error