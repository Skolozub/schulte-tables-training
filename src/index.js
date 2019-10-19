import random from "random";
import { alphabet } from "./constants";
import "./styles.css";

class SchulteTable {
  constructor(props) {
    const {
      symbols = ["a"],
      rows = 1,
      cols = 1,
      withDot = false,
      matrix = [],
      solution = symbols,
      answer = []
    } = props;
    this.state = {
      symbols,
      rows,
      cols,
      withDot,
      answer,
      matrix,
      solution
    };
    const { length: symbolsLength } = symbols;
    const symbolsNeeds = withDot ? rows * cols - 1 : rows * cols;
    const isNotEnoughSymbols = symbolsNeeds > symbolsLength;
    if (isNotEnoughSymbols)
      throw new Error(
        `not enough characters. needed - ${symbolsNeeds}, but have - ${symbolsLength}`
      );
    const isTooManySymbols = symbolsNeeds < symbolsLength;
    if (isTooManySymbols)
      throw new Error(
        `too many characters. needed - ${symbolsNeeds}, but have - ${symbolsLength}`
      );
  }

  getRandomSymbol = symbols => {
    const randomSymbolNumber = random.int(0, symbols.length - 1);
    const { [randomSymbolNumber]: randomSymbol, ...rest } = symbols;

    return [randomSymbol, Object.values(rest)];
  };

  getSymbolsRow = ({
    randomSymbolsFunc,
    symbolsArray,
    colsNum,
    withDot,
    dotRowsPosition
  }) => {
    const [row, rest] = [...Array(colsNum)].reduce(
      (acc, _, i) => {
        if (withDot && dotRowsPosition === i)
          return [[...acc[0], "dot"], acc[1]];
        const [randomSymbol, symbolsArrayRest] = randomSymbolsFunc(acc[1]);
        return [[...acc[0], randomSymbol], symbolsArrayRest];
      },
      [[], symbolsArray]
    );

    return [row, rest];
  };

  getSymbolsMatrix = ({
    randomSymbolsFunc,
    symbolsRowFunc,
    symbolsArray,
    rowsNum,
    colsNum,
    withDot,
    dotRowsPosition,
    dotColsPosition
  }) => {
    const [matrix] = [...Array(rowsNum)].reduce(
      (acc, _, i) => {
        const [row, symbolsArrayRest] = symbolsRowFunc({
          randomSymbolsFunc,
          symbolsArray: acc[1],
          colsNum,
          withDot: withDot && dotColsPosition === i,
          dotRowsPosition
        });
        return [[...acc[0], row], symbolsArrayRest];
      },
      [[], symbolsArray]
    );

    return matrix;
  };

  onClickHandler = symbol => {
    this.state.answer = [...this.state.answer, symbol];
    console.log(this.state);
  };

  createButton = (name, data) => {
    const btn = document.createElement("div");
    btn.addEventListener("click", () => this.onClickHandler(data));
    btn.classList.add("button", `button-${name}`);
    btn.innerText = data;

    return btn;
  };

  render = () => {
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    this.state.matrix.forEach((row, i) =>
      row.forEach(symbol => buttons.appendChild(this.createButton(i, symbol)))
    );

    const root = document.getElementById("app");
    root.appendChild(buttons);
  };

  startTraining = () => {
    const symbolsMatrix = this.getSymbolsMatrix({
      randomSymbolsFunc: this.getRandomSymbol,
      symbolsRowFunc: this.getSymbolsRow,
      symbolsArray: this.state.symbols,
      rowsNum: this.state.rows,
      colsNum: this.state.cols,
      withDot: this.state.withDot,
      dotRowsPosition: Math.floor(this.state.cols / 2),
      dotColsPosition: Math.ceil(this.state.cols / 2)
    });

    this.state.matrix = symbolsMatrix;
    this.state.answer = [];
    console.log(symbolsMatrix);
    this.render();
  };
}

const props = {
  symbols: [...alphabet, "к"],
  rows: 7,
  cols: 5,
  withDot: true
};
const schulteTraining = new SchulteTable(props);
schulteTraining.startTraining();
