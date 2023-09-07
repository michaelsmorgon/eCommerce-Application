import { ClientResponse, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { userInfoFields } from '../../../../data/registration-fields';
import { ElementConfig } from '../../../../util/ElementCreator';
import { InputField } from '../../../../util/input_field/InputField';
import View, { ViewParams } from '../../../View';
import './user-view.css';

import { BuilderClient } from '../../../../api/BuilderClient';
import { TokenCacheStore } from '../../../../api/TokenCacheStore';

const CssClassesUserInfo = {
  USER_INFO_CONTAINER: 'user-info__container',
  USER_INFO_CAPTION: 'user-info__caption',
  USER_INFO_PASS_CONTAINER: 'user-info__pass-container',
};

export class UserInfoView extends View {
  private tokenCacheStore: TokenCacheStore;

  constructor() {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesUserInfo.USER_INFO_CONTAINER],
    };
    super(params);
    this.CallMethod();
    this.tokenCacheStore = new TokenCacheStore();
  }

  async CallMethod(): Promise<void> {
    const response = await this.checkCustomerExists();
    await this.configureView();
    this.setUserValueToString(response);
  }

  async checkCustomerExists(): Promise<ClientResponse | null> {
    const projectKey = 'dumians';
    const builderClient: BuilderClient = new BuilderClient(this.tokenCacheStore);
    const ctpClient = builderClient.httpMiddleware();
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
    const id = localStorage.getItem('id');

    if (id !== null) {
      try {
        const response = await apiRoot.customers().withId({ ID: id }).get().execute();

        return response;
      } catch (error) {
        console.error('Error checking customer:', error);
        return null;
      }
    } else {
      console.error('Customer ID not found in local storage');
      return null;
    }
  }

  private async configureView(): Promise<void> {
    await Promise.all(
      userInfoFields.map(async (inputParams: ElementConfig) => {
        const creatorInput = new InputField(inputParams);
        await this.viewElementCreator.addInnerElement(creatorInput);
      })
    );
  }

  setUserValueToString(response: ClientResponse | null): void {
    const firstNameInput = document.querySelector('input[name="reg-first-name"]') as HTMLInputElement;
    const lastNameInput = document.querySelector('input[name="reg-last-name"]') as HTMLInputElement;
    const dateInput = document.querySelector('input[name="reg-dob"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[name="reg-email"]') as HTMLInputElement;
    const passInput = document.querySelector('input[name="reg-pass"]') as HTMLInputElement;
    const confirmpassInput = document.querySelector('input[name="reg-confirm-pass"]') as HTMLInputElement;

    firstNameInput.value = response?.body.firstName;
    lastNameInput.value = response?.body.lastName;
    const dateString = response?.body.dateOfBirth;
    dateInput.value = dateString;
    emailInput.value = response?.body.email;
    passInput.disabled = true;
    confirmpassInput.disabled = true;
  }
}
