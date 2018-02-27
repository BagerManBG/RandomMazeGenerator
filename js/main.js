/* Settings Start */
let time;

const rows = prompt('Number of column and rows?');
const cols = rows;
const mazeSize = prompt('Size of maze in pixels?');

const instantMaze = !confirm('Use non instant builder?');

if(!instantMaze) {
  time = prompt('Speed of maze builder in miliseconds?');
}
/* Settings End */

const w = mazeSize / cols - 2; //width of a single cell

const mazeElem = $('#maze');
const cellBackGrColor = '#000000';
const cellOutlineColor = '#FFFFFF';

let stack = [];
let interval;

let currElem;
let nextElem;

let matrix = [];
let current = {
  'x': 0,
  'y': 0,
  'index': 0,
  'move': () => {
    let selected = current.selectNeighbour();

    if (selected !== -1) {

      selected.visited = true;
      matrix[selected.index] = selected;

      if (selected.y == current.y - 1) {

        for(let i = 0; i < rows; i++) {
          nextElem = nextElem.prev()
        }

        currElem.css('borderTop', '1px solid rgba(0,0,0,0)');
        nextElem.css('borderBottom', '1px solid rgba(0,0,0,0)');
      }
      if (selected.x == current.x + 1) {

        nextElem = nextElem.next();

        currElem.css('borderRight', '1px solid rgba(0,0,0,0)');
        nextElem.css('borderLeft', '1px solid rgba(0,0,0,0)');
      }
      if (selected.y == current.y + 1) {

        for (let i = 0; i < rows; i++) {
          nextElem = nextElem.next();
        }

        currElem.css('borderBottom', '1px solid rgba(0,0,0,0)');
        nextElem.css('borderTop', '1px solid rgba(0,0,0,0)');
      }
      if (selected.x == current.x - 1) {

        nextElem = nextElem.prev();

        currElem.css('borderLeft', '1px solid rgba(0,0,0,0)');
        nextElem.css('borderRight', '1px solid rgba(0,0,0,0)');
      }

      current.x = selected.x;
      current.y = selected.y;
      current.index = selected.index;

      currElem.addClass('visited');

      stack.push(selected);

    } else {
      selected = stack[stack.length - 2];
      stack.pop();

      if (selected.y == current.y - 1) {

        for (let i = 0; i < rows; i++) {
          nextElem = nextElem.prev()
        }
      }
      if (selected.x == current.x + 1) {

        nextElem = nextElem.next();
      }
      if (selected.y == current.y + 1) {

        for (let i = 0; i < rows; i++) {
          nextElem = nextElem.next();
        }
      }
      if (selected.x == current.x - 1) {

        nextElem = nextElem.prev();
      }

      current.x = selected.x;
      current.y = selected.y;
      current.index = selected.index;

      currElem.addClass('revisited');

      if (current.index == 0) {
        clearInterval(interval);
      }
    }

    currElem.removeClass('current');
    nextElem.addClass('current');

    currElem = nextElem;
  },
  'selectNeighbour': () => {
    let neighbours = current.getNeighbours();

    if (neighbours.length !== 0) {
      let selected = neighbours[Math.floor(Math.random() * neighbours.length)];
      return selected;
    } else {
      return -1;
    }
  },
  'getNeighbours': () => {

    let neighbours = [
      matrix[getIndex(current.x + 1, current.y)],
      matrix[getIndex(current.x, current.y + 1)],
      matrix[getIndex(current.x, current.y - 1)],
      matrix[getIndex(current.x - 1, current.y)]
    ];

    for (let i = 0; i < neighbours.length; i++) {
      if (neighbours[i] == undefined || neighbours[i].visited) {
        neighbours.splice(i, 1);
        i--;
      }
    }

    return neighbours;
  }
};

$(document).ready(function () {

  css();
  initialize();

  if (instantMaze) {

    // Instant Maze
    do {
      current.move();
    }
    while(current.index != 0);

  } else {

    // Interval Maze
    interval = setInterval(current.move, time);
  }
});

function css () {
  mazeElem.css({
    'width': mazeSize + 'px',
    'height': mazeSize + 'px'
  });
}

function initialize () {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      
      let cellElem = $('<div class="cell" id="' + x + ',' + y + '"></div>');
      mazeElem.append(cellElem);

      let cell = new Cell(x, y);

      if (x === 0 && y === 0) {
        cell.visited = true;
        stack.push(cell);

        cellElem.addClass('current');

        currElem = cellElem;
        nextElem = cellElem;
      }

      matrix.push(cell);      
      
      cellElem.css({
        'width': w + 'px',
        'height': w + 'px',
        'float': 'left',
        'border': '1px solid ' + cellOutlineColor,
        'backgroundColor': cellBackGrColor
      });
    }
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.index = this.x * rows + this.y;
    this.visited = false;
  }
}

function getIndex(x, y) {
  if (x >= 0 && x < rows && y >= 0 && y < cols) {
    return x * rows + y;
  }
}