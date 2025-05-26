// Example extension: Adds a button to the toolbar that shows a toast when clicked
export default class AddButtonToToolbar {
  constructor() {
    // Wait for the toolbar to be available in the DOM
    this.addButtonWhenReady();
  }

  addButtonWhenReady() {
    const tryAdd = () => {
      // Find the toolbar (edit mode only)
      const toolbar = document.querySelector("div[role='toolbar']");
      if (toolbar && !toolbar.querySelector("#yame-ext-demo-btn")) {
        this.addButton(toolbar);
      } else {
        // Try again in 500ms if not found
        setTimeout(tryAdd, 500);
      }
    };
    tryAdd();
  }

  addButton(toolbar) {
    const btn = document.createElement('button');
    btn.id = 'yame-ext-demo-btn';
    btn.setAttribute('role', 'button');
    btn.className = 'h-8 w-8 p-0 bg-pink-600 rounded ml-2';
    btn.title = 'Extension Demo Button';
    btn.innerHTML = '🎉';
    btn.onclick = () => {
      if (window.yame && window.yame.toast) {
        window.yame.toast({
          title: 'Extension Button Clicked!',
          description: 'This toast was triggered by an extension.',
        });
      } else {
        alert('Extension Button Clicked!');
      }
    };
    toolbar.appendChild(btn);
  }

  // Optional: clean up if extension is removed (not enforced)
  // destroy() {
  //   const btn = document.getElementById('yame-ext-demo-btn');
  //   if (btn) btn.remove();
  // }
}
