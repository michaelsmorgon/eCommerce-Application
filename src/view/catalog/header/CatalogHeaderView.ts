import View, { ViewParams } from '../../View';
import { QueryString } from '../query/QueryString';
import './catalog-header-view.css';
import ElementCreator, { ElementConfig } from '../../../util/ElementCreator';
import { route } from '../../../router/router';

const CssClasses = {
  SORT_CONTAINER: 'sort-container',
  LINK_CONTAINER: 'link-container',
  ORDER_PRICE: 'order-price',
  ORDER_TITLE: 'order-title',
  ORDER_LOW: 'order-low',
  ORDER_HIGH: 'order-high',
};

const orderList = [
  { class: CssClasses.ORDER_PRICE, title: 'Price' },
  { class: CssClasses.ORDER_TITLE, title: 'Title' },
];

export class CatalogHeaderView extends View {
  constructor(private queryString: QueryString) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClasses.SORT_CONTAINER],
    };
    super(params);
    this.create();
  }

  public create(): void {
    this.addTitle();
    this.addOrderFields();
    this.addSearchField();
  }

  private addTitle(): void {
    const inputParams = {
      tag: 'label',
      classNames: [],
      textContent: 'Sort: ',
    };
    const creatorInput = new ElementCreator(inputParams);
    this.viewElementCreator.addInnerElement(creatorInput);
  }

  private addOrderFields(): void {
    orderList.forEach((order) => {
      const inputParams: ViewParams = {
        tag: 'div',
        classNames: [CssClasses.LINK_CONTAINER],
      };
      const linkContainer = new ElementCreator(inputParams);

      const paramConfig: ElementConfig = {
        tag: 'a',
        classNames: this.getOrderClasses(order.class),
        textContent: order.title,
        attributes: [
          { name: 'href', value: '/catalog' },
          { name: 'id', value: order.class },
        ],
        callback: (event: Event): void => {
          this.orderBtnHandler(event);
        },
      };
      const link = new ElementCreator(paramConfig);
      linkContainer.addInnerElement(link);
      this.viewElementCreator.addInnerElement(linkContainer);
    });
  }

  private getOrderClasses(className: string): string[] {
    const orderSearch = this.queryString.getOrder();
    switch (className) {
      case CssClasses.ORDER_TITLE:
        if (orderSearch === 'tl') {
          return [CssClasses.ORDER_TITLE, CssClasses.ORDER_LOW];
        }
        if (orderSearch === 'th') {
          return [CssClasses.ORDER_TITLE, CssClasses.ORDER_HIGH];
        }
        return [CssClasses.ORDER_TITLE];
      case CssClasses.ORDER_PRICE:
        if (orderSearch === 'pl') {
          return [CssClasses.ORDER_PRICE, CssClasses.ORDER_LOW];
        }
        if (orderSearch === 'ph') {
          return [CssClasses.ORDER_PRICE, CssClasses.ORDER_HIGH];
        }
        return [CssClasses.ORDER_PRICE];
      default:
        return [];
    }
  }

  private orderBtnHandler(event: Event): void {
    const elem = event.target as HTMLElement;
    const search = this.getLocationSearch();
    if (elem.classList.contains(CssClasses.ORDER_PRICE)) {
      if (elem.classList.contains('order-low')) {
        search.push('order=ph');
      } else if (!elem.classList.contains('order-high')) {
        search.push('order=pl');
      }
      this.setUrl(CssClasses.ORDER_PRICE, search);
    } else if (elem.classList.contains(CssClasses.ORDER_TITLE)) {
      if (elem.classList.contains('order-low')) {
        search.push('order=th');
      } else if (!elem.classList.contains('order-high')) {
        search.push('order=tl');
      }
      this.setUrl(CssClasses.ORDER_TITLE, search);
    }
    route(event as MouseEvent);
  }

  private setUrl(className: string, queryList: string[]): void {
    const element = document.querySelector(`.${className}`);
    let queryStr: string = '';
    if (queryList.length > 0) {
      queryStr = `?${queryList.join('&')}`;
    }
    const newUrl = `${element?.getAttribute('href')}${queryStr}`;
    element?.setAttribute('href', newUrl);
  }

  private getLocationSearch(): string[] {
    let search = decodeURIComponent(document.location.search.replace('?', ''));
    search = search.replace('&order=ph', '');
    search = search.replace('order=ph', '');
    search = search.replace('&order=pl', '');
    search = search.replace('order=pl', '');
    search = search.replace('&order=th', '');
    search = search.replace('order=th', '');
    search = search.replace('&order=tl', '');
    search = search.replace('order=tl', '');
    return search.split('&');
  }

  private addSearchField(): void {}
}
