console.log("extension loaded!");

browser.menus.create({
  id: "gtrlate-popup",
  title: "GTranslate",
  contexts: ["selection"]
});

browser.menus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId == "gtrlate-popup") {
    let sourceText = '';

    if (info.selectionText) {
      translateText(info.selectionText, tab)
    }
  }
});

async function translateText(sourceText, tab) {
  let translatedText = '';
  let sourceLang = 'auto';
  let targetLang = 'ru';
  let url = "https://translate.googleapis.com/translate_a/single";
  let data = {
    client: 'gtx',
    sl: sourceLang,
    tl: targetLang,
    dt: 't',
    q: sourceText
  };

  url = url + '?' + queryString(data);

  let response = await fetch(url)
    .then(response => response.body)
    .then(rb => {
      const reader = rb.getReader();

      return new ReadableStream({
        start(controller) {
          // The following function handles each data chunk
          function push() {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then( ({done, value}) => {
              // If there is no more data to read
              if (done) {
                controller.close();
                return;
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value);
              // Check chunks by logging to the console
              push();
            })
          }
          push();
        }
      });
    })
    .then(stream => {
      // Respond with our stream
      return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
    })
    .then(result => {
      return result;
    })
    .catch(function (err) {
      console.log('fetch failed', err);
    })

  translatedText = JSON.parse(response)[0][0][0];

  browser.tabs.sendMessage(1, {
    command: "translate",
    text: translatedText
  }); 
}

function queryString(data) {
  let res = '';

  for (const prop in data) {
    if (prop == 'q') {
      data[prop] = encodeURI(data[prop]); 
      res += prop + '=' + data[prop]; 
    } else {
      res += prop + '=' + data[prop] + '&'; 
    }
  }

  return res;
}

browser.tabs.executeScript({file: "/content/script.js"})
  .then({})
  .catch({});
