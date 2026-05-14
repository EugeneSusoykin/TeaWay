import './styles/global.css';
import './blocks/header/header.css';
import './blocks/product-card/product-card.css';
import './blocks/catalog/catalog.css';
import './blocks/filter/filter.css';
import './blocks/cart/cart.css';

import { Api } from './api/api.js';
import { Header } from './blocks/header/header.js';
import { Catalog } from './blocks/catalog/catalog.js';
import { Filter } from './blocks/filter/filter.js';
import { ProductCard } from './blocks/product-card/product-card.js';
import { cart } from './blocks/cart/cart.js';

// Базовый URL собственного mock-API (TeaAPI), захощен на GitHub Pages.
const API_BASE = import.meta.env.VITE_API_BASE || 'https://eugenesusoykin.github.io/TeaAPI';
const api = new Api(API_BASE);

// Утилита форматирования цены
const fmtPrice = (v) => `${Number(v).toLocaleString('ru-RU')} ₽`;

// Бейдж по категории
const BADGE_COLOR = {
  'Белый чай': 'var(--tea-cat-white)',
  'Зелёный чай': 'var(--tea-cat-green)',
  'Жёлтый чай': 'var(--tea-cat-yellow)',
  Улун: 'var(--tea-cat-oolong)',
  'Красный чай': 'var(--tea-cat-red)',
  'Шу Пуэр': 'var(--tea-cat-puer-shu)',
  'Шен Пуэр': 'var(--tea-cat-puer-shen)',
  'Хэй Ча': 'var(--tea-cat-hei)',
  'Габа Чай': 'var(--tea-cat-gaba)',
  'Чайные добавки': 'var(--tea-cat-extras)',
};

// Рендер шапки и подвала на всех страницах
function mountChrome() {
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    const header = new Header('.header');
    header.render();
  }

  const footerEl = document.querySelector('.footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="footer__inner">
        <div class="footer__col">
          <h4 class="footer__title">Чайный Путь</h4>
          <p class="footer__text">Чай с душой с 2026 года</p>
        </div>
        <div class="footer__col">
          <h4 class="footer__title">Каталог</h4>
          <div class="footer__cats">
            <a class="footer__link" href="catalog.html">Белый чай</a>
            <a class="footer__link" href="catalog.html">Зелёный чай</a>
            <a class="footer__link" href="catalog.html">Жёлтый чай</a>
            <a class="footer__link" href="catalog.html">Улун</a>
            <a class="footer__link" href="catalog.html">Красный чай</a>
            <a class="footer__link" href="catalog.html">Шу Пуэр</a>
            <a class="footer__link" href="catalog.html">Шен Пуэр</a>
            <a class="footer__link" href="catalog.html">Хэй Ча</a>
            <a class="footer__link" href="catalog.html">Габа Чай</a>
            <a class="footer__link" href="catalog.html">Чайные добавки</a>
          </div>
        </div>
        <div class="footer__col">
          <h4 class="footer__title">Контакты</h4>
          <a class="footer__link" href="mailto:info@chaynyput.ru">info@chaynyput.ru</a>
          <a class="footer__link" href="tel:+79991234567">+7 (999) 123-45-67</a>
        </div>
      </div>
      <p class="footer__copy">© 2026 Чайный Путь. Все права защищены.</p>
    `;
  }

  cart.init();
}

function showError(container, message) {
  container.innerHTML = `<div class="error-message">${message}</div>`;
}

// Главная страница
async function initHome() {
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    const base = import.meta.env.BASE_URL || '/';
    heroBg.style.setProperty('--hero-bg', `url('${base}hero.jpg')`);
  }

  const popular = document.querySelector('.popular__grid');
  if (!popular) return;
  try {
    const items = await api.getProducts();
    const featuredCategories = ['Улун', 'Зелёный чай', 'Шен Пуэр', 'Красный чай'];
    const top = featuredCategories
      .map((cat) => items.find((p) => p.category === cat))
      .filter(Boolean);
    for (const it of items) {
      if (top.length === 4) break;
      if (!top.includes(it)) top.push(it);
    }

    top.forEach((p) => {
      const card = new ProductCard(p, (product) => cart.addItem(product));
      popular.appendChild(card.render());
    });
  } catch (err) {
    showError(popular, `Не удалось загрузить товары: ${err.message}`);
  }
}

// Открытие/закрытие мобильного сайдбара
function initDrawer() {
  const drawer = document.querySelector('[data-drawer]');
  const toggle = document.querySelector('.drawer-toggle');
  const closeBtn = document.querySelector('[data-drawer-close]');
  const backdrop = document.querySelector('[data-drawer-backdrop]');
  if (!drawer || !toggle) return;

  const open = () => {
    drawer.classList.add('is-open');
    if (backdrop) backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('is-open');
    if (backdrop) backdrop.hidden = true;
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// Каталог: загрузка товаров, фильтр и сортировка
async function initCatalog() {
  const grid = document.querySelector('.catalog');
  const filterEl = document.querySelector('.filter');
  if (!grid || !filterEl) return;

  initDrawer();

  const catalog = new Catalog('.catalog', (product) => cart.addItem(product));
  let items = [];
  let filterState = { categories: new Set(), maxPrice: Infinity, search: '' };
  let sortMode = 'default';
  const countEl = document.querySelector('[data-count]');
  const sortEl = document.querySelector('[data-sort]');

  const sortItems = (arr, mode) => {
    const copy = [...arr];
    switch (mode) {
      case 'price-asc':
        return copy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return copy.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return copy.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
      case 'name-desc':
        return copy.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
      default:
        return copy;
    }
  };

  const refresh = () => {
    const filtered = Filter.apply(items, filterState);
    const sorted = sortItems(filtered, sortMode);
    catalog.render(sorted);
    if (countEl) countEl.textContent = `Найдено: ${sorted.length}`;
  };

  const filter = new Filter('.filter', (state) => {
    filterState = state;
    refresh();
  });

  if (sortEl) {
    sortEl.addEventListener('change', (e) => {
      sortMode = e.target.value;
      refresh();
    });
  }

  try {
    items = await api.getProducts();
    catalog.setItems(items);
    filter.render(items);
    filterState.maxPrice = Math.max(...items.map((i) => i.price));
    refresh();
  } catch (err) {
    showError(grid, `Не удалось загрузить каталог: ${err.message}`);
  }
}

// Страница товара: загрузка по id из query, отрисовка и похожие товары
async function initProduct() {
  const root = document.querySelector('.product-page');
  if (!root) return;

  const id = new URLSearchParams(location.search).get('id');
  if (!id) {
    root.innerHTML = renderNotFound();
    return;
  }

  try {
    const product = await api.getProductById(id);
    let qty = 1;
    root.innerHTML = `
      <div class="product-page__layout">
        <div class="product-page__gallery">
          <img class="product-page__image" src="${product.image}" alt="${product.name}" />
        </div>
        <div class="product-page__info">
          <span class="product-page__badge" style="background-color:${BADGE_COLOR[product.category] || 'var(--tea-brown)'}">${product.category}</span>
          <h1 class="product-page__title">${product.name}</h1>
          <p class="product-page__price">${fmtPrice(product.price)}</p>
          <p class="product-page__description">${product.description}</p>

          <div class="product-page__brew">
            <div class="product-page__brew-item">
              <span class="product-page__brew-icon">🌡️</span>
              <div>
                <p class="product-page__brew-label">Температура</p>
                <p class="product-page__brew-value">${product.brewTemp}</p>
              </div>
            </div>
            <div class="product-page__brew-item">
              <span class="product-page__brew-icon">⏱️</span>
              <div>
                <p class="product-page__brew-label">Время</p>
                <p class="product-page__brew-value">${product.brewTime}</p>
              </div>
            </div>
            <div class="product-page__brew-item">
              <span class="product-page__brew-icon">🍵</span>
              <div>
                <p class="product-page__brew-label">Дозировка</p>
                <p class="product-page__brew-value">${product.amount}</p>
              </div>
            </div>
          </div>

          <div class="product-page__controls">
            <div class="product-page__qty">
              <button class="product-page__qty-btn" data-action="minus" type="button">−</button>
              <input class="product-page__qty-input" type="number" min="1" value="1" />
              <button class="product-page__qty-btn" data-action="plus" type="button">+</button>
            </div>
            <button class="btn btn--primary product-page__add" type="button">В корзину</button>
          </div>
        </div>
      </div>

      <section class="product-page__related">
        <h2 class="product-page__related-title">Похожие товары</h2>
        <div class="catalog related-grid"></div>
      </section>
    `;

    const qtyInput = root.querySelector('.product-page__qty-input');
    root.querySelector('[data-action="minus"]').addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      qtyInput.value = qty;
    });
    root.querySelector('[data-action="plus"]').addEventListener('click', () => {
      qty += 1;
      qtyInput.value = qty;
    });
    qtyInput.addEventListener('input', () => {
      qty = Math.max(1, Number(qtyInput.value) || 1);
      qtyInput.value = qty;
    });
    root.querySelector('.product-page__add').addEventListener('click', () => {
      cart.addItem(product, qty);
    });

    // Похожие товары той же категории
    try {
      const all = await api.getProducts();
      const related = all
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      const relatedGrid = root.querySelector('.related-grid');
      related.forEach((p) => {
        const card = new ProductCard(p, (prod) => cart.addItem(prod));
        relatedGrid.appendChild(card.render());
      });
    } catch {
    }
  } catch {
    root.innerHTML = renderNotFound();
  }
}

function renderNotFound() {
  return `
    <div class="product-page__not-found">
      <h1>Товар не найден</h1>
      <a class="btn btn--primary" href="catalog.html">← Вернуться в каталог</a>
    </div>
  `;
}

// Страница корзины: чтение localStorage и отрисовка позиций
function initCartPage() {
  const root = document.querySelector('.cart');
  if (!root) return;
  renderCartPage(root);

  // При любом изменении корзины перерисовываем
  window.addEventListener('storage', () => renderCartPage(root));
}

function renderCartPage(root) {
  const items = cart.getItems();

  if (!items.length) {
    root.innerHTML = `
      <div class="cart__empty">
        <h2 class="cart__empty-title">Ваша корзина пуста</h2>
        <p class="cart__empty-text">Добавьте чай из каталога, чтобы оформить заказ</p>
        <a class="btn btn--primary" href="catalog.html">Перейти в каталог</a>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="cart__layout">
      <div class="cart__items">
        ${items
          .map(
            (item) => `
          <article class="cart-item" data-id="${item.id}">
            <a class="cart-item__link" href="product.html?id=${item.id}">
              <img class="cart-item__image" src="${item.image}" alt="${item.name}" />
              <div class="cart-item__info">
                <p class="cart-item__name">${item.name}</p>
                <p class="cart-item__category">${item.category}</p>
                <p class="cart-item__price">${fmtPrice(item.price * item.qty)}</p>
              </div>
            </a>
            <div class="cart-item__controls">
              <div class="cart-item__qty">
                <button class="cart-item__qty-btn" data-action="minus" type="button">−</button>
                <span class="cart-item__qty-value">${item.qty}</span>
                <button class="cart-item__qty-btn" data-action="plus" type="button">+</button>
              </div>
              <button class="cart-item__remove" type="button">Удалить</button>
            </div>
          </article>
        `
          )
          .join('')}
      </div>

      <aside class="cart__summary">
        <h2 class="cart__summary-title">Ваш заказ</h2>
        <div class="cart__summary-row">
          <span>Товары (${cart.getCount()})</span>
          <span>${fmtPrice(cart.getTotal())}</span>
        </div>
        <div class="cart__summary-row">
          <span>Доставка</span>
          <span style="color: var(--tea-green)">Бесплатно</span>
        </div>
        <div class="cart__summary-total">
          <span class="cart__summary-total-label">ИТОГО</span>
          <span class="cart__summary-total-value">${fmtPrice(cart.getTotal())}</span>
        </div>
        <button class="btn btn--primary btn--full">Оформить заказ</button>
      </aside>
    </div>
  `;

  // Обработчики на кнопки
  root.querySelectorAll('.cart-item').forEach((node) => {
    const id = Number(node.dataset.id);
    const item = items.find((it) => it.id === id);
    if (!item) return;

    node.querySelector('[data-action="minus"]').addEventListener('click', () => {
      cart.updateQty(id, item.qty - 1);
      renderCartPage(root);
    });
    node.querySelector('[data-action="plus"]').addEventListener('click', () => {
      cart.updateQty(id, item.qty + 1);
      renderCartPage(root);
    });
    node.querySelector('.cart-item__remove').addEventListener('click', () => {
      cart.removeItem(id);
      renderCartPage(root);
    });
  });
}

// Маршрутизатор: по атрибуту data-page на body выбираем нужный инициализатор
document.addEventListener('DOMContentLoaded', () => {
  mountChrome();

  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'catalog') initCatalog();
  if (page === 'product') initProduct();
  if (page === 'cart') initCartPage();
});
