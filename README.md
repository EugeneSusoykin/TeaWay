# Чайный Путь

Клиентская часть веб-приложения интернет-магазина по продаже китайского чая. Vanilla JS + Vite, без фреймворков.

## Стек

- HTML5 / CSS3 (Flexbox, Grid, CSS Custom Properties)
- JavaScript ES6+ (модули, классы)
- Vite
- ESLint + Prettier
- БЭМ-нейминг

## Запуск

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Структура

```
src/
  blocks/         # БЭМ-блоки (header, product-card, catalog, filter, cart)
  utils/          # базовый класс Component
  api/            # клиент TeaAPI
  styles/         # глобальные стили и переменные
  pages/          # 4 HTML-страницы
  index.js        # точка входа
```

Данные о товарах берутся из собственного moc-API https://github.com/EugeneSusoykin/TeaAPI — на их
основе подменяются названия, фотографии, описания, чтобы получился чайный каталог.
Корзина хранится в `localStorage`.
