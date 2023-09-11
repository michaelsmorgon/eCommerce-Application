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

    catalogContainer.addInnerElement(this.addCatalogHeader());
    catalogContainer.addInnerElement(this.addCatalogBody());
    catalogContainer.addInnerElement(this.addCatalogPaginator());

    this.viewElementCreator.addInnerElement(catalogContainer.getElement());
  }

  private addCatalogHeader(): HTMLElement {
    const catalogHeaderView = new CatalogHeaderView(this.queryString);
    return catalogHeaderView.getHtmlElement();
  }

  private addCatalogPaginator(): HTMLElement {
    const catalogPaginatorView = new CatalogPaginatorView();
    return catalogPaginatorView.getHtmlElement();
  }

  private addCatalogBody(): HTMLElement {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesCatalog.CATALOG_SECTION_BODY],
    };
    const catalogContainer = new ElementCreator(params);

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
    };
    products
      .getProductsWithSearch(searchParams)
      .then((response) => {
        const results = response.body?.results as ProductProjection[];
        results.forEach((product: ProductProjection) => {
          const catalogCard = new CatalogCard(product, product.key);
          catalogContainer.addInnerElement(catalogCard.getHtmlElement());
        });
      })
      .catch(() => {});

    return catalogContainer.getElement();
  }
}
