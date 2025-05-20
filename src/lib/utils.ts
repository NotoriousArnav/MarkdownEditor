// @/lib/utils
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

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

export async function fetchFromUrl(url: string) {
  const result = await axios.get(url);
  return result.data
}

export async function shareFile(
    data: string,
    name: string,
    time: int = 24,
    toast = (obj) => {alert(`${obj.title}\n${obj.description}`)},
    instance: string = "https://share.nnisarg.in/",
  ) {
  const formData = new FormData();
  const file = new File(
    [data],
    name,
    { 
      type: 'text/markdown'
    }
  );
  formData.append('file', file);
  formData.append('time', '24'); // 24 hours
  const response = await axios.post(
    instance,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }    
    }).catch((error) => {
      toast({
        title: `Error: Could not share file`,
        description: `Error: ${error}`,
        variant: "destructive",
      });
      console.log("Error sharing file:", error);
    });
    return response.data;
}

// @ts-ignore
// eslint-disable-next-line
//window.fetchFromUrl = fetchFromUrl

// @ts-ignore
// eslint-disable-next-line
window.axios = axios
