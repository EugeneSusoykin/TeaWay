export class Component {
  constructor(selector) {
    this._element = document.querySelector(selector);
  }

  render() {
    throw new Error('render() must be overridden');
  }

  show() {
    this._element.classList.remove('hidden');
  }

  hide() {
    this._element.classList.add('hidden');
  }
}
