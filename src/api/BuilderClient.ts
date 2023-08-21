import fetch from 'node-fetch';
import { ClientBuilder, type AuthMiddlewareOptions, type HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { TokenCacheStore } from './TokenCacheStore';

export const projectKey = 'dumians';
export const clientId = '1EEBfc2osjuVPo194rHCi6rY';
export const clientSecret = 'sbfW9xCogruktmY9mBRuUGBewCpLP4kD';
export const scopes = ['manage_project:dumians'];
export const apiURL = 'https://api.europe-west1.gcp.commercetools.com';
export const authURL = 'https://auth.europe-west1.gcp.commercetools.com';

export const tokenCacheStore = new TokenCacheStore();

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authURL,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
  fetch,
  tokenCache: tokenCacheStore,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiURL,
  fetch,
};

export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();
