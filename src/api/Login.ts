import { createApiBuilderFromCtpClient, ClientResponse, CustomerSignInResult } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { BuilderClient } from './BuilderClient';
import { TokenCacheStore } from './TokenCacheStore';

export class Login {
  constructor(
    private tokenCacheStore: TokenCacheStore,
    private email: string,
    private password: string
  ) {}

  private async login(apiRoot: ByProjectKeyRequestBuilder): Promise<ClientResponse<CustomerSignInResult> | null> {
    try {
      return await apiRoot
        .login()
        .post({ body: { email: this.email, password: this.password } })
        .execute();
    } catch (error: unknown) {
      throw new Error();
    }
  }

  public async loginUseHTTPMiddleware(): Promise<ClientResponse<CustomerSignInResult> | null> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.httpMiddleware();
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    return this.login(apiRoot);
  }

  public async loginUseCredentials(): Promise<ClientResponse<CustomerSignInResult> | null> {
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.authWithPasswordFlow(this.email, this.password);
    const apiRoot: ByProjectKeyRequestBuilder = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: builderClient.PROJECT_KEY,
    });
    return this.login(apiRoot);
  }
}
