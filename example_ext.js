// Example Yame Extension
export default class YameExt {
  static name = "Example Extension";
  static version = "1.0.0";
  static description = "A simple example extension for Yame Markdown Editor.";

  constructor() {
    // This runs when the extension is loaded
    if (typeof window !== 'undefined') {
      // Example: Show a notification
      if (window.yame && window.yame.toast) {
        window.yame.toast({
          title: "Example Extension Loaded! (constructor)",
          description: "The example extension's constructor has run.",
        });
      } else {
        alert("Example Extension Loaded! (constructor, Yame toast unavailable)");
      }
    }
    // Expose a demo function
    window.sayHelloFromExampleExt = () => alert("Hello from Example Extension!");
  }

  static init() {
    // This can be used for additional setup after construction
    if (window.yame && window.yame.toast) {
      window.yame.toast({
        title: "Example Extension Initialized! (init)",
        description: "The example extension's init() was called.",
      });
    }
  }
}
