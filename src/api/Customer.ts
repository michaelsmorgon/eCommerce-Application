import { createApiBuilderFromCtpClient, ClientResponse, CustomerDraft } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ctpClient, projectKey } from './BuilderClient';

export class Customer {
  private ctpClient;

  private apiRoot: ByProjectKeyRequestBuilder;

  constructor() {
    this.ctpClient = ctpClient;
    this.apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
  }

  public async createCustomer(params: CustomerDraft): Promise<ClientResponse> {
    return this.apiRoot
      .customers()
      .post({
        body: params,
      })
      .execute();
  }
}
