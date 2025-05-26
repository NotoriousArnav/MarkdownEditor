# Making Themes for Yame Markdown Editor

Yame supports custom themes using external CSS files. You can create your own theme to change the appearance of the editor, preview, toolbar, dialogs, and more.

## Quickstart: How to Make a Theme

1. **Create a CSS file** with your custom styles. You can use the roles and selectors provided by Yame for precise targeting.
2. **Host your CSS file** somewhere accessible (e.g., in the `public/` folder or on a CDN).
3. **Add your theme URL** in the Theme Selector or load it via the UI.

## Theme Structure & Roles

Yame uses [role] attributes on key elements for easy theming. Here are some important roles:

- `textarea[role='editor']` — The markdown editor textarea
- `div[role='preview']` — The rendered markdown preview
- `div[role='toolbar']` — The toolbar with all buttons
- `div[role='wordcount']` — The word count display
- `div[role='dialog']` — Modal dialogs
- `div#mdwindow` — The main preview window

You can use these selectors in your CSS to style the editor precisely.

### Example Theme (CSS)

```css
:root {
  --main-bg-color: #503047;
  --button-bg-color: #ed217c;
  --main-bg-color-2: #2d3047;
  --text-color: #fffd82;
  --text-color-2: #ff9b71;
  --font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
}

textarea[role='editor'] {
  background-color: var(--main-bg-color-2);
  color: var(--text-color);
  font-family: var(--font-family);
  border: 1px solid var(--button-bg-color);
}

div[role='toolbar'] {
  background-color: var(--main-bg-color-2);
  color: var(--text-color);
  font-family: var(--font-family);
}

/* ...and so on for other roles */
```

For a full real-world example, see [`public/space-cadet.css`](public/space-cadet.css).

## Tips
- Use CSS variables for easy color and font management.
- Test your theme in both light and dark modes if possible.
- Use the role selectors for maximum compatibility with future Yame updates.

## Loading Your Theme
1. Place your CSS file somewhere accessible (e.g., `/public/my-theme.css`).
2. Use the Theme Selector in Yame to add your theme by URL.
3. Your theme will be applied instantly.

---

If you need more advanced theming or run into issues, please open an issue or check the main README for updates.
