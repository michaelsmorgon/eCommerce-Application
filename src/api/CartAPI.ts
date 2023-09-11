import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { Cart, ClientResponse, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { BuilderClient } from './BuilderClient';
import { TokenCacheStore } from './TokenCacheStore';

export class CartAPI {
  constructor(
    private tokenCacheStore: TokenCacheStore,
    private email?: string,
    private password?: string
  ) {}

  public async createAnonymousCart(): Promise<ClientResponse> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.authWithAnonymousSessionFlow();
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    try {
      return await apiRoot
        .me()
        .carts()
        .post({ body: { currency: 'USD', country: 'US' } })
        .execute();
    } catch (error: unknown) {
      throw new Error();
    }
  }

  public async createCustomerCart(customerId: string): Promise<ClientResponse> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.httpMiddleware();
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    try {
      return await apiRoot
        .carts()
        .post({ body: { currency: 'USD', country: 'US', customerId } })
        .execute();
    } catch (error: unknown) {
      throw new Error();
    }
  }

  public async getAnonymousCartById(cartId: string): Promise<ClientResponse<Cart>> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.authWithAnonymousSessionFlow();
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    try {
      return await apiRoot.carts().withId({ ID: cartId }).get().execute();
    } catch (error: unknown) {
      throw new Error();
    }
  }

  public async getCartByCustomerId(customerId: string): Promise<ClientResponse<Cart>> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.httpMiddleware();
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    try {
      return await apiRoot.carts().withCustomerId({ customerId }).get().execute();
    } catch (error: unknown) {
      throw new Error();
    }
  }

  public async addProductToAnonymousCart(
    cartId: string,
    productId: string,
    version: number,
    quantity: number
  ): Promise<ClientResponse> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.authWithAnonymousSessionFlow();
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    try {
      return await apiRoot
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version,
            actions: [
              {
                action: 'addLineItem',
                productId,
                quantity,
              },
            ],
          },
        })
        .execute();
    } catch (error: unknown) {
      throw new Error();
    }
  }

  public async removeProduct(cartId: string, lineItemId: string, version: number): Promise<ClientResponse> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.authWithAnonymousSessionFlow();
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    try {
      return await apiRoot
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version,
            actions: [
              {
                action: 'removeLineItem',
                lineItemId,
              },
            ],
          },
        })
        .execute();
    } catch (error: unknown) {
      throw new Error();
    }
  }
}
