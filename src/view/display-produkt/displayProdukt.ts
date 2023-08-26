import { ctpClient } from '../../api/BuilderClient';
import CommercetoolsProduct from './produktView/commercetools-product';

const productKey = '79531';

export default class Products {
  constructor() {
    const commerceProduct = new CommercetoolsProduct(ctpClient, productKey);
    commerceProduct.printProduct();
  }
}
