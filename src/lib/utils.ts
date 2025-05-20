// @/lib/utils
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SWFTInstance = import.meta.env.VITE_SWFT_INSTANCE || "https://share.nnisarg.in/";

// @ts-ignore
// eslint-disable-next-line
window.SWFTInstance = SWFTInstance

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

export async function fetchFromUrl(url: string) {
  const result = await axios.get(url);
  return result.data
}

export async function shareFile(
  data: string,
  name: string,
  expiry_time: string = '24', // in hours and as a string
  toast: (obj: { title: string, description: string, variant?: 'default' | 'destructive' }) => void = ({ title, description, variant }) => {
    alert(`${title}\n${description}`);
  },
  instance: string = SWFTInstance,
): Promise<any | undefined> {
  try {
    const formData = new FormData();
    const file = new File([data], name, { type: 'text/markdown' });
    formData.append('file', file);
    formData.append('time', expiry_time);

    const response = await axios.post(instance, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    return response.data;

  } catch (error: any) {
    toast({
      title: `Could not share file`,
      description: `Error: ${error.response.data}`,
      variant: 'destructive',
    });
    console.error("Error sharing file:", error.response.data);
    return undefined;
  }
}

// @ts-ignore
// eslint-disable-next-line
//window.fetchFromUrl = fetchFromUrl

// @ts-ignore
// eslint-disable-next-line
window.axios = axios
