import View, { ViewParams } from '../../../View';
import { QueryString } from '../../query/QueryString';
import ElementCreator, { ElementConfig } from '../../../../util/ElementCreator';
import './search-view.css';
import { route } from '../../../../router/router';

const CssClasses = {
  SEARCH_PRODUCT_CONTAINER: 'search-product-container',
  SEARCH_PRODUCT: 'search-product',
  SEARCH_IMAGE_CONTAINER: 'search-image-container',
  SEARCH_IMAGE: 'search-image',
  SEARCH_INPUT: 'search-input',
};

export class SearchProductView extends View {
  constructor(private queryString: QueryString) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClasses.SEARCH_PRODUCT_CONTAINER],
    };
    super(params);
    this.create();
  }

  public create(): void {
    this.addSearchBtn();
    this.addInputSearch();
  }

  private addSearchBtn(): void {
    const config: ElementConfig = {
      tag: 'button',
      classNames: [CssClasses.SEARCH_PRODUCT],
      placeholderText: 'Search product ',
      attributes: [{ name: 'href', value: '/catalog' }],
      callback: (event: Event): void => {
        this.searchBtnHandler(event);
      },
    };
    const searchBtn = new ElementCreator(config);

    const divParams: ViewParams = {
      tag: 'div',
      classNames: [CssClasses.SEARCH_IMAGE_CONTAINER],
    };
    const divContainer = new ElementCreator(divParams);

    const imgParams: ElementConfig = {
      tag: 'img',
      classNames: [CssClasses.SEARCH_IMAGE],
      attributes: [{ name: 'src', value: '../../../../assets/svg/search.svg' }],
    };
    const image = new ElementCreator(imgParams);
    divContainer.addInnerElement(image);
    searchBtn.addInnerElement(divContainer);

    this.viewElementCreator.addInnerElement(searchBtn);
  }

  private addInputSearch(): void {
    const config: ElementConfig = {
      tag: 'input',
      classNames: [CssClasses.SEARCH_INPUT],
      attributes: [
        { name: 'type', value: 'text' },
        { name: 'placeholder', value: 'Search product' },
      ],
    };
    const searchInput = new ElementCreator(config);
    const elem = searchInput.getElement() as HTMLInputElement;
    elem.value = this.queryString.getSearchText();
    this.viewElementCreator.addInnerElement(elem);
  }

  private searchBtnHandler(event: Event): void {
    const queryList = this.getLocationSearch();

    const searchInput = document.querySelector(`.${CssClasses.SEARCH_INPUT}`) as HTMLInputElement;
    if (searchInput.value.length > 0) {
      queryList.push(`search=${searchInput.value}`);
    }

    const element = document.querySelector(`.${CssClasses.SEARCH_PRODUCT}`);
    let queryStr: string = '';
    if (queryList.length > 0) {
      queryStr = `?${queryList.join('&')}`;
    }
    const newUrl = `${element?.getAttribute('href')}${queryStr}`;
    element?.setAttribute('href', newUrl);

    route(event as MouseEvent);
  }

  private getLocationSearch(): string[] {
    const search = decodeURIComponent(document.location.search.replace('?', ''));
    if (search.length > 0) {
      const queries = search.split('&').filter((val) => {
        return !val.includes('search');
      });
      return queries;
    }
    return [];
  }
}
