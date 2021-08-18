function insertTranslate(text) {
  let element = document.getElementById('gtranslate');

  if (element) {
    element.remove();
  }

  let div = document.createElement('div');
  div.innerText = text;
  div.setAttribute('id', 'gtranslate');
  div.style.position = 'absolute';
  div.style.fontSize = '12px';
  div.style.padding = '5px';
  div.style.background = 'rgba(0,0,0,0.7)';
  div.style.color = '#fff';
  div.style.minWidth = '200px';
  div.style.left = '50%';
  div.style.top = '50%';
  div.style.transform = 'translate(-50%, 50%)';

  document.body.appendChild(div);
}

browser.runtime.onMessage.addListener((message) => {
  if (message.command === 'translate') {
    insertTranslate(message.text);
  }
});

