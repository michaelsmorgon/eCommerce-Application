import { createApiBuilderFromCtpClient, ClientResponse, CustomerDraft } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { ctpClient, projectKey } from './BuilderClient';
import { MessageView } from '../view/message/MessageView';

export class Customer {
  SUCCESS_MSG = 'You were registered successfully';

  private ctpClient;

  private apiRoot: ByProjectKeyRequestBuilder;

  constructor() {
    this.ctpClient = ctpClient;
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey });
  }

  public async createCustomer(params: CustomerDraft): Promise<ClientResponse | null> {
    try {
      const response = await this.apiRoot.customers().post({ body: params }).execute();

      const msgView = new MessageView(this.SUCCESS_MSG);
      msgView.showWindowMsg();

      return response;
    } catch (error: unknown) {
      let str = '';
      if (typeof error === 'string') {
        str = error;
      } else if (error instanceof Error) {
        str = error.message;
      }
      const msgView = new MessageView(str, false);
      msgView.showWindowMsg();
      throw new Error();
    }
  }
}
