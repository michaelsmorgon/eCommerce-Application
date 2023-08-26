import { Client } from '@commercetools/sdk-client-v2';

interface Product {
  body: {
    masterData: {
      current: {
        name: {
          en: string;
        };
        description: string;
        categories: {
          id: string;
          typeId: string;
        };
        masterVariant: {
          attributes: {
            name: string;
            value: string;
          };
          images: {
            url: string;
            dimensions: {
              h: number;
              w: number;
            };
          }[];
          prices: {
            id: string;
            value: {
              centAmount: number;
              currencyCode: string;
              fractionDigits: number;
              type: string;
            };
          }[];
        };
      };
    };
  };
}

export default class CommercetoolsProduct {
  private client: Client;

  private productKey: string;

  constructor(client: Client, productKey: string) {
    this.client = client;
    this.productKey = productKey;
  }

  async getProductByKey(key: string): Promise<Product> {
    const request = {
      uri: `/dumians/products/key=${key}`,
      method: 'GET' as const,
    };
    const response = await this.client.execute(request);

    if (response) {
      return response;
    }
    throw new Error('Product not found');
  }

  async printProduct(): Promise<void> {
    try {
      const productData = await this.getProductByKey(this.productKey);
      console.log('Product information:', productData);

      if (!productData) {
        throw new Error('Invalid product data');
      }

      const productName = productData.body.masterData.current.name.en;
      const productImages = productData.body.masterData.current.masterVariant.images[0]?.url || [];
      const price = productData.body.masterData.current.masterVariant.prices[0].value.centAmount;
      const priceWithDiscount = productData.body.masterData.current.masterVariant.prices[1].value.centAmount;

      console.log('Discount price:', priceWithDiscount);
      console.log('Price:', price);
      console.log('Product name:', productName);
      console.log('URL product images:', productImages);
    } catch (error) {
      console.error(error);
    }
  }
}
