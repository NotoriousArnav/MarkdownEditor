# Making Extensions for Yame Markdown Editor

Yame supports dynamic extensions written in JavaScript. Extensions can add features, UI, or interact with the editor. **All extensions must use a default export that is a class.**

## Extension Structure

- The extension file must be a JavaScript module (ESM).
- The default export must be a class (not an object or function).
- The class can have any methods or properties, but the constructor and an optional `init()` method will be called automatically.

### Example Extension

```js
// example_ext.js
export default class ExampleExtension {
  static name = "Example Extension";
  static version = "1.0.0";
  static description = "A simple example extension for Yame Markdown Editor.";

  constructor() {
    // Runs when the extension is loaded
    // You can set up state, add UI, etc.
    if (window.yame && window.yame.toast) {
      window.yame.toast({
        title: "Example Extension Loaded! (constructor)",
        description: "The example extension's constructor has run.",
      });
    } else {
      alert("Example Extension Loaded! (constructor)");
    }
    // You can also expose new commands, toolbar buttons, etc.
    window.sayHelloFromExampleExt = () => alert("Hello from Example Extension!");
  }

  init() {
    // Optional: called after construction
    // Use this for additional setup if needed
    if (window.yame && window.yame.toast) {
      window.yame.toast({
        title: "Example Extension Initialized! (init)",
        description: "The example extension's init() was called.",
      });
    }
  }
}
```

## How Extensions Are Loaded

- When you add an extension URL in the Extension Manager, Yame will dynamically import the file.
- The default export is instantiated (constructor runs).
- If the class has an `init()` method, it is called after construction.
- The extension instance is kept in memory for the session.

## Extension API

Extensions can access the global `window.yame` object, which provides:
- `toast`: Show notifications in the editor.
- `handleToolbarAction`, `handleSaveToLocalStorage`, etc.: Useful editor actions.
- You can also add your own global functions or UI.

## Best Practices

- Always use a class as the default export.
- Avoid polluting the global namespace except for intended APIs.
- Clean up any DOM/UI you add if your extension is removed (optional, not yet enforced).

## Breaking Changes

- **Legacy object-based extensions are no longer supported.**
- Only class-based default exports are allowed.

## Loading Your Extension

1. Place your extension JS file somewhere accessible (e.g., `/public/example_ext.js`).
2. In the Extension Manager, add the full URL to your extension file.
3. The extension will load and initialize automatically.

---

For more advanced integration, see the main README or open an issue for feature/API requests.
