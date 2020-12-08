import io from 'socket.io-client';
const socket = io('/things');
import Thimbleful from 'thimbleful';

// Global state

let currentThing = null;
let currentText = null;
let things = null;

// Server event handling

socket.on('things', newThings => {
  things = newThings;
  if ( !currentThing ) {
    currentThing = Object.keys(things)[0];
    currentText = things[currentThing];
  }

  renderLeftPanel();
  renderRightPanel();
});

socket.on('numClients', num => {
  const numClientsString = `${num} client${num == 1 ? '' : 's'} online`;
  document.getElementById('numClients').innerText = numClientsString;
});

// Browser event handling

Thimbleful.Click.instance().register('#things-list button', () => {
  // Add new thing
  const newThing = document.querySelector('#things-list input').value;
  if ( newThing ) socket.emit('add', newThing);
});

Thimbleful.Click.instance().register('#thing > button', () => {
  // Update thing
  currentText = document.querySelector('#thing textarea').value;
  socket.emit('edit', currentThing, currentText);
  document.querySelector('#thing #edited').classList.remove('active');
  document.querySelector('#thing #saved').classList.add('active');
  setTimeout(() => document.querySelector('#thing #saved').classList.remove('active'), 1000);
});

Thimbleful.Click.instance().register('#things-list li[data-thing]', e => {
  // "Navigation"
  currentThing = e.target.dataset.thing;
  currentText = things[currentThing];
  renderRightPanel(true);
  document.querySelector('#thing p').classList.remove('active');
  document.querySelector('#thing pre').classList.remove('active');
});

Thimbleful.Click.instance().register('#thing p button', () => {
  // Reload text
  currentText = things[currentThing];
  document.querySelector('#thing textarea').value = currentText;
  document.querySelector('#thing p').classList.remove('active');
});

window.addEventListener('load', () => {
  document.querySelector('#thing textarea').addEventListener('keyup', () => {
    if ( document.querySelector('#thing textarea').value == currentText )
      document.querySelector('#thing #edited').classList.remove('active');
    else
      document.querySelector('#thing #edited').classList.add('active');
  });
});

// Rendering stuff

function renderLeftPanel() {
  const template = Object.keys(things)
                         .map(thing => `<li data-thing="${thing}">${thing}</li>`)
                         .join('') +
                         `<li><input type='text' /><button>Add</button></li>`;
  document.querySelector('#things-list ul').innerHTML = template;
}

function renderRightPanel(force = false) {
  document.querySelector('#thing h2').innerText = currentThing;
  const text = document.querySelector('#thing textarea').value;
  if ( force || !text || text == currentText ) {
    currentText = things[currentThing];
    document.querySelector('#thing textarea').value = currentText;
  } else
    document.querySelector('#thing p').classList.add('active');
}
