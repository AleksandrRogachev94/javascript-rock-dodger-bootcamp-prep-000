//----------------------------------------------------------------------------------------------
// Global constants

const DODGER = document.getElementById('dodger');
const GAME = document.getElementById('game');

const GAME_HEIGHT = 400;
const GAME_WIDTH = 400;
const ROCK_SIZE = 20;
const DODGER_HEIGHT = 20;
const DODGER_WIDTH = 40;

const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const ROCKS = [];
const START = document.getElementById('start');

var gameInterval = null;

var DodgerLeft = positionToInteger(DODGER.style.left); // Current postion of a dodger.
var idDodgerMove = null; // for cancelAnimationFrame
var cnt = 0; // Score.
var flGame = false;

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

//----------------------------------------------------------------------------------------------
// Check if rock collides with dodger.

function checkCollision(rock) {

  const top = positionToInteger(rock.style.top);

  if (top > GAME_HEIGHT - ROCK_SIZE - DODGER_HEIGHT) {
    const dodgerLeftEdge = positionToInteger(DODGER.style.left);
    const dodgerRightEdge = dodgerLeftEdge + DODGER_WIDTH;

    const rockLeftEdge = positionToInteger(rock.style.left);
    const rockRightEdge = rockLeftEdge + ROCK_SIZE;

    if((rockLeftEdge < dodgerLeftEdge) && (rockRightEdge > dodgerLeftEdge)) return true;
    if((rockLeftEdge > dodgerLeftEdge) && (rockRightEdge < dodgerRightEdge)) return true;
    if((rockLeftEdge < dodgerRightEdge) && (rockRightEdge > dodgerRightEdge)) return true;
  }
  return false;
}

//----------------------------------------------------------------------------------------------
// Creating the rock.

function createRock(x) {

  const rock = document.createElement('div')
  rock.className = 'rock'
  rock.style.left = `${x}px`

  var top = 0;
  rock.style.top = `${top}px`;

  GAME.appendChild(rock);


   // This function moves the rock. (2 pixels at a time)

  function moveRock() {

     if(checkCollision(rock)) {
      endGame(); return;
    }

    rock.style.top = `${top += 2}px`;
    if(top < GAME_HEIGHT) window.requestAnimationFrame(moveRock);

    else {
      rock.remove(); cnt++;
    }
  }

  // Start of animation.
  window.requestAnimationFrame(moveRock);
  ROCKS.push(rock);

  return rock;
}

//----------------------------------------------------------------------------------------------
// Action at the end of a game.

function endGame() {

  if(flGame === false) return;
  flGame = false;

  clearInterval(gameInterval);
  window.removeEventListener('keydown', moveDodger);
  if(idDodgerMove != null) window.cancelAnimationFrame(idDodgerMove);

  for(var i = 0; i < ROCKS.length; i++) ROCKS[i].remove(); // Removing from the DOM.
  ROCKS.length = 0;
  alert('Good job! Your score is ' + cnt);

  DODGER.style.display = 'none';
}

//----------------------------------------------------------------------------------------------
// Moving the dodger.

function moveDodger(e) {

   const key = parseInt(e.detail || e.which);
   if(key === LEFT_ARROW) moveDodgerLeft();
   if(key === RIGHT_ARROW) moveDodgerRight();
}

//----------------------------------------------------------------------------------------------
// Moving the dodger to the left corner (4 pixels at a time).

function moveDodgerLeft() {

   // Cancelling animation of  moveDodgerRight.
  if(idDodgerMove !== null) window.cancelAnimationFrame(idDodgerMove);
  if(DodgerLeft <= 0) return;

  function step() {
    DODGER.style.left = `${DodgerLeft -= 4}px`;
    if(DodgerLeft > 0) idDodgerMove = window.requestAnimationFrame(step);
  }

  idDodgerMove = window.requestAnimationFrame(step);
}

//----------------------------------------------------------------------------------------------
// Moving the dodger to the right corner (4 pixels at a time).

function moveDodgerRight() {

   // Cancelling animation of  moveDodgerLeft.
   if(idDodgerMove !== null) window.cancelAnimationFrame(idDodgerMove);

   if(DodgerLeft >= (GAME_WIDTH - DODGER_WIDTH)) return;

    function step() {
      DODGER.style.left = `${DodgerLeft += 4}px`;
      if(DodgerLeft < (GAME_WIDTH - DODGER_WIDTH)) idDodgerMove = window.requestAnimationFrame(step);
    }

  idDodgerMove = window.requestAnimationFrame(step);
}

/**
 * @param {string} p The position property
 * @returns {number} The position as an integer (without 'px')
 */
function positionToInteger(p) {
  return parseInt(p.split('px')[0]) || 0
}

//----------------------------------------------------------------------------------------------
// Start function.

function start() {

  flGame = true; // Starting a game.

  // Lsitening of arrows
  window.addEventListener('keydown', moveDodger);

  START.style.display = 'none';

  // Creating of rocks.
  gameInterval = setInterval(function() {
    createRock(Math.floor(Math.random() *  (GAME_WIDTH - 20)));
  }, 600);
}
