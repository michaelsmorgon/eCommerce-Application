import ElementCreator, { ElementConfig } from '../ElementCreator';
import { ICountryInfo, countriesInfo } from '../../data/country';
import './select_field.css';

enum SelectFieldCSSClasses {
  CONTAINER = 'select-field__container',
  OPTION = 'country-option',
}

export class SelectField extends ElementCreator {
  private labelElement: HTMLLabelElement = document.createElement('label');

  private selectElement: HTMLSelectElement = document.createElement('select');

  public create(params: ElementConfig): void {
    this.element = document.createElement('div');

    this.element.classList.add(SelectFieldCSSClasses.CONTAINER);
    params.classNames.forEach((className: string): void => {
      this.element.classList.add(className);
    });

    this.labelElement = document.createElement('label');
    this.selectElement = document.createElement('select');

    this.setDisabledSelect(params);

    this.setCallback(params.callback);
    this.setTextContent(params.textContent);
    this.setAttributes(params.attributes);

    const optionParamsDef: ElementConfig = {
      tag: 'option',
      classNames: [SelectFieldCSSClasses.OPTION],
      textContent: `-- Not Selected --`,
      attributes: [{ name: 'value', value: '-1' }],
    };
    const optionDef = new ElementCreator(optionParamsDef);
    this.selectElement.append(optionDef.getElement());

    countriesInfo.forEach((countryInfo: ICountryInfo) => {
      const optionParams: ElementConfig = {
        tag: 'option',
        classNames: [SelectFieldCSSClasses.OPTION],
        textContent: `${countryInfo.Country}`,
        attributes: [{ name: 'value', value: countryInfo.ISO }],
      };
      const option = new ElementCreator(optionParams);
      this.selectElement.append(option.getElement());
    });
    this.element.append(this.labelElement, this.selectElement);
  }

  public setTextContent(value: string = ''): void {
    this.labelElement.textContent = value;
  }

  private setDisabledSelect(params: ElementConfig): void {
    params.attributes?.forEach((attribute: { name: string; value: string }) => {
      if (attribute.name === 'disabled') {
        this.selectElement.setAttribute('disabled', '');
      }
    });
  }
}
