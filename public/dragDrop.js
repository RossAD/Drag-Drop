
var picBox = document.getElementsByClassName("picBox")[0];
var imgDivs = document.querySelectorAll('.picBox div');
// Container for swapping div/images
var dragSrcImg = null;

// Get JSON file from server
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://localhost:8080/picList.json', true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState === 4 && xobj.status === 200) {
      callback(xobj.responseText);
    }
  }
  xobj.send(null);
}

// Populate HTML with images/elements and listeners for drag and drop
function populateImages() {
  loadJSON((response) => {
    var picList = JSON.parse(response).pics;
    for(var i in picList){
      var imgContainer = document.createElement('div');
      var newImg = document.createElement('img');

      picBox.appendChild(imgContainer);
      imgContainer.setAttribute('id', i);
      imgContainer.setAttribute('hasImg', true);

      var divBox = picBox.lastElementChild;
      divBox.appendChild(newImg);
      newImg.setAttribute('src', picList[i]);
      newImg.setAttribute('class', 'image');
      newImg.setAttribute('alt', 'image');
      imgContainer.setAttribute('draggable', true);
      addListeners(imgContainer);
    }
  })
}
populateImages();

/*
 * Listeners for drag and drop of images
 */

function handleDragStart(ev) {
  dragSrcImg = this;

  ev.dataTransfer.effectAllowed = 'move';
  ev.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(ev) {
  // Allow container to be droppable
  if(ev.preventDefault) {
    ev.preventDefault();
  }

  ev.dataTransfer.dropEffect = 'move';

  return false;
}

// Class removal and addition for future css events
function handleDragEnter(ev) {
  this.classList.add('over');
}

function handleDragLeave(ev) {
  this.classList.remove('over');
}

function handleDrop(ev) {
  if(ev.stopPropagation) {
    ev.stopPropagation();
  }
  // Prevent default action of browser to open image (ie. Firefox)
  ev.preventDefault();
  // Swap logic
  if(dragSrcImg != this) {
    dragSrcImg.innerHTML = this.innerHTML;
    this.innerHTML = ev.dataTransfer.getData('text/html');
  }
  return false;
}

function handleDragEnd(ev) {
  [].forEach.call(imgDivs, (img) => {
    img.classList.remove('over');
  })
}
// Function to add listeners to each image div
function addListeners(ev) {
  ev.addEventListener('dragstart', handleDragStart, false);
  ev.addEventListener('dragenter', handleDragEnter, false);
  ev.addEventListener('dragover', handleDragOver, false);
  ev.addEventListener('dragleave', handleDragLeave, false);
  ev.addEventListener('drop', handleDrop, false);
  ev.addEventListener('dragend', handleDragEnd, false);
}
