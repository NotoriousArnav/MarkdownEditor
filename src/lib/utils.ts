// @/lib/utils
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SWFTInstance = import.meta.env.VITE_SWFT_INSTANCE || "https://shareb.in/";

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
    // shareb.in expects expiry as a number (hours)
    formData.append('expiry', expiry_time);
    
    // Generate a custom code that includes the filename
    // Add random string to avoid collisions and make it URL-safe
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedFilename = name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const customCode = `${randomString}-${sanitizedFilename}`;
    formData.append('custom_code', customCode);

    const response = await axios.post(instance, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    // shareb.in returns: { detail: "...", data: { filename, url, expiry } }
    // Extract the URL which now includes the custom code with filename
    if (response.data && response.data.data && response.data.data.url) {
      return response.data.data.url;
    }
    
    // Fallback to raw response for compatibility with other services
    return response.data;

  } catch (error: any) {
    toast({
      title: `Could not share file`,
      description: `Error: ${error.response?.data || error.message}`,
      variant: 'destructive',
    });
    console.error("Error sharing file:", error.response?.data || error.message);
    return undefined;
  }
}

// @ts-ignore
// eslint-disable-next-line
//window.fetchFromUrl = fetchFromUrl

// @ts-ignore
// eslint-disable-next-line
window.axios = axios
