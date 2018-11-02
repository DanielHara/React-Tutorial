import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button 
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor: props.winner ? "#00aeef" : null,
      }}
    >
      { props.value }
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, winner=false) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => { this.props.onClick(i); }}
        winner={winner}
      />
    );
  }
  
  
  render = () => {
    const winner = calculateWinner(this.props.squares);
    let winnerSquares = []
    if (winner) {
      winnerSquares = winner.winningSquares
    }

    let rows = []

    for (let i = 0; i <= 2; i++) {
      let children = []

      for (let j = 0; j <= 2; j++){
        const squareIndex = 3 * i + j;
        children.push(this.renderSquare(squareIndex, winnerSquares.indexOf(squareIndex) > -1));
      }
      rows.push(
        <div className="board-row">
          {children}
        </div>
      );
    }

    return <div>{rows}</div>;
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      XIsNext: true,
      stepNumber: 0,
      ascending: true,
    }
  }


  jumpsTo = (step) => {
    this.setState({
      stepNumber: step,
      XIsNext: (step % 2) == 0,
    });
  }


  handleClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.XIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: {
          col: i % 3 + 1,
          row: Math.floor(i / 3) + 1,
        },
      }]),
      stepNumber: history.length,
      XIsNext: !this.state.XIsNext,
    });
  }

  handleToggleButtonClick = () => {
    this.setState({
      ascending: !this.state.ascending,
    })
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const stepNumber = this.state.stepNumber;
    const ascending = this.state.ascending

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move # ${move}`: 
        'Go to game start';

      const fontWeight = move === stepNumber ? 'bold': 'normal';
      const moveText = (move > 0) ? `Row: ${step.move.row}, Col: ${step.move.col}` : null
      return (
        <li key={move}>
          <button 
            style={
              { fontWeight: fontWeight }
            }
            onClick={() => this.jumpsTo(move)}>
              {desc}
          </button>
          { moveText }
        </li>
      )
    });

    if (!ascending) {
      moves.reverse()
    }
    let status;
    if (winner) {
      status = `Winner: ${winner.winner}`;
    } else {
      if (stepNumber < 9) {
        status = `Next player: ${this.state.XIsNext ? 'X':'O'}`;
      }
      else {
        status = 'No one wins!';
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => { this.handleClick(i); }}
          />
        </div>
        <div className="game-info">
          <button
            onClick={this.handleToggleButtonClick}
          >
            { this.state.ascending ? 'DESCENDING':'ASCENDING' }
          </button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ({
        winner: squares[a],
        winningSquares: [a, b, c],
      });
    }
  }
  return null;
}
