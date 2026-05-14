import { Component } from '../../utils/Component.js';

// Шапка сайта: логотип, навигация, иконка корзины с бейджем
export class Header extends Component {
  constructor(selector) {
    super(selector);
  }

  render() {
    // Все страницы - соседи в src/pages
    this._element.innerHTML = `
      <div class="header__inner">
        <a href="index.html" class="header__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2C12 2 7 5 7 10C7 12.761 9.239 15 12 15C14.761 15 17 12.761 17 10C17 5 12 2 12 2Z" fill="#2D5A3D"/>
            <path d="M12 15C12 15 9 17 9 20C9 21.105 9.895 22 11 22H13C14.105 22 15 21.105 15 20C15 17 12 15 12 15Z" fill="#2D5A3D"/>
          </svg>
          <span class="header__brand">Чайный Путь</span>
        </a>

        <a class="header__cart" href="cart.html" aria-label="Корзина">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 2L3 6V20C3 20.5 3.2 21 3.6 21.4C4 21.8 4.5 22 5 22H19C19.5 22 20 21.8 20.4 21.4C20.8 21 21 20.5 21 20V6L18 2H6Z" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 6H21" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="header__cart-count hidden">0</span>
        </a>
      </div>
    `;
  }
}
