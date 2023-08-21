import ElementCreator, { ElementConfig } from '../../util/ElementCreator';
import View, { ViewParams } from '../View';
import './message-view.css';

const CssClassesMsg = {
  MESSAGE_CONTAINER: 'message-container',
  MESSAGE_HEADER: 'message-header',
  MESSAGE_CORRECT: 'message-correct',
  MESSAGE_WRONG: 'message-wrong',
  MESSAGE_BODY: 'message-body',
  SHOW: 'show',
};

export class MessageView extends View {
  private mainView: HTMLElement;

  constructor(
    private bodyMsg: string,
    private isCorrect: boolean = true
  ) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [CssClassesMsg.MESSAGE_CONTAINER],
    };
    super(params);
    this.mainView = document.querySelector('.mainView') as HTMLElement;
    this.create();
  }

  private create(): void {
    this.createHeader();
    this.createBody();
  }

  private createHeader(): void {
    const paramsHeader: ElementConfig = {
      tag: 'div',
      classNames: [
        CssClassesMsg.MESSAGE_HEADER,
        this.isCorrect ? CssClassesMsg.MESSAGE_CORRECT : CssClassesMsg.MESSAGE_WRONG,
      ],
      textContent: this.isCorrect ? 'V' : 'X',
    };
    const msgHeader = new ElementCreator(paramsHeader);
    this.viewElementCreator.addInnerElement(msgHeader);
  }

  private createBody(): void {
    const paramsBody: ElementConfig = {
      tag: 'div',
      classNames: [CssClassesMsg.MESSAGE_BODY],
      textContent: this.bodyMsg,
    };
    const msgBody = new ElementCreator(paramsBody);
    this.viewElementCreator.addInnerElement(msgBody);
  }

  private hideWindowMsg(): void {
    const msgContainer = document.querySelector(`.${CssClassesMsg.MESSAGE_CONTAINER}`) as HTMLElement;
    this.mainView.removeChild(msgContainer);
  }

  public showWindowMsg(showTime: number = 3000): void {
    this.mainView.append(this.viewElementCreator.getElement());
    const msgContainer = document.querySelector(`.${CssClassesMsg.MESSAGE_CONTAINER}`) as HTMLElement;
    msgContainer.classList.add(`${CssClassesMsg.SHOW}`);

    setTimeout(() => {
      this.hideWindowMsg();
    }, showTime);
  }
}
