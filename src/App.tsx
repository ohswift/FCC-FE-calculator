import React, {
  ChangeEvent,
  MouseEvent,
  CSSProperties,
  MouseEventHandler,
} from "react";

const DOTS = ["decimal", "."];
const CLEARS_DATA = ["clear", "AC"];
const NUMBERS_DATA = [
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["zero", "0"],
];
const OPERATORS_DATA = [
  ["divide", "/"],
  ["multiply", "*"],
  ["subtract", "-"],
  ["add", "+"],
  ["equals", "="],
];

const isOperator = /[*/+-]/;
const endsWithOperator = /([*+-/])$/;
const endsWithNegativeSign = /(\d)([*/+-]{1}-)$/;
const operators = ["+", "-", "*", "/"];

class Output extends React.Component<{
  displayValue: string;
  expression: string;
}> {
  render() {
    return (
      <>
        <p className="expression">{this.props.expression}</p>
        <div className="display" id="display">
          {this.props.displayValue}
        </div>
      </>
    );
  }
}

interface ButtonsProps {
  handleClick: MouseEventHandler;
}

class Buttons extends React.Component<ButtonsProps> {
  render() {
    return (
      <>
        <div className="button-container left">
          <button
            className="light clear"
            id={CLEARS_DATA[0]}
            onClick={this.props.handleClick}
          >
            {CLEARS_DATA[1]}
          </button>
          {NUMBERS_DATA.map((num) => (
            <button
              className={num[1] == "0" ? "big dark" : "dark"}
              id={num[0]}
              key={num[0]}
              onClick={this.props.handleClick}
            >
              {num[1]}
            </button>
          ))}
          <button
            className="dark"
            id={DOTS[0]}
            onClick={this.props.handleClick}
          >
            {DOTS[1]}
          </button>
        </div>
        <div className="button-container right">
          {OPERATORS_DATA.map((ops) => (
            <button
              className="orange"
              id={ops[0]}
              key={ops[0]}
              onClick={this.props.handleClick}
            >
              {ops[1]}
            </button>
          ))}
        </div>
      </>
    );
  }
}

interface AppState {
  displayValue: string;
  expression: string;
  evaluated: boolean; // showing last evaluated result(aka: xxx=xxx)
  prevVal: string; // value before operator(easy to use)
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    displayValue: "0",
    expression: "", // invalid input
    evaluated: false,
    prevVal: "",
  };

  constructor(props: {}) {
    super(props);
  }

  handleEvaluate = () => {
    let { expression, displayValue, evaluated, prevVal } = this.state;
    if (evaluated) return;
    if (prevVal === "") return; // no operators
    const res = Math.round(eval(expression) * 100000) / 100000;
    this.setState({
      expression: expression + `=${res}`,
      displayValue: `${res}`,
      evaluated: true,
      prevVal: "",
    });
    return;
  };

  handleOperators = (text: string) => {
    let { expression, displayValue, evaluated, prevVal } = this.state;

    // has evaluated
    if (evaluated) {
      this.setState({
        prevVal: displayValue,
        expression: displayValue + text,
        displayValue: text,
        evaluated: false,
      });
      return;
    }
    // check if double operator
    if (!endsWithOperator.test(expression)) {
      this.setState({
        displayValue: text,
        prevVal: expression,
        expression: expression + text,
      });
      return;
    }
    if (!endsWithNegativeSign.test(expression)) {
      // expression.replace(endsWithOperator, `$1 ${text}`);
      this.setState({
        displayValue: text,
        expression: (text === "-" ? expression : prevVal) + text,
      });
      return;
    }
    // ends with negative sign
    if (text != "-") {
      // replace +- with (*/+)
      // expression.replace(endsWithNegativeSign, `$1 ${text}`);
      this.setState({
        displayValue: text,
        expression: prevVal + text,
      });
    }
  };

  handleDot = () => {
    let { expression, displayValue, evaluated } = this.state;
    if (evaluated) {
      this.setState({
        displayValue: "0.",
        expression: "0.",
        evaluated: false,
      });
      return;
    }
    // 最后一个值是否已经有.了
    if (displayValue.indexOf(".") == -1) {
      this.setState({
        displayValue: displayValue + ".",
        expression: expression + ".",
      });
    }
  };

  handleNumbers = (text: string) => {
    let { expression, displayValue, evaluated, prevVal } = this.state;
    if (evaluated) {
      this.setState({
        displayValue: text,
        expression: text,
        evaluated: false,
      });
      return;
    }

    // need to remove illegal 0
    if (prevVal === "") {
      // is inputing first hand
      if (expression.length == 1 && expression[0] === "0") {
        expression = "";
      }
    } else {
      // prevVal+operator+"0"+text
      if (
        expression.length == prevVal.length + 2 &&
        expression.slice(-1) === "0"
      ) {
        expression = expression.slice(0, -1);
      }
    }
    expression += text;
    if (isOperator.test(displayValue) || displayValue === "0") {
      displayValue = text;
    } else {
      displayValue += text;
    }
    this.setState({
      expression: expression,
      displayValue: displayValue,
      evaluated: false,
    });
  };

  handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const text = (e.target as HTMLButtonElement).innerHTML;
    let { expression, displayValue, evaluated } = this.state;
    const lastChar = expression.slice(-1) || "";

    // 0. handle AC
    if (text === "AC") {
      this.setState({
        displayValue: "0",
        expression: "",
        evaluated: false,
        prevVal: "",
      });
      return;
    }

    // 1. handle if click equal
    if (text == "=") {
      return this.handleEvaluate();
    }
    // 2. handle operators
    if (isOperator.test(text)) {
      return this.handleOperators(text);
    }
    // 3. handle numbers
    if (text == ".") {
      return this.handleDot();
    }
    return this.handleNumbers(text);
  };

  render() {
    return (
      <>
        {/* <p>{JSON.stringify(this.state)}</p> */}
        <div className="container">
          <Output
            displayValue={this.state.displayValue}
            expression={this.state.expression}
          ></Output>
          <Buttons handleClick={this.handleClick}></Buttons>
        </div>
      </>
    );
  }
}

export default App;
