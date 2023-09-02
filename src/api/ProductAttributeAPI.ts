import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  ClientResponse,
  ProductTypePagedQueryResponse,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { BuilderClient } from './BuilderClient';
import { TokenCacheStore } from './TokenCacheStore';
import { MessageView } from '../view/message/MessageView';

export class ProductAttributeAPI {
  private ctpClient;

  private apiRoot: ByProjectKeyRequestBuilder;

  constructor(tokenCacheStore: TokenCacheStore) {
    const builderClient: BuilderClient = new BuilderClient(tokenCacheStore);
    this.ctpClient = builderClient.httpMiddleware();
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
  }

  public async getAttributes(): Promise<ClientResponse<ProductTypePagedQueryResponse | null>> {
    try {
      const response = await this.apiRoot.productTypes().get().execute();

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
