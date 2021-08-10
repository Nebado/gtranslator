console.log("extension loaded!");

browser.menus.create({
  id: "gtrlate-popup",
  title: "Translate",
  contexts: ["selection"]
});

browser.menus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId == "gtrlate-popup") {
    console.log(info.selectionText);
  }
});
