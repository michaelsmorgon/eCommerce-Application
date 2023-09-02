import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductAPI } from '../../api/ProductAPI';
import { TokenCacheStore } from '../../api/TokenCacheStore';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import View, { ViewParams } from '../View';
import { CatalogCard } from './card/CatalogCard';
import './catalog-view.css';
import { SearchView } from './search/SearchView';
import { QueryString } from './query/QueryString';

const CssClassesCatalog = {
  CATALOG_SECTION: 'catalog-section',
  CATALOG_SECTION_CONTAINER: 'catalog-section__container',
};

export default class CatalogView extends View {
  private queryString: QueryString;

  constructor() {
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

  private addCatalogHeader(): void {
    // return subcategories cat > subcat > subcat
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

    const tokenCacheStore = new TokenCacheStore();
    const products = new ProductAPI(tokenCacheStore);

    products
      .getProductsWithSearch(this.queryString.getSearchList())
      .then((response) => {
        const results = response.body?.results as ProductProjection[];
        results.forEach((product: ProductProjection) => {
          const catalogCard = new CatalogCard(product, product.key);
          catalogContainer.addInnerElement(catalogCard.getHtmlElement());
        });
      })
      .catch(() => {});

    this.viewElementCreator.addInnerElement(catalogContainer);
  }

  private addCatalogFooter(): void {
    // return pagination
  }
}
