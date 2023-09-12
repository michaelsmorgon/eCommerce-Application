import { route } from '../../../router/router';
import ElementCreator, { ElementConfig } from '../../../util/ElementCreator';
import View, { ViewParams } from '../../View';
import './catalog-paginator.css';

const CssClasses = {
  PAGINATOR: 'paginator',
  PAGINATOR_BUTTON: 'paginator__button',
  PAGINATOR_PREV: 'paginator__prev',
  PAGINATOR_CURRENT: 'paginator__current',
  PAGINATOR_NEXT: 'paginator__next',
  PAGINATOR_DISABLED: 'paginator__disabled',
  PAGINATOR_ARROW: 'paginator_arrow',
  PAGINATOR_NUMBER: 'paginator__number',
};

export class CatalogPaginatorView extends View {
  private LIMIT = 6;

  private currentPage: number = 1;

  private totalPages: number = 1;

  constructor(
    private offsetProduct: number,
    private totalProduct: number
  ) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClasses.PAGINATOR],
    };
    super(params);
    this.create();
  }

  public create(): void {
    this.totalPages = Math.ceil(this.totalProduct / this.LIMIT);
    this.currentPage = this.offsetProduct / this.LIMIT + 1;
    this.addPrevBtn();
    this.addPageCounter();
    this.addNextBtn();
  }

  private addPrevBtn(): void {
    const prevBtnClasses: string[] = [CssClasses.PAGINATOR_BUTTON, CssClasses.PAGINATOR_PREV];
    let paramConfig: ElementConfig;
    if (this.currentPage === 1) {
      prevBtnClasses.push(CssClasses.PAGINATOR_DISABLED);
      paramConfig = {
        tag: 'button',
        classNames: prevBtnClasses,
        attributes: [{ name: 'href', value: '/catalog' }],
        textContent: '<',
      };
    } else {
      paramConfig = {
        tag: 'button',
        classNames: prevBtnClasses,
        attributes: [{ name: 'href', value: '/catalog' }],
        textContent: '<',
        callback: (event: Event): void => {
          const pages = document.querySelector(`.${CssClasses.PAGINATOR_CURRENT}`) as HTMLDivElement;
          const res = pages?.textContent?.split('/');
          if (res?.length && res?.length > 0) {
            const queryList = this.getLocationSearch();
            queryList.push(`offset=${(+res[0] - 2) * this.LIMIT}`);
            const element = document.querySelector(`.${CssClasses.PAGINATOR_PREV}`);
            let queryStr: string = '';
            if (queryList.length > 0) {
              queryStr = `?${queryList.join('&')}`;
            }
            const newUrl = `${element?.getAttribute('href')}${queryStr}`;
            element?.setAttribute('href', newUrl);

            route(event as MouseEvent);
          }
        },
      };
    }

    const prevBtn = new ElementCreator(paramConfig);
    this.viewElementCreator.addInnerElement(prevBtn);
  }

  private addPageCounter(): void {
    const paramConfig: ElementConfig = {
      tag: 'div',
      classNames: [CssClasses.PAGINATOR_BUTTON, CssClasses.PAGINATOR_CURRENT],
      textContent: `${this.currentPage} / ${this.totalPages}`,
    };
    const pageNumberElem = new ElementCreator(paramConfig);
    this.viewElementCreator.addInnerElement(pageNumberElem);
  }

  private addNextBtn(): void {
    const nextBtnClasses: string[] = [CssClasses.PAGINATOR_BUTTON, CssClasses.PAGINATOR_NEXT];
    let paramConfig: ElementConfig;
    if (this.currentPage === this.totalPages) {
      nextBtnClasses.push(CssClasses.PAGINATOR_DISABLED);
      paramConfig = {
        tag: 'button',
        classNames: nextBtnClasses,
        attributes: [{ name: 'href', value: '/catalog' }],
        textContent: '>',
      };
    } else {
      paramConfig = {
        tag: 'button',
        classNames: nextBtnClasses,
        attributes: [{ name: 'href', value: '/catalog' }],
        textContent: '>',
        callback: (event: Event): void => {
          const pages = document.querySelector(`.${CssClasses.PAGINATOR_CURRENT}`) as HTMLDivElement;
          const res = pages?.textContent?.split('/');
          if (res?.length && res?.length > 0) {
            const queryList = this.getLocationSearch();
            queryList.push(`offset=${+res[0] * this.LIMIT}`);
            const element = document.querySelector(`.${CssClasses.PAGINATOR_NEXT}`);
            let queryStr: string = '';
            if (queryList.length > 0) {
              queryStr = `?${queryList.join('&')}`;
            }
            const newUrl = `${element?.getAttribute('href')}${queryStr}`;
            element?.setAttribute('href', newUrl);

            route(event as MouseEvent);
          }
        },
      };
    }

    const nextBtn = new ElementCreator(paramConfig);
    this.viewElementCreator.addInnerElement(nextBtn);
  }

  private getLocationSearch(): string[] {
    const search = decodeURIComponent(document.location.search.replace('?', ''));
    if (search.length > 0) {
      const queries = search.split('&').filter((val) => {
        return !val.includes('offset');
      });
      return queries;
    }
    return [];
  }
}
