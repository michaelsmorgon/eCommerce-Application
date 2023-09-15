import ElementCreator, { ElementConfig } from '../../../util/ElementCreator';
import View, { ViewParams } from '../../View';
import './catalog-paginator.css';

const CssClasses = {
  PAGINATOR: 'paginator',
  PAGINATOR_BUTTON: 'paginator__button',
  PAGINATOR_PREV: 'paginator__prev',
  PAGINATOR_CURRENT: 'paginator__current',
  PAGINATOR_NEXT: 'paginator__next',
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
    this.addPrevBtn();
    this.addPageCounter();
    this.addNextBtn();
  }

  private addPrevBtn(): void {
    const paramConfig: ElementConfig = {
      tag: 'button',
      classNames: [CssClasses.PAGINATOR_BUTTON, CssClasses.PAGINATOR_PREV],
      attributes: [{ name: 'href', value: '/catalog' }],
      textContent: '<',
    };
    const prevBtn = new ElementCreator(paramConfig);
    this.viewElementCreator.addInnerElement(prevBtn);
  }

  private addPageCounter(): void {
    const paramConfig: ElementConfig = {
      tag: 'div',
      classNames: [CssClasses.PAGINATOR_BUTTON, CssClasses.PAGINATOR_CURRENT],
    };
    const pageNumberElem = new ElementCreator(paramConfig);
    this.viewElementCreator.addInnerElement(pageNumberElem);
  }

  private addNextBtn(): void {
    const nextBtnClasses: string[] = [CssClasses.PAGINATOR_BUTTON, CssClasses.PAGINATOR_NEXT];
    const paramConfig: ElementConfig = {
      tag: 'button',
      classNames: nextBtnClasses,
      attributes: [{ name: 'href', value: '/catalog' }],
      textContent: '>',
    };
    const nextBtn = new ElementCreator(paramConfig);
    this.viewElementCreator.addInnerElement(nextBtn);
  }
}
