import {
  CartDiscountPagedQueryResponse,
  ClientResponse,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { BuilderClient } from './BuilderClient';
import { TokenCacheStore } from './TokenCacheStore';

export class Discount {
  constructor(private tokenCacheStore: TokenCacheStore) {}

  public async getCodes(): Promise<ClientResponse<CartDiscountPagedQueryResponse>> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.authWithAnonymousSessionFlow();
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    try {
      return await apiRoot.cartDiscounts().get().execute();
    } catch (error: unknown) {
      throw new Error();
    }
  }
}
