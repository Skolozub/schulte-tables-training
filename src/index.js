import random from "random";
import { alphabet } from "./constants";
import "./styles.css";

const root = document.getElementById("app");

const state = {
  buttons: [],
  answer: [],
  check: ["а", "б", "в", "г", "д"]
};

const getRandomLetter = letters => {
  const randomLetterNumber = random.int(1, letters.length - 1);
  const { [randomLetterNumber]: randomLetter, ...rest } = letters;

  return [randomLetter, Object.values(rest)];
};

const getLettersSet = (rendomFunc, lettersArray, numberOfLetters) => {
  if (numberOfLetters <= 0) return [];

  const [set] = [...Array(numberOfLetters)].reduce(
    acc => {
      const [prevLetters, restLetters] = acc;
      const [letter, rest] = rendomFunc(restLetters);
      return [[...prevLetters, letter], rest];
    },
    [[], lettersArray]
  );

  return set;
};

const onClickHandler = letter => {
  state.answer = [...state.answer, letter];
  console.log("state", state);
};

const createButton = (name, data) => {
  const btn = document.createElement("div");
  btn.addEventListener("click", () => onClickHandler(data));
  btn.classList.add("button", `button-${name}`);
  btn.innerText = data;

  return btn;
};

const render = () => {
  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  state.buttons.forEach((btn, i) => buttons.appendChild(createButton(i, btn)));

  root.appendChild(buttons);
};

const initTraining = () => {
  const lettersMatrix = getLettersSet(getRandomLetter, alphabet, 10);
  state.buttons = lettersMatrix;
  state.answer = [];

  render();
};

initTraining();
