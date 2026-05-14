import { Component } from '../../utils/Component.js';
import { ProductCard } from '../product-card/product-card.js';

// Каталог: отрисовывает сетку карточек, поддерживает обновление по фильтру
export class Catalog extends Component {
  constructor(selector, onAddToCart) {
    super(selector);
    this._onAddToCart = onAddToCart;
    this._allItems = [];
  }

  setItems(items) {
    this._allItems = items;
  }

  render(items = this._allItems) {
    this._element.innerHTML = '';
    if (!items.length) {
      this._element.innerHTML = `
        <p class="catalog__empty">По заданным фильтрам ничего не найдено.</p>
      `;
      return;
    }
    items.forEach((product) => {
      const card = new ProductCard(product, this._onAddToCart);
      this._element.appendChild(card.render());
    });
  }
}
