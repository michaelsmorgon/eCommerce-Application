import { ProductAPI } from '../../api/ProductAPI';
import { TokenCacheStore } from '../../api/TokenCacheStore';
import View, { ViewParams } from '../View';
import ProductDetails from './productDetails';
import Modal from './modalContainer/modalContainer';

const CssClassesProduct = {
  PRODUCT_SECTION: '.product-section',
};

export default class ProductView extends View {
  private productKey: string;

  constructor(productKey: string) {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClassesProduct.PRODUCT_SECTION],
    };
    super(params);
    this.productKey = productKey;
    this.create();
  }

  public create(): void {
    const tokenCacheStore = new TokenCacheStore();
    const products = new ProductAPI(tokenCacheStore);

    products
      .getProductByKey(this.productKey)
      .then((product) => {
        const productDetails = new ProductDetails(product.body.masterData.current);
        this.viewElementCreator.addInnerElement(productDetails.getHtmlElement());
        productDetails.initializeImageSlider();

        const imgList = document.querySelectorAll('.product-img') as NodeList;

        imgList.forEach((img) => {
          img.addEventListener('click', () => {
            document.body.style.overflow = 'hidden';
            const modalApp = new Modal(img as HTMLElement);
            modalApp.init();
          });
        });
      })
      .catch(() => {});
  }
}
