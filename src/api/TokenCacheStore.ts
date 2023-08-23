import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

export class TokenCacheStore implements TokenCache {
  public tokenCache: TokenStore = {
    expirationTime: 0,
    token: '',
  };

  public set(newCache: TokenStore): void {
    this.tokenCache = newCache;
  }

  public get(): TokenStore {
    return this.tokenCache;
  }
}
