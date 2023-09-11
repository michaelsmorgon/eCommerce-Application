import View, { ViewParams } from '../../View';
import './catalog-paginator.css';

const CssClasses = {
  PAGINATOR: 'paginator',
  PAGINATOR_BUTTON: 'paginator__button',
  PAGINATOR_TO_START: 'paginator__to-start',
  PAGINATOR_PREV: 'paginator__prev',
  PAGINATOR_CURRENT: 'paginator__current',
  PAGINATOR_NEXT: 'paginator__next',
  PAGINATOR_TO_FINISH: 'paginator__to-finish',
  PAGINATOR_DISABLED: 'paginator__disabled',
  PAGINATOR_ARROW: 'paginator_arrow',
  PAGINATOR_NUMBER: 'paginator__number',
};

export class CatalogPaginatorView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClasses.PAGINATOR],
    };
    super(params);
    this.create();
  }

  public create(): void {
    
  }
}
