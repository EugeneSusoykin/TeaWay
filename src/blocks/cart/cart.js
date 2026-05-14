// Корзина с хранением в localStorage и обновлением бейджа в шапке
const STORAGE_KEY = 'tea-shop-cart';

export class Cart {
  constructor() {
    this._items = this._load();
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items));
    this._render();
  }

  // Обновляем счётчик товаров в шапке на всех страницах
  _render() {
    const count = this._items.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.header__cart-count').forEach((badge) => {
      badge.textContent = String(count);
      badge.classList.toggle('hidden', count === 0);
    });
  }

  addItem(product, qty = 1) {
    const existing = this._items.find((it) => it.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this._items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        qty,
      });
    }
    this._save();
  }

  removeItem(id) {
    this._items = this._items.filter((it) => it.id !== id);
    this._save();
  }

  updateQty(id, qty) {
    const item = this._items.find((it) => it.id === id);
    if (!item) return;
    if (qty <= 0) {
      this.removeItem(id);
      return;
    }
    item.qty = qty;
    this._save();
  }

  getItems() {
    return [...this._items];
  }

  getCount() {
    return this._items.reduce((sum, item) => sum + item.qty, 0);
  }

  getTotal() {
    return this._items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  // Первичная отрисовка после маунта шапки
  init() {
    this._render();
  }
}

export const cart = new Cart();
