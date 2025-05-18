# YAME: Yet another Markdown Editor
YAME is a simple and lightweight Markdown editor built with React. It allows users to write and preview Markdown content in real-time.
Made in 1 day for fun, lol

## Features
- Supports Github, Notion, Dev.to and Medium markdown flavors
- ~Meth~ Math Support
- Allows exporting to PDF and HTML
- Minimal and Lightweight (debatable, but atleast its lighter than ur mom)
- No Server-side dependencies (Really)
- Autosave
- Toggle Preview Mode using URL bar, just add `?preview=true` to the URL
- Fetch Remote file with `?fetchFrom=theUrl`
- File Open, Local and Remote

## TODOS:
- **MAIN FOCUS RIGHT NOW** PWA Support especially for Android and Chrome OS Devices like Chromebooks and Android Tablets
- **MAIN FOCUS** Extensions Support to allow devs to make custom extensions and add them to the editor
- File Sharing Support to allow sharing Markdown content as mini websites **Trying but failing to do, because I hate centralization**
- Multi File Support to allow multiple tabs and allow Notebook like functionality like Obsidian **Sometimes I think this is unnecessary**
- Clean the global namespace by changing `window.blahblah` to `window.yame.blahblah` **Very important**
- Allow custom themes **Yeah man, this is a TODO**
- Allow changing Code Block Themes
- Add more Markdown flavors
- Get a Nice Logo **Important**

[![A Demo](https://i.ytimg.com/vi/ufgCsc758yw/hqdefault.jpg "Markdown Editor")](https://www.youtube.com/watch?v=ufgCsc758yw)

## Running
### Clone Repo
To clone this Repo:
```bash
git clone https://github.com/NotoriousArnav/MarkdownEditor.git
```
### Install Dependencies
To Install Dependencies run:
```bash
npm i
```

### Development Server
To run the application, use the following command:
```bash
npm run dev
```
### Build
#### Build for production
To build the application for production, use the following command:
```bash
npm run build
```
#### Build for development
To build the application for development, use the following command:
```bash
npm run build:dev
```
