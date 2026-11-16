// Minimal stand-in for the browser DOM so hint/explain pictures can be built in Node tests.

class FakeNode {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.attributes = {};
    this.style = {};
    this.className = '';
    this.textContent = '';
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  setAttribute(k, v) {
    this.attributes[k] = String(v);
  }
  append(...nodes) {
    this.children.push(...nodes);
  }
  addEventListener() {}
}

globalThis.document ??= {
  createElement: (tag) => new FakeNode(tag),
  createElementNS: (_ns, tag) => new FakeNode(tag),
  createTextNode: (text) => ({ textContent: text }),
};
