import { ProductProjection } from '@commercetools/platform-sdk';
import { IProductSearch, ProductAPI } from '../../api/ProductAPI';
import { TokenCacheStore } from '../../api/TokenCacheStore';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import View, { ViewParams } from '../View';
import { CatalogCard } from './card/CatalogCard';
import './catalog-view.css';
import { SearchView } from './search/SearchView';
import { QueryString } from './query/QueryString';
import { CatalogHeaderView } from './header/CatalogHeaderView';
import { CatalogPaginatorView } from './paginator/CatalogPaginatorView';
import { CatalogPaginatorApp } from './paginator/CatalogPaginatorApp';

const CssClassesCatalog = {
  CATALOG_SECTION: 'catalog-section',
  CATALOG_SECTION_CONTAINER: 'catalog-section__container',
  CATALOG_SECTION_BODY: 'catalog-section__body',
};

export default class CatalogView extends View {
  private queryString: QueryString;

  constructor(private categoryId: string | null = null) {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClassesCatalog.CATALOG_SECTION],
    };
    super(params);
    this.queryString = new QueryString(decodeURIComponent(document.location.search.replace('?', '')));
    this.create();
  }

  public create(): void {
    this.addSearchContainer();
    this.addCatalogContainer();
  }

  private addSearchContainer(): void {
    const searchView = new SearchView(this.queryString);
    this.viewElementCreator.addInnerElement(searchView.getHtmlElement());
  }

  private addCatalogContainer(): void {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCatalog.CATALOG_SECTION_CONTAINER],
    };
    const catalogContainer = new ElementCreator(params);

    const catalogHeaderView = new CatalogHeaderView(this.queryString);
    catalogContainer.addInnerElement(catalogHeaderView.getHtmlElement());

    catalogContainer.addInnerElement(this.addCatalogBody());

    const catalogPaginatorView = new CatalogPaginatorView();
    catalogContainer.addInnerElement(catalogPaginatorView.getHtmlElement());

    this.viewElementCreator.addInnerElement(catalogContainer.getElement());

    setTimeout(() => {
      this.fillSectionBody();
    }, 0);
  }

  private addCatalogBody(): HTMLElement {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCatalog.CATALOG_SECTION_BODY],
    };
    const catalogContainer = new ElementCreator(params);
    return catalogContainer.getElement();
  }

  public fillSectionBody(offset: number = 0): void {
    const catalogSectionBody = document.querySelector(`.${CssClassesCatalog.CATALOG_SECTION_BODY}`);
    const tokenCacheStore = new TokenCacheStore();
    const products = new ProductAPI(tokenCacheStore);

    let filterQuery: string = '';
    if (this.categoryId) {
      filterQuery = `categories.id:subtree("${this.categoryId}")`;
    }

    const searchParams: IProductSearch = {
      filterSearch: this.queryString.getSearchList(),
      orderSearch: this.queryString.getSearchOrder(),
      searchText: this.queryString.getSearchText(),
      filterQuery,
      offset,
    };
    products
      .getProductsWithSearch(searchParams)
      .then((response) => {
        const totalProduct = response.body?.total ? Number(response.body?.total) : 0;
        const offsetProduct = response.body?.offset ? Number(response.body?.offset) : 0;
        const results = response.body?.results as ProductProjection[];
        results.forEach((product: ProductProjection) => {
          const catalogCard = new CatalogCard(product, product.key);
          catalogSectionBody?.appendChild(catalogCard.getHtmlElement());
        });
        const paginator = new CatalogPaginatorApp(totalProduct, offsetProduct, this.offsetCatalog);
        paginator.create();
      })
      .catch(() => {});
  }

  private offsetCatalog = (offset: number): void => {
    const parentNode = document.querySelector(`.catalog-section__body`) as HTMLDivElement;
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild);
    }
    const catalogSectionBody = document.querySelector(`.${CssClassesCatalog.CATALOG_SECTION_BODY}`);
    const tokenCacheStore = new TokenCacheStore();
    const products = new ProductAPI(tokenCacheStore);

    let filterQuery: string = '';
    if (this.categoryId) {
      filterQuery = `categories.id:subtree("${this.categoryId}")`;
    }

    const searchParams: IProductSearch = {
      filterSearch: this.queryString.getSearchList(),
      orderSearch: this.queryString.getSearchOrder(),
      searchText: this.queryString.getSearchText(),
      filterQuery,
      offset,
    };
    products
      .getProductsWithSearch(searchParams)
      .then((response) => {
        const totalProduct = response.body?.total ? Number(response.body?.total) : 0;
        const offsetProduct = response.body?.offset ? Number(response.body?.offset) : 0;
        const results = response.body?.results as ProductProjection[];
        results.forEach((product: ProductProjection) => {
          const catalogCard = new CatalogCard(product, product.key);
          catalogSectionBody?.appendChild(catalogCard.getHtmlElement());
        });
        const paginator = new CatalogPaginatorApp(totalProduct, offsetProduct, this.offsetCatalog);
        paginator.setPageNumeration();
      })
      .catch(() => {});
  };
}
