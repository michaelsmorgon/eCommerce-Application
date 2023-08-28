import fetch from 'node-fetch';
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  Client,
  PasswordAuthMiddlewareOptions,
  AnonymousAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  TokenCache,
} from '@commercetools/sdk-client-v2';
import { TokenCacheStore } from './TokenCacheStore';

export class BuilderClient {
  public PROJECT_KEY: string = 'dumians';

  public CLIENT_ID: string = '1EEBfc2osjuVPo194rHCi6rY';

  public CLIENT_SECRET: string = 'sbfW9xCogruktmY9mBRuUGBewCpLP4kD';

  public SCOPES: string[] = ['manage_project:dumians'];

  public API_URL: string = 'https://api.europe-west1.gcp.commercetools.com';

  public AUTH_URL: string = 'https://auth.europe-west1.gcp.commercetools.com';

  private httpMiddlewareOptions: HttpMiddlewareOptions;

  constructor(private tokenCacheStore: TokenCacheStore) {
    this.httpMiddlewareOptions = {
      host: this.API_URL,
      fetch,
    };
  }

  public httpMiddleware(): Client {
    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: this.AUTH_URL,
      projectKey: this.PROJECT_KEY,
      credentials: {
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
      },
      scopes: this.SCOPES,
      fetch,
      tokenCache: this.tokenCacheStore,
    };

    return new ClientBuilder()
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
  }

  public authWithPasswordFlow(username: string, password: string): Client {
    const options: PasswordAuthMiddlewareOptions = {
      host: this.AUTH_URL,
      projectKey: this.PROJECT_KEY,
      credentials: {
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
        user: {
          username,
          password,
        },
      },
      scopes: this.SCOPES,
      fetch,
    };

    return new ClientBuilder().withPasswordFlow(options).withHttpMiddleware(this.httpMiddlewareOptions).build();
  }

  public authWithAnonymousSessionFlow(anonymousId: string): Client {
    const options: AnonymousAuthMiddlewareOptions = {
      host: this.AUTH_URL,
      projectKey: this.PROJECT_KEY,
      credentials: {
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
        anonymousId,
      },
      scopes: this.SCOPES,
      fetch,
    };

    return new ClientBuilder().withAnonymousSessionFlow(options).withHttpMiddleware(this.httpMiddlewareOptions).build();
  }

  public authWithRefreshTokenFlow(refreshToken: string, tokenCache: TokenCache): Client {
    const options: RefreshAuthMiddlewareOptions = {
      host: this.AUTH_URL,
      projectKey: this.PROJECT_KEY,
      credentials: {
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
      },
      refreshToken,
      tokenCache,
      fetch,
    };

    return new ClientBuilder().withRefreshTokenFlow(options).withHttpMiddleware(this.httpMiddlewareOptions).build();
  }
}
