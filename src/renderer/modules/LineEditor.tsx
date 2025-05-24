import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { ChevronLeft, ChevronRight, RotateCcw, Save } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './LineEditor.scss';

const LineEditor: React.FC = () => {
  const { state, setCurrentPosition } = useAppContext();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  // Mock chess board representation
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];

  const pieceSymbols: { [key: string]: string } = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const handleSquareClick = (file: string, rank: string) => {
    const square = `${file}${rank}`;
    setSelectedSquare(square);
  };

  const handleResetPosition = () => {
    setMoveHistory([]);
    setSelectedSquare(null);
  };

  const handleSaveRepertoire = () => {
    // Implementation for saving repertoire
    console.log('Save repertoire');
  };

  return (
    <div className="line-editor">
      <div className="line-editor__header">
        <h1 className="heading heading--2">Line Editor</h1>
        <div className="line-editor__actions">
          <Button variant="ghost" onClick={handleResetPosition}>
            <RotateCcw size={16} />
            Reset
          </Button>
          <Button variant="primary" onClick={handleSaveRepertoire}>
            <Save size={16} />
            Save
          </Button>
        </div>
      </div>

      <div className="line-editor__content">
        <div className="line-editor__board-section">
          <Card className="chess-board-container">
            <div className="chess-board">
              {ranks.map((rank, rankIndex) => (
                files.map((file, fileIndex) => {
                  const piece = initialBoard[rankIndex][fileIndex];
                  const square = `${file}${rank}`;
                  const isLight = (rankIndex + fileIndex) % 2 === 0;
                  const isSelected = selectedSquare === square;

                  return (
                    <div
                      key={square}
                      className={`chess-square ${isLight ? 'chess-square--light' : 'chess-square--dark'} ${isSelected ? 'chess-square--selected' : ''}`}
                      onClick={() => handleSquareClick(file, rank)}
                    >
                      {piece && (
                        <span className="chess-piece">
                          {pieceSymbols[piece]}
                        </span>
                      )}
                      {state.showCoordinates && (
                        <>
                          {fileIndex === 0 && (
                            <span className="chess-coordinate chess-coordinate--rank">
                              {rank}
                            </span>
                          )}
                          {rankIndex === 7 && (
                            <span className="chess-coordinate chess-coordinate--file">
                              {file}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </Card>
        </div>

        <div className="line-editor__moves-section">
          <Card className="moves-panel">
            <div className="moves-panel__header">
              <h3 className="subheading subheading--md">Move List</h3>
              <div className="moves-panel__controls">
                <Button variant="ghost" size="sm">
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            <div className="moves-list">
              {moveHistory.length === 0 ? (
                <div className="moves-list__empty">
                  <p className="body-text body-text--sm">
                    No moves yet. Start by making a move on the board.
                  </p>
                </div>
              ) : (
                <div className="moves-list__content">
                  {moveHistory.map((move, index) => (
                    <div key={index} className="move-item">
                      <span className="move-item__number">{Math.floor(index / 2) + 1}.</span>
                      <span className="move-item__move">{move}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="annotation-panel">
            <div className="annotation-panel__header">
              <h3 className="subheading subheading--md">Annotations</h3>
            </div>
            
            <div className="annotation-panel__content">
              <textarea
                className="input annotation-textarea"
                placeholder="Add notes and annotations for this position..."
                rows={6}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LineEditor;