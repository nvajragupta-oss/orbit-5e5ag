// Tiny DOM helpers so screens stay short and readable.

/**
 * el('button', { class: 'btn', text: 'Go', onclick: fn }, child1, child2)
 * Special props: class, text, html, style (object), on<event> (function).
 */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key === 'style' && typeof value === 'object') {
      for (const [prop, v] of Object.entries(value)) {
        if (prop.startsWith('--')) node.style.setProperty(prop, v); // CSS variables
        else node.style[prop] = v;
      }
    }
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    node.append(typeof child === 'object' ? child : document.createTextNode(String(child)));
  }
  return node;
}

/**
 * Calls onLong after the pointer is held down for `ms`.
 * Returns a function that tells you whether the last press was a long one
 * (so a normal click handler can ignore it).
 */
export function onLongPress(node, ms, onLong, onProgress) {
  let timer = null;
  let fired = false;
  const cancel = () => {
    clearTimeout(timer);
    timer = null;
    onProgress?.(false);
  };
  node.addEventListener('pointerdown', () => {
    fired = false;
    onProgress?.(true);
    timer = setTimeout(() => {
      fired = true;
      onProgress?.(false);
      onLong();
    }, ms);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => node.addEventListener(ev, cancel));
  node.addEventListener('contextmenu', (e) => e.preventDefault());
  return () => fired;
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
