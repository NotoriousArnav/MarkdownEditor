import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function inlineAllStyles(el: HTMLElement): string {
  const clone = el.cloneNode(true) as HTMLElement;

  const walk = (node: Element) => {
    const style = window.getComputedStyle(node);
    const cssText = Array.from(style)
      .map(key => `${key}:${style.getPropertyValue(key)};`)
      .join('');
    (node as HTMLElement).setAttribute('style', cssText);

    for (let i = 0; i < node.children.length; i++) {
      walk(node.children[i]);
    }
  };

  walk(clone);
  return clone.outerHTML;
}
