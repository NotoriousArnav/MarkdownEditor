// Example extension for Yame, that adds a custom functionality to the editor.

export const YameExt = {
  YameExt: {
    extInfo: {
      name: "Example Extension",
      description: "An example extension for Yame that demonstrates how to create a custom extension.",
      author: "Arnav Ghosh",
      version: "1.0.0"
    },

    init: () => {
      console.log("Yame Extension Initialized: " + YameExt.YameExt.extInfo.name);
      window.yame.toast({
        title: "Foo",
        description: "Bar"
      })
    }

  }
}
