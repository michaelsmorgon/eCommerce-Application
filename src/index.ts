import { App } from './router/app';
import './style.css';
import Products from './view/display-produkt/displayProdukt';

const app: App = new App();
app.init();
// eslint-disable-next-line no-new
new Products(); // дадау часова
