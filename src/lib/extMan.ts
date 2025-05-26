// Extension manager

export type ExtensionModule = any; // You can define a stricter type if needed

const EXT_STORAGE_KEY = 'yame_extensions';

class ExtensionManager {
  private extensions: Record<string, ExtensionModule> = {};
  private urls: string[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    localStorage.setItem(EXT_STORAGE_KEY, JSON.stringify(this.urls));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(EXT_STORAGE_KEY);
    if (stored) {
      try {
        this.urls = JSON.parse(stored);
        this.urls.forEach(url => this.loadExtension(url));
      } catch (e) {
        this.urls = [];
      }
    }
  }

  async loadExtension(url: string): Promise<ExtensionModule | null> {
    if (this.extensions[url]) return this.extensions[url];
    try {
      const mod = await import(/* @vite-ignore */ url);
      // Only support default export as a class/function
      let extInstance;
      if (mod.default && typeof mod.default === 'function') {
        extInstance = new mod.default();
        if (typeof extInstance.init === 'function') {
          extInstance.init();
        }
      } else {
        throw new Error('Extension must have a default export that is a class or function.');
      }
      this.extensions[url] = extInstance;
      if (!this.urls.includes(url)) {
        this.urls.push(url);
        this.saveToStorage();
      }
      return extInstance;
    } catch (e) {
      console.error('Failed to load extension:', url, e);
      return null;
    }
  }

  removeExtension(url: string) {
    delete this.extensions[url];
    this.urls = this.urls.filter(u => u !== url);
    this.saveToStorage();
  }

  getLoadedExtensions(): Record<string, ExtensionModule> {
    return this.extensions;
  }

  getExtensionUrls(): string[] {
    return this.urls;
  }
}

export const extMan = new ExtensionManager();
