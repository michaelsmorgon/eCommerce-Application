import { Product } from '@commercetools/platform-sdk';
import { ProductAPI } from '../../api/ProductAPI';
import { TokenCacheStore } from '../../api/TokenCacheStore';
import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import View, { ViewParams } from '../View';
import { CatalogCard } from './card/CatalogCard';
import './catalog-view.css';

const CssClassesCatalog = {
  CATALOG_SECTION: 'catalog-section',
  CATALOG_SECTION_CONTAINER: 'catalog-section__container',
};

export default class CatalogView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClassesCatalog.CATALOG_SECTION],
    };
    super(params);
    this.create();
  }

  public create(): void {
    this.addCatalogContainer();
  }

  private addCatalogHeader(): void {
    // return subcategories cat > subcat > subcat
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
      .getProducts()
      .then((response) => {
        const results = response.body?.results as Product[];
        results.forEach((product: Product) => {
          const catalogCard = new CatalogCard(product.masterData.current);
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
