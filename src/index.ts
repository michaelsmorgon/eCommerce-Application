import './style.css';
import Header from './view/header/header-view';
import Main from './view/mainPage/main-view';
import Footer from './view/footer/footer-view';

class App {
  footer: Footer;

  main: Main;

  header: Header;

  constructor() {
    this.header = new Header();
    this.main = new Main();
    this.footer = new Footer();
  }

  init(): void {
    this.header.create();
    this.main.create();
    this.footer.create();
  }
}

const app: App = new App();
app.init();
