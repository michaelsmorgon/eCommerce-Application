import ElementCreator, { ElementConfig } from '../../../../util/ElementCreator';
import View, { ViewParams } from '../../../View';
import { QueryString } from '../../query/QueryString';
import './price-view.css';

export const CssClassesPrice = {
  PRICE_CONTAINER: 'price-container',
  PRICE_TITLE: 'price-title',
  PRICE_PREPEND: 'price-text',
  PRICE_SEARCH: 'price-search',
  PRICE_FROM: 'price-from',
  PRICE_TO: 'price-to',
};

const PRICE_TITLE = 'Price, USD';

export class PriceView extends View {
  constructor(private queryString: QueryString) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesPrice.PRICE_CONTAINER],
    };
    super(params);
    this.create();
  }

  public create(): void {
    this.addTitle();
    this.addSearch();
  }

  private addTitle(): void {
    const params: ElementConfig = {
      tag: 'h3',
      classNames: [CssClassesPrice.PRICE_TITLE],
      textContent: PRICE_TITLE,
    };
    const title = new ElementCreator(params);
    this.viewElementCreator.addInnerElement(title.getElement());
  }

  private addSearch(): void {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesPrice.PRICE_SEARCH],
    };
    const search = new ElementCreator(params);

    const priceFrom = this.queryString.getPriceFrom();
    const priceFromElem = this.addFromField().getElement() as HTMLInputElement;
    priceFromElem.value = priceFrom ? `${priceFrom}` : '';
    search.addInnerElement(priceFromElem);

    search.addInnerElement(this.addText(' - '));

    const priceTo = this.queryString.getPriceTo();
    const priceToElem = this.addToField().getElement() as HTMLInputElement;
    priceToElem.value = priceTo ? `${priceTo}` : '';
    search.addInnerElement(priceToElem);
    this.viewElementCreator.addInnerElement(search.getElement());
  }

  private addText(text: string): ElementCreator {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesPrice.PRICE_PREPEND],
      textContent: text,
    };
    return new ElementCreator(params);
  }

  private addFromField(): ElementCreator {
    const params: ElementConfig = {
      tag: 'input',
      classNames: [CssClassesPrice.PRICE_FROM],
      attributes: [
        { name: 'placeholder', value: 'From' },
        { name: 'type', value: 'number' },
      ],
    };
    return new ElementCreator(params);
  }

  private addToField(): ElementCreator {
    const params: ElementConfig = {
      tag: 'input',
      classNames: [CssClassesPrice.PRICE_TO],
      attributes: [
        { name: 'placeholder', value: 'To' },
        { name: 'type', value: 'number' },
      ],
    };
    return new ElementCreator(params);
  }
}
