- [1.2.4](#124)

### 1.2.4
Fixed:
- Open layer set to all children elemens user-select: auto !important, instead of set it only to active childrens
- exitOnEscape and exitOnLayer does not work at all
- Programmatically changing state with preventUserInteractions throw user prevent warning and does nothing\

Added:
- setIsPopupsOpen to LayerComponent, which defines if at least one popup dialog is open now