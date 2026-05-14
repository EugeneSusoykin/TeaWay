import { Component } from '../../utils/Component.js';

// Фильтр: категории (чекбоксы), цена (range), поиск по названию
export class Filter extends Component {
  constructor(selector, onChange) {
    super(selector);
    this._onChange = onChange;
    this._state = {
      categories: new Set(),
      maxPrice: 100000,
      search: '',
    };
  }

  render(items) {
    const prices = items.map((p) => p.price);
    const maxPrice = prices.length ? Math.max(...prices) : 100000;
    this._state.maxPrice = maxPrice;

    // Категории берём из самих товаров - отображаем только те, что реально есть в каталоге
    const categories = [...new Set(items.map((p) => p.category))].sort((a, b) =>
      a.localeCompare(b, 'ru')
    );

    this._element.innerHTML = `
      <h3 class="filter__title">Фильтры</h3>

      <div class="filter__group">
        <label class="filter__label" for="filter-search">Поиск</label>
        <input class="filter__input" id="filter-search" type="search" placeholder="Название чая..." />
      </div>

      <div class="filter__group">
        <p class="filter__label">Категория</p>
        <ul class="filter__list">
          ${categories
            .map(
              (cat) => `
            <li class="filter__item">
              <label class="filter__checkbox">
                <input type="checkbox" value="${cat}" />
                <span>${cat}</span>
              </label>
            </li>`
            )
            .join('')}
        </ul>
      </div>

      <div class="filter__group">
        <label class="filter__label" for="filter-price">
          Макс. цена: <span class="filter__price-value">${maxPrice.toLocaleString('ru-RU')} ₽</span>
        </label>
        <input class="filter__range" id="filter-price" type="range" min="0" max="${maxPrice}" value="${maxPrice}" />
      </div>

      <button class="filter__reset" type="button">Сбросить фильтры</button>
    `;

    this._bind();
  }

  _bind() {
    const search = this._element.querySelector('#filter-search');
    const range = this._element.querySelector('#filter-price');
    const priceLabel = this._element.querySelector('.filter__price-value');
    const reset = this._element.querySelector('.filter__reset');
    const checkboxes = this._element.querySelectorAll('input[type="checkbox"]');

    search.addEventListener('input', (e) => {
      this._state.search = e.target.value.trim().toLowerCase();
      this._emit();
    });

    range.addEventListener('input', (e) => {
      const v = Number(e.target.value);
      this._state.maxPrice = v;
      priceLabel.textContent = `${v.toLocaleString('ru-RU')} ₽`;
      this._emit();
    });

    checkboxes.forEach((cb) => {
      cb.addEventListener('change', () => {
        if (cb.checked) this._state.categories.add(cb.value);
        else this._state.categories.delete(cb.value);
        this._emit();
      });
    });

    reset.addEventListener('click', () => {
      this._state.categories.clear();
      this._state.search = '';
      this._state.maxPrice = Number(range.max);
      search.value = '';
      range.value = range.max;
      priceLabel.textContent = `${Number(range.max).toLocaleString('ru-RU')} ₽`;
      checkboxes.forEach((cb) => (cb.checked = false));
      this._emit();
    });
  }

  _emit() {
    if (this._onChange) this._onChange({ ...this._state, categories: new Set(this._state.categories) });
  }

  // Функция фильтрации
  static apply(items, state) {
    return items.filter((p) => {
      if (state.search && !p.name.toLowerCase().includes(state.search)) return false;
      if (state.categories.size && !state.categories.has(p.category)) return false;
      if (p.price > state.maxPrice) return false;
      return true;
    });
  }
}
