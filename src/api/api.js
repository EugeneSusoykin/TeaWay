// Клиент mock-API (TeaAPI).


export class Api {
  constructor(baseUrl) {
    this._baseUrl = baseUrl.replace(/\/$/, '');
  }

  _checkResponse(res) {
    if (!res.ok) {
      return Promise.reject(new Error(`Ошибка запроса: ${res.status}`));
    }
    return res.json();
  }

  _absolutize(tea) {
    return { ...tea, image: this._baseUrl + tea.image };
  }

  getProducts() {
    return fetch(`${this._baseUrl}/api/teas.json`)
      .then((res) => this._checkResponse(res))
      .then((items) => items.map((t) => this._absolutize(t)));
  }

  getProductById(id) {
    return fetch(`${this._baseUrl}/api/teas/${id}.json`)
      .then((res) => this._checkResponse(res))
      .then((t) => this._absolutize(t));
  }

  getCategories() {
    return fetch(`${this._baseUrl}/api/categories.json`).then((res) =>
      this._checkResponse(res)
    );
  }
}
