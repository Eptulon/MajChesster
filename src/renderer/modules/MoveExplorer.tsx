import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Search, TrendingUp, Users, Clock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './MoveExplorer.scss';

interface LichessMove {
  uci: string;
  san: string;
  white: number;
  draws: number;
  black: number;
  averageRating: number;
}

interface ExplorerData {
  white: number;
  draws: number;
  black: number;
  moves: LichessMove[];
}

const MoveExplorer: React.FC = () => {
  const { state } = useAppContext();
  const [explorerData, setExplorerData] = useState<ExplorerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [searchMoves, setSearchMoves] = useState('');

  // Mock data for demonstration
  const mockExplorerData: ExplorerData = {
    white: 45234,
    draws: 12456,
    black: 38901,
    moves: [
      {
        uci: 'e2e4',
        san: 'e4',
        white: 15234,
        draws: 3456,
        black: 11234,
        averageRating: 1850
      },
      {
        uci: 'd2d4',
        san: 'd4',
        white: 12456,
        draws: 2890,
        black: 9876,
        averageRating: 1820
      },
      {
        uci: 'g1f3',
        san: 'Nf3',
        white: 8765,
        draws: 1234,
        black: 6543,
        averageRating: 1780
      },
      {
        uci: 'c2c4',
        san: 'c4',
        white: 6543,
        draws: 987,
        black: 4321,
        averageRating: 1790
      }
    ]
  };

  useEffect(() => {
    // Simulate loading explorer data
    setLoading(true);
    setTimeout(() => {
      setExplorerData(mockExplorerData);
      setLoading(false);
    }, 1000);
  }, [state.currentPosition]);

  const handleMoveClick = (move: LichessMove) => {
    setSelectedMove(move.san);
    // In a real implementation, this would update the board position
  };

  const handleSearch = () => {
    if (searchMoves.trim()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setExplorerData(mockExplorerData);
        setLoading(false);
      }, 500);
    }
  };

  const calculatePercentage = (wins: number, total: number) => {
    return total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  };

  const getTotalGames = (move: LichessMove) => {
    return move.white + move.draws + move.black;
  };

  return (
    <div className="move-explorer">
      <div className="move-explorer__header">
        <h1 className="heading heading--2">Move Explorer</h1>
        <div className="move-explorer__search">
          <div className="search-input">
            <input
              type="text"
              className="input"
              placeholder="Enter moves (e.g., e4 e5 Nf3)"
              value={searchMoves}
              onChange={(e) => setSearchMoves(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch}>
              <Search size={16} />
              Explore
            </Button>
          </div>
        </div>
      </div>

      <div className="move-explorer__content">
        <div className="move-explorer__main">
          <Card className="position-stats">
            <div className="position-stats__header">
              <h3 className="subheading subheading--md">Position Statistics</h3>
              <span className="position-stats__source">Lichess Database</span>
            </div>
            
            {loading ? (
              <div className="loading">
                <div className="loading__spinner"></div>
                <span className="loading__text">Loading data...</span>
              </div>
            ) : explorerData ? (
              <div className="position-stats__content">
                <div className="stats-overview">
                  <div className="stat-item stat-item--white">
                    <div className="stat-item__value">
                      {calculatePercentage(explorerData.white, explorerData.white + explorerData.draws + explorerData.black)}%
                    </div>
                    <div className="stat-item__label">White wins</div>
                    <div className="stat-item__count">{explorerData.white.toLocaleString()}</div>
                  </div>
                  
                  <div className="stat-item stat-item--draw">
                    <div className="stat-item__value">
                      {calculatePercentage(explorerData.draws, explorerData.white + explorerData.draws + explorerData.black)}%
                    </div>
                    <div className="stat-item__label">Draws</div>
                    <div className="stat-item__count">{explorerData.draws.toLocaleString()}</div>
                  </div>
                  
                  <div className="stat-item stat-item--black">
                    <div className="stat-item__value">
                      {calculatePercentage(explorerData.black, explorerData.white + explorerData.draws + explorerData.black)}%
                    </div>
                    <div className="stat-item__label">Black wins</div>
                    <div className="stat-item__count">{explorerData.black.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty">
                <div className="empty__icon">
                  <Search size={48} />
                </div>
                <h3 className="empty__title">No data available</h3>
                <p className="empty__message">
                  Enter a sequence of moves to explore opening statistics.
                </p>
              </div>
            )}
          </Card>

          <Card className="moves-table">
            <div className="moves-table__header">
              <h3 className="subheading subheading--md">Popular Moves</h3>
              <div className="moves-table__filters">
                <Button variant="ghost" size="sm">
                  <TrendingUp size={16} />
                  By Popularity
                </Button>
                <Button variant="ghost" size="sm">
                  <Users size={16} />
                  By Rating
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">
                <div className="loading__spinner"></div>
                <span className="loading__text">Loading moves...</span>
              </div>
            ) : explorerData && explorerData.moves.length > 0 ? (
              <div className="moves-list">
                {explorerData.moves.map((move, index) => {
                  const totalGames = getTotalGames(move);
                  const whitePercent = calculatePercentage(move.white, totalGames);
                  const drawPercent = calculatePercentage(move.draws, totalGames);
                  const blackPercent = calculatePercentage(move.black, totalGames);
                  const isSelected = selectedMove === move.san;

                  return (
                    <div
                      key={move.uci}
                      className={`move-row ${isSelected ? 'move-row--selected' : ''}`}
                      onClick={() => handleMoveClick(move)}
                    >
                      <div className="move-row__move">
                        <span className="move-row__san">{move.san}</span>
                        <span className="move-row__rank">#{index + 1}</span>
                      </div>
                      
                      <div className="move-row__stats">
                        <div className="move-row__games">
                          <span className="move-row__count">{totalGames.toLocaleString()}</span>
                          <span className="move-row__label">games</span>
                        </div>
                        
                        <div className="move-row__results">
                          <div className="result-bar">
                            <div 
                              className="result-bar__segment result-bar__segment--white"
                              style={{ width: `${whitePercent}%` }}
                            />
                            <div 
                              className="result-bar__segment result-bar__segment--draw"
                              style={{ width: `${drawPercent}%` }}
                            />
                            <div 
                              className="result-bar__segment result-bar__segment--black"
                              style={{ width: `${blackPercent}%` }}
                            />
                          </div>
                          <div className="result-percentages">
                            <span className="result-percent result-percent--white">{whitePercent}%</span>
                            <span className="result-percent result-percent--draw">{drawPercent}%</span>
                            <span className="result-percent result-percent--black">{blackPercent}%</span>
                          </div>
                        </div>
                        
                        <div className="move-row__rating">
                          <span className="move-row__rating-value">{move.averageRating}</span>
                          <span className="move-row__rating-label">avg</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty">
                <div className="empty__icon">📊</div>
                <h3 className="empty__title">No moves found</h3>
                <p className="empty__message">
                  No popular moves available for this position.
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="move-explorer__sidebar">
          <Card className="lichess-widget">
            <div className="lichess-widget__header">
              <h3 className="subheading subheading--md">Lichess Opening Explorer</h3>
              <a 
                href="https://lichess.org/analysis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="lichess-widget__link"
              >
                Open in Lichess
              </a>
            </div>
            
            <div className="lichess-widget__content">
              <p className="body-text body-text--sm">
                Data sourced from millions of games played on Lichess. 
                Statistics include games from all time controls and rating ranges.
              </p>
              
              <div className="lichess-widget__info">
                <div className="info-item">
                  <Clock size={16} />
                  <span>Updated daily</span>
                </div>
                <div className="info-item">
                  <Users size={16} />
                  <span>All rating ranges</span>
                </div>
                <div className="info-item">
                  <TrendingUp size={16} />
                  <span>Live statistics</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoveExplorer;