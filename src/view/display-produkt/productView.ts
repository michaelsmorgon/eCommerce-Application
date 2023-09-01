import { ProductAPI } from '../../api/ProductAPI';
import { TokenCacheStore } from '../../api/TokenCacheStore';
import View, { ViewParams } from '../View';
import ProductDetails from './productDetails';

const CssClassesProduct = {
  PRODUCT_SECTION: '.product-section',
};

export default class ProductView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClassesProduct.PRODUCT_SECTION],
    };
    super(params);
    this.create();
  }

  public create(): void {
    const tokenCacheStore = new TokenCacheStore();
    const products = new ProductAPI(tokenCacheStore);

    const productKey = '10031';

    products
      .getProductByKey(productKey)
      .then((product) => {
        // Передайте общий объект параметров при создании ProductDetails
        const productDetails = new ProductDetails(product.body.masterData.current);
        this.viewElementCreator.addInnerElement(productDetails.getHtmlElement());
      })
      .catch(() => {});
  }
}
