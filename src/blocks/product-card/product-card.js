import { Component } from '../../utils/Component.js';

// Цвета бейджей по категории - синхронны с дизайном
const BADGE_COLORS = {
  'Белый чай': 'var(--tea-cat-white)',
  'Зелёный чай': 'var(--tea-cat-green)',
  'Жёлтый чай': 'var(--tea-cat-yellow)',
  'Улун': 'var(--tea-cat-oolong)',
  'Красный чай': 'var(--tea-cat-red)',
  'Шу Пуэр': 'var(--tea-cat-puer-shu)',
  'Шен Пуэр': 'var(--tea-cat-puer-shen)',
  'Хэй Ча': 'var(--tea-cat-hei)',
  'Габа Чай': 'var(--tea-cat-gaba)',
  'Чайные добавки': 'var(--tea-cat-extras)',
};

export class ProductCard extends Component {
  constructor({ id, name, price, image, category, description }, onAddToCart) {
    super('body'); // карточка существует вне DOM до вставки
    this._id = id;
    this._name = name;
    this._price = price;
    this._image = image;
    this._category = category;
    this._description = description;
    this._onAddToCart = onAddToCart;
  }

  _formatPrice(value) {
    return `${value.toLocaleString('ru-RU')} ₽`;
  }

  _badgeColor() {
    return BADGE_COLORS[this._category] || 'var(--tea-brown)';
  }

  // Возвращаем готовый DOM-элемент карточки
  render() {
    const link = `product.html?id=${this._id}`;
    const article = document.createElement('article');
    article.className = 'product-card';
    article.innerHTML = `
      <a class="product-card__link" href="${link}">
        <div class="product-card__image-wrap">
          <img class="product-card__image" src="${this._image}" alt="${this._name}" loading="lazy" />
        </div>
        <div class="product-card__body">
          <span class="product-card__category" style="background-color:${this._badgeColor()}">${this._category}</span>
          <h3 class="product-card__title">${this._name}</h3>
          <p class="product-card__price">${this._formatPrice(this._price)}</p>
        </div>
      </a>
      <button class="product-card__button" type="button">В корзину</button>
    `;

    const btn = article.querySelector('.product-card__button');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this._onAddToCart) {
        this._onAddToCart({
          id: this._id,
          name: this._name,
          price: this._price,
          image: this._image,
          category: this._category,
          description: this._description,
        });
      }
    });

    return article;
  }
}
