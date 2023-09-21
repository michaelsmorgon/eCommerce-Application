import { userInfoFields } from '../../../data/registration-fields';
import { ElementConfig } from '../../../util/ElementCreator';
import { InputField } from '../../../util/input_field/InputField';
import View, { ViewParams } from '../../View';
import './user-view.css';

const CssClassesUserInfo = {
  USER_INFO_CONTAINER: 'user-info__container',
  USER_INFO_CAPTION: 'user-info__caption',
  USER_INFO_PASS_CONTAINER: 'user-info__pass-container',
};

export class UserInfoView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesUserInfo.USER_INFO_CONTAINER],
    };
    super(params);
    this.configureView();
  }

  private configureView(): void {
    userInfoFields.forEach((inputParams: ElementConfig) => {
      const creatorInput = new InputField(inputParams);
      this.viewElementCreator.addInnerElement(creatorInput);
    });
  }
}
