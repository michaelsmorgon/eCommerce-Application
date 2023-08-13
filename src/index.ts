import './style.css';
import Header from './view/header/header-view';
import Main from './view/mainPage/main-view';

class App {
  main: Main;

  header: Header;

  constructor() {
    this.header = new Header();
    this.main = new Main();
  }

  init(): void {
    this.header.create();
    this.main.create();
  }
}

const app: App = new App();
app.init();
