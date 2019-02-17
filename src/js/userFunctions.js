/* global smallAngular */

function setNameIvan() {
  this.name = 'ivan';
}

function setNameToEmpty() {
  this.name = '';
}

function increaseTextLength() {
  this.textLength += 5;
}

function decreaseTextLength() {
  if (this.textLength > 0) {
    this.textLength -= 5;
  }
}

// ====================================

smallAngular.addUserFunction(setNameIvan);
smallAngular.addUserFunction(setNameToEmpty);
smallAngular.addUserFunction(increaseTextLength);
smallAngular.addUserFunction(decreaseTextLength);