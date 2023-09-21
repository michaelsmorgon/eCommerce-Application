import './multiselect-checkbox-field.css';
import ElementCreator, { ElementConfig } from '../ElementCreator';

export const CssClasses = {
  MULTI_CHECKBOX_CONTAINER: 'multi-checkbox-container',
  MULTI_CHECKBOX_TITLE: 'multi-checkbox-title',
  SELECT_BOX_CONTAINER: 'select-box-container',
  SELECT_BOX: 'select-box',
  SELECT_BOX_TITLE: 'select-box-title',
  OVER_SELECT: 'over-select',
  MULTI_CHECKBOX_LIST: 'multi-checkbox-list',
  MULTI_CHECKBOX_LIST_HIDE: 'multi-checkbox-list-hide',
  CHECKBOX_CONTAINER: 'checkbox-container',
  LABEL_LIST: 'label-list',
};

const CHOOSE_TITLE = ' - Choose - ';

export class MultiselectCheckboxField {
  private element: HTMLElement;

  private id: string = '';

  constructor(
    private title: string,
    private listValues: { key: string; value: string }[],
    private elementConfig: ElementConfig,
    private checkedList: string[]
  ) {
    this.element = document.createElement('div');
    this.element.classList.add(CssClasses.MULTI_CHECKBOX_CONTAINER);
    this.elementConfig.classNames.forEach((className: string): void => {
      this.element.classList.add(className);
    });
    this.elementConfig.attributes?.forEach((attr) => {
      if (attr.name === 'id') {
        this.id = attr.value;
      }
    });
  }

  public create(): HTMLElement {
    this.addTitle();
    this.addSelectBox();
    this.addCheckboxes();

    return this.element;
  }

  private addTitle(): void {
    const params: ElementConfig = {
      tag: 'h3',
      classNames: [CssClasses.MULTI_CHECKBOX_TITLE],
      textContent: this.title,
    };
    const title = new ElementCreator(params);
    this.element.append(title.getElement());
  }

  private addSelectBox(): void {
    const params: ElementConfig = {
      tag: 'div',
      classNames: [CssClasses.SELECT_BOX_CONTAINER],
      callback: () => {
        this.showHideCheckboxes();
      },
    };
    const colorBox = new ElementCreator(params);

    const selectParams: ElementConfig = {
      tag: 'select',
      classNames: [CssClasses.SELECT_BOX],
    };
    const selectBox = new ElementCreator(selectParams);

    const selectTitleParams: ElementConfig = {
      tag: 'option',
      classNames: [CssClasses.SELECT_BOX_TITLE],
      textContent: CHOOSE_TITLE,
    };
    const colorTitle = new ElementCreator(selectTitleParams);

    selectBox.addInnerElement(colorTitle);
    colorBox.addInnerElement(selectBox);

    const overSelect: ElementConfig = {
      tag: 'div',
      classNames: [CssClasses.OVER_SELECT],
    };
    const overSelectElem = new ElementCreator(overSelect);
    colorBox.addInnerElement(overSelectElem);

    this.element.append(colorBox.getElement());
  }

  private showHideCheckboxes(): void {
    const checkboxes = document.querySelector(`#${this.id}`);
    checkboxes?.classList.toggle(CssClasses.MULTI_CHECKBOX_LIST_HIDE);
  }

  private addCheckboxes(): void {
    const classes = [CssClasses.MULTI_CHECKBOX_LIST];
    if (!this.showMultiSelect()) {
      classes.push(CssClasses.MULTI_CHECKBOX_LIST_HIDE);
    }
    const params: ElementConfig = {
      tag: 'div',
      classNames: classes,
      attributes: [{ name: 'id', value: this.id }],
    };
    const colorList = new ElementCreator(params);
    this.addCheckboxElem(colorList);
    this.element.append(colorList.getElement());
  }

  private addCheckboxElem(colorList: ElementCreator): void {
    this.listValues.forEach((val) => {
      const checkboxContainerParam: ElementConfig = {
        tag: 'div',
        classNames: [CssClasses.CHECKBOX_CONTAINER],
      };
      const checkboxContainer = new ElementCreator(checkboxContainerParam);

      const labelParams: ElementConfig = {
        tag: 'label',
        classNames: [CssClasses.LABEL_LIST],
      };
      const checkboxLabel = new ElementCreator(labelParams);

      const inputParams: ElementConfig = {
        tag: 'input',
        classNames: [val.key],
        attributes: [
          { name: 'type', value: 'checkbox' },
          { name: 'id', value: `${this.id}_${val.key}` },
          { name: this.isChecked(val) ? 'checked' : '', value: '' },
        ],
      };
      checkboxLabel.addInnerElement(new ElementCreator(inputParams));

      const text = document.createElement('span');
      text.textContent = val.value;
      checkboxLabel.addInnerElement(text);
      checkboxContainer.addInnerElement(checkboxLabel);
      colorList.addInnerElement(checkboxContainer);
    });
  }

  private isChecked(value: { key: string; value: string }): boolean {
    return this.checkedList.find((checked) => checked === value.key) !== undefined;
  }

  private showMultiSelect(): boolean {
    let showMultiselect = false;
    this.listValues.forEach((val) => {
      if (this.checkedList.find((checked) => checked === val.key)) {
        showMultiselect = true;
      }
    });

    return showMultiselect;
  }
}
