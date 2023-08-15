import { ClientResponse, CustomerSignInResult, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ctpClient } from '../../../api/BuilderClient';
import './login.css';
import ElementCreator, { ElementConfig } from '../../../util/ElementCreator';
import { InputField } from '../../../util/input_field/InputField';

export default class LoginView extends ElementCreator {
  constructor() {
    const params = {
      tag: 'main',
      classNames: ['main-login-view'],
    };
    super(params);
    this.configureView();
  }

  async checkCustomerExists(email: string, password: string): Promise<ClientResponse<CustomerSignInResult> | null> {
    const projectKey = 'dumians';
    const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });

    try {
      const response = await apiRoot.login().post({ body: { email, password } }).execute();

      console.log(response);
      return response;
    } catch (error) {
      console.error('Error checking customer:', error);
      return null;
    }
  }

  configureFields(): ElementConfig[] {
    return [
      {
        tag: 'input',
        classNames: ['input-field'],
        placeholderText: 'Enter your email',
        attributes: [{ name: 'id', value: 'loginEmail' }],
      },
      {
        tag: 'input',
        classNames: ['input-field'],
        placeholderText: 'Enter your password',
        attributes: [
          { name: 'id', value: 'loginPassword' },
          { name: 'type', value: 'password' },
        ],
      },
      {
        tag: 'span',
        classNames: ['login-content-Error'],
        attributes: [{ name: 'id', value: 'login-content-Error' }],
      },
      {
        tag: 'span',
        classNames: ['login-content-TextSignup'],
        textContent: "Don't have an account yet?",
      },
      {
        tag: 'a',
        classNames: ['login-content-loginSignup'],
        textContent: 'Sign up',
        attributes: [
          { name: 'target', value: '_blank' },
          { name: 'href', value: 'http://www.cnn.com/' },
        ],
      },
    ];
  }

  configureView(): void {
    const loginContent = {
      tag: 'div',
      classNames: ['login-content'],
    };
    const creatorLabel = new ElementCreator(loginContent);
    this.addInnerElement(creatorLabel);

    const loginText = {
      tag: 'h1',
      classNames: ['login-content-text'],
      textContent: 'LOGIN',
    };
    const creatorLogText = new ElementCreator(loginText);
    creatorLabel.addInnerElement(creatorLogText.getElement());

    const fieldsConfigurations = this.configureFields();
    fieldsConfigurations.forEach((config) => {
      if (config.tag === 'input') {
        const inputField = new InputField(config);
        creatorLabel.addInnerElement(inputField.getElement());
      } else {
        const otherField = new ElementCreator(config);
        creatorLabel.addInnerElement(otherField.getElement());
      }
    });

    const loginButton = {
      tag: 'button',
      classNames: ['login-content-button'],
      textContent: 'LOGIN',
      callback: async (): Promise<void> => {
        this.loginButtonCallback();
      },
    };
    const creatorLogButton = new ElementCreator(loginButton);
    creatorLabel.addInnerElement(creatorLogButton.getElement());
  }

  async loginButtonCallback(): Promise<void> {
    const emailInput = document.getElementById('loginEmail') as HTMLInputElement;
    const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
    const errorMessageSpan = document.getElementById('login-content-Error') as HTMLInputElement;

    const response = await this.checkCustomerExists(emailInput.value, passwordInput.value);

    if (response !== null) {
      // User exists, do something with the response
    } else {
      errorMessageSpan.textContent = 'There is no user with such an email and password';
      emailInput.style.border = '1px solid red';
      passwordInput.style.border = '1px solid red';

      emailInput.addEventListener('focus', () => {
        errorMessageSpan.textContent = '';
        emailInput.style.border = 'none';
        passwordInput.style.border = 'none';
      });
      passwordInput.addEventListener('focus', () => {
        errorMessageSpan.textContent = '';
        emailInput.style.border = 'none';
        passwordInput.style.border = 'none';
      });
    }
  }
}