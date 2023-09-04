import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  ClientResponse,
  Product,
  ProductPagedQueryResponse,
  ProductProjectionPagedQueryResponse,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { BuilderClient } from './BuilderClient';
import { TokenCacheStore } from './TokenCacheStore';
import { MessageView } from '../view/message/MessageView';

export class ProductAPI {
  private ctpClient;

  private apiRoot: ByProjectKeyRequestBuilder;

  constructor(tokenCacheStore: TokenCacheStore) {
    const builderClient: BuilderClient = new BuilderClient(tokenCacheStore);
    this.ctpClient = builderClient.httpMiddleware();
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
  }

  public async getProducts(): Promise<ClientResponse<ProductPagedQueryResponse | null>> {
    try {
      const response = await this.apiRoot.products().get().execute();

      console.log(response);
      return response;
    } catch (error: unknown) {
      this.showError(error);
      throw new Error();
    }
  }

  public async getProductsWithSearch(
    filterSearch: string[],
    orderSearch: string | null = null,
    searchText: string = ''
  ): Promise<ClientResponse<ProductProjectionPagedQueryResponse | null>> {
    try {
      const response = await this.apiRoot
        .productProjections()
        .search()
        .get({
          queryArgs: {
            limit: 100,
            'text.en': searchText,
            sort: orderSearch ? [orderSearch] : [],
            filter: filterSearch,
          },
        })
        .execute();

      console.log(response);
      return response;
    } catch (error: unknown) {
      this.showError(error);
      throw new Error();
    }
  }

  public async getProductByKey(key: string): Promise<ClientResponse<Product>> {
    try {
      const response = await this.apiRoot.products().withKey({ key }).get().execute();

      console.log(response);
      return response;
    } catch (error: unknown) {
      this.showError(error);
      throw new Error();
    }
  }

  public async getProductById(id: string): Promise<ClientResponse<Product>> {
    try {
      const response = await this.apiRoot.products().withId({ ID: id }).get().execute();

      console.log(response);
      return response;
    } catch (error: unknown) {
      this.showError(error);
      throw new Error();
    }
  }

  private showError(error: unknown): void {
    let str = '';
    if (typeof error === 'string') {
      str = error;
    } else if (error instanceof Error) {
      str = error.message;
    }
    const msgView = new MessageView(str, false);
    msgView.showWindowMsg();
  }
}
