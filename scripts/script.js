"use strict";

let allWords = [...allFiveLetterWords];

const nmbrOfLttrs = 5;

const modeSwitch = document.getElementById("toggle-switch");
const modeText = document.getElementById("toggle-switch-text");
const rightHeader = document.getElementById("right-heading");
const lttrsBttns = document.getElementById("letters-buttons");
const againBttn = document.getElementById("againButton");
const notes1 = document.getElementById("notes1");
const notes2 = document.getElementById("notes2");
const lfthdng = document.getElementById("left-heading");
const chckbttn = document.getElementById("goButton");
const clrTxtBttn = document.getElementById("clearTextButton");
const downEmoji = "👇";

const letter1 = document.getElementById("letter--1");
const letter2 = document.getElementById("letter--2");
const letter3 = document.getElementById("letter--3");
const letter4 = document.getElementById("letter--4");
const letter5 = document.getElementById("letter--5");
const chckBttn = document.getElementById("goButton");
const wordsDisplay = document.getElementById("wordsDiv");
const tryAgain = document.getElementById("againButton");

const letters = [letter1, letter2, letter3, letter4, letter5];

let wordsWithDoubleLetters = [];
let possibleLetters = {};
let notPossibleLetters = [];
const blankChar = ".";
const emptyWord = blankChar.repeat(nmbrOfLttrs);
let enteredWord = emptyWord;
let wordsWithoutDoubleLetters = "";

const clearInputFields = () => letters.forEach((letter) => (letter.value = ""));

const clearColors = () =>
  letters.forEach((letter) => (letter.style.backgroundColor = ""));

const clearAll = () => {
  clearColors();
  clearInputFields();
};

clrTxtBttn.addEventListener("click", clearAll);

const changeBackgroundColor = () => {
  let fieldColor = document.getElementById(document.activeElement.id).style;

  if (fieldColor.backgroundColor === "") {
    fieldColor.backgroundColor = "orange";
  } else if (fieldColor.backgroundColor === "orange") {
    fieldColor.backgroundColor = "green";
  } else {
    fieldColor.backgroundColor = "";
  }
};

function letterFieldPressed(e) {
  const i = e.path[0].id[8] - 1;
  const x = e.key;
  const prevLttr = letters[i - 1];
  if (x === "Backspace" && letters[i].value === "") {
    //so backspace doesn't work on an empty field
    prevLttr && prevLttr.focus();
  }
}

letters.forEach((letter, i) => {
  letter.addEventListener("input", function (event) {
    const x = event.data;
    const i = event.target.id[8] - 1;
    const nextLttr = letters[i + 1];
    const alphaLetters = /[a-zA-Z]/;
    const a = letter.value;
    const b = letter.value.length;
    if (letter.value !== "") {
      if (b === 1) {
        if (x.match(alphaLetters)) {
          nextLttr && nextLttr.focus();
        } else {
          letter.value = "";
        }
      } else if (b === 2) {
        if (a[1].match(alphaLetters)) {
          letter.value = a[1];
          nextLttr && nextLttr.focus();
        } else {
          letter.value = a[0];
        }
      }
    }
  });

  letter.addEventListener("dblclick", changeBackgroundColor);
});

const getAllWordsWithDoubleLetters = function (arr) {
  arr.forEach((word) => {
    for (let i = 0; i < word.length; i++) {
      if (word.split(`${word[i]}`).length > 2) {
        wordsWithDoubleLetters.push(word);
        return;
      }
    }
  });

  return function (arrayWithWordsWithDoubleLetters) {
    const localArr = [...arr];
    arrayWithWordsWithDoubleLetters.forEach((word) => {
      localArr.splice(arr.indexOf(word), 1);
    });
    return localArr;
  };
};

const setWordsDisplay = (words) => {
  wordsDisplay.textContent = words.join(",").replaceAll(",", "\n");
};

const setArrayWithWordsWithoutDoubleLetters =
  getAllWordsWithDoubleLetters(allWords);

wordsWithoutDoubleLetters = setArrayWithWordsWithoutDoubleLetters(
  wordsWithDoubleLetters
);

setWordsDisplay(wordsWithoutDoubleLetters);

const replaceCharAt = function (index, replacement, str) {
  //Error handling
  if (index >= str.length) {
    return str.valueOf();
  }

  return str.substring(0, index) + replacement.value + str.substring(index + 1);
};

const getWordsWithALetterInIt = function (arr, letter) {
  const arr2 = arr.filter((word) => word.includes(letter));
  return arr2;
};

const getWord = () => {
  let word = "";
  letters.forEach((letter) => {
    word += letter.value;
  });
  return word;
};

const wordsWithDefiniteLetters = function () {
  //No letters known for certain
  if (enteredWord !== emptyWord) {
    const regWord = new RegExp(enteredWord, "g");
    return allWords.filter(
      (word) => word.match(regWord) && !word.match(getWord())
    );
  } else {
    return allWords;
  }
};

const wordsWithPossibleLettersInCorrectPosition = (words) => {
  let words1 = [...words];
  for (const [letter, positions] of Object.entries(possibleLetters)) {
    //Gets all words with the letter in it
    words1 = getWordsWithALetterInIt(words1, letter);
    positions.forEach((position) => {
      words1 = words1.filter((word) => word[position] !== letter);
    });
  }
  return words1;
};

const wordsWithoutPossibleLetters = (words) => {
  let words1 = [...words];
  if (notPossibleLetters) {
    notPossibleLetters.forEach((letter) => {
      words1 = words1.filter((word) => !word.includes(letter));
    });
  }

  return words1;
};

const searchForWords = function () {
  wordsDisplay.textContent = wordsWithoutPossibleLetters(
    wordsWithPossibleLettersInCorrectPosition(wordsWithDefiniteLetters())
  )
    .join(",")
    .replaceAll(",", "\n");
};

const setLettersToLowerCase = () => {
  letters.forEach((letter) => {
    letter.value = letter.value.toLowerCase();
  });
};

const lowerAndCheck = () => {
  setLettersToLowerCase();
  checkWord();
};

const checkWord = function () {
  letters.forEach(function (letter, i) {
    const backgroundColor = letter.style.backgroundColor;
    if (backgroundColor === "green") {
      enteredWord = replaceCharAt(i, letter, enteredWord);
    } else if (backgroundColor === "orange") {
      if (possibleLetters[letter.value]) {
        const positions = possibleLetters[letter.value];
        positions.push(i);
      } else possibleLetters[letter.value] = [i];
    } else {
      letter.value && notPossibleLetters.push(letter.value);
    }
  });
  searchForWords();
};

chckBttn.addEventListener("click", lowerAndCheck);

const playAgain = () => {
  clearAll();
  wordsWithDoubleLetters = [];
  possibleLetters = {};
  notPossibleLetters = [];
  enteredWord = emptyWord;
  setWordsDisplay(wordsWithoutDoubleLetters);
};

tryAgain.addEventListener("click", playAgain);
