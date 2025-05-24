import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Target } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './DrillTrainer.scss';

interface DrillCard {
  id: string;
  position: string; // FEN
  correctMove: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  repertoireName: string;
  comment?: string;
}

const DrillTrainer: React.FC = () => {
  const { state } = useAppContext();
  const [isTraining, setIsTraining] = useState(false);
  const [currentCard, setCurrentCard] = useState<DrillCard | null>(null);
  const [userMove, setUserMove] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
    startTime: null as Date | null
  });

  // Mock drill cards
  const mockCards: DrillCard[] = [
    {
      id: '1',
      position: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
      correctMove: 'Nf3',
      difficulty: 2,
      repertoireName: 'Italian Game',
      comment: 'Develop the knight to attack the e5 pawn'
    },
    {
      id: '2',
      position: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
      correctMove: 'Nc6',
      difficulty: 1,
      repertoireName: 'Italian Game',
      comment: 'Defend the e5 pawn with the knight'
    },
    {
      id: '3',
      position: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      correctMove: 'Bc4',
      difficulty: 3,
      repertoireName: 'Italian Game',
      comment: 'Develop the bishop to target f7'
    }
  ];

  const startTraining = () => {
    setIsTraining(true);
    setSessionStats({
      correct: 0,
      incorrect: 0,
      total: 0,
      startTime: new Date()
    });
    setCurrentCard(mockCards[0]);
    setShowAnswer(false);
    setUserMove('');
  };

  const stopTraining = () => {
    setIsTraining(false);
    setCurrentCard(null);
    setShowAnswer(false);
    setUserMove('');
  };

  const handleMoveSubmit = () => {
    if (!currentCard || !userMove.trim()) return;

    const isCorrect = userMove.toLowerCase() === currentCard.correctMove.toLowerCase();
    
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1
    }));

    setShowAnswer(true);
  };

  const nextCard = () => {
    const currentIndex = mockCards.findIndex(card => card.id === currentCard?.id);
    const nextIndex = (currentIndex + 1) % mockCards.length;
    
    setCurrentCard(mockCards[nextIndex]);
    setShowAnswer(false);
    setUserMove('');
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'var(--color-neon-cyan)';
      case 2: return 'var(--color-sky-blue)';
      case 3: return 'var(--color-neon-orange)';
      case 4: return 'var(--color-deep-orange)';
      case 5: return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    return labels[difficulty] || 'Unknown';
  };

  const getAccuracy = () => {
    if (sessionStats.total === 0) return 0;
    return Math.round((sessionStats.correct / sessionStats.total) * 100);
  };

  return (
    <div className="drill-trainer">
      <div className="drill-trainer__header">
        <h1 className="heading heading--2">Drill Trainer</h1>
        <div className="drill-trainer__actions">
          {!isTraining ? (
            <Button variant="primary" onClick={startTraining}>
              <Play size={16} />
              Start Training
            </Button>
          ) : (
            <Button variant="secondary" onClick={stopTraining}>
              <Pause size={16} />
              Stop Training
            </Button>
          )}
        </div>
      </div>

      {!isTraining ? (
        <div className="drill-trainer__setup">
          <Card className="training-setup">
            <div className="training-setup__header">
              <Target size={32} className="training-setup__icon" />
              <h2 className="subheading subheading--lg">Ready to Train?</h2>
            </div>
            
            <div className="training-setup__content">
              <p className="body-text body-text--lg">
                Practice your opening repertoire with spaced repetition flashcards. 
                Answer tactical positions to reinforce your memory.
              </p>
              
              <div className="training-setup__stats">
                <div className="setup-stat">
                  <span className="setup-stat__value">{mockCards.length}</span>
                  <span className="setup-stat__label">Cards Available</span>
                </div>
                <div className="setup-stat">
                  <span className="setup-stat__value">{state.repertoires.length}</span>
                  <span className="setup-stat__label">Repertoires</span>
                </div>
                <div className="setup-stat">
                  <span className="setup-stat__value">87%</span>
                  <span className="setup-stat__label">Best Accuracy</span>
                </div>
              </div>
              
              <Button variant="primary" size="lg" onClick={startTraining}>
                <Play size={20} />
                Start Training Session
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="drill-trainer__session">
          <div className="session-header">
            <Card className="session-stats">
              <div className="session-stats__item">
                <span className="session-stats__value">{sessionStats.correct}</span>
                <span className="session-stats__label">Correct</span>
              </div>
              <div className="session-stats__item">
                <span className="session-stats__value">{sessionStats.incorrect}</span>
                <span className="session-stats__label">Incorrect</span>
              </div>
              <div className="session-stats__item">
                <span className="session-stats__value">{getAccuracy()}%</span>
                <span className="session-stats__label">Accuracy</span>
              </div>
            </Card>
          </div>

          {currentCard && (
            <div className="drill-card">
              <Card className="drill-card__container">
                <div className="drill-card__header">
                  <div className="drill-card__info">
                    <span className="drill-card__repertoire">{currentCard.repertoireName}</span>
                    <div 
                      className="drill-card__difficulty"
                      style={{ color: getDifficultyColor(currentCard.difficulty) }}
                    >
                      {getDifficultyLabel(currentCard.difficulty)}
                    </div>
                  </div>
                  <div className="drill-card__progress">
                    Card {mockCards.findIndex(c => c.id === currentCard.id) + 1} of {mockCards.length}
                  </div>
                </div>

                <div className="drill-card__content">
                  <div className="drill-card__position">
                    <div className="position-display">
                      <div className="position-fen">
                        {currentCard.position}
                      </div>
                      <div className="position-question">
                        <h3 className="subheading subheading--md">What's the best move?</h3>
                        {currentCard.comment && !showAnswer && (
                          <p className="body-text body-text--sm">{currentCard.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="drill-card__answer">
                    {!showAnswer ? (
                      <div className="answer-input">
                        <input
                          type="text"
                          className="input"
                          placeholder="Enter your move (e.g., Nf3, e4, O-O)"
                          value={userMove}
                          onChange={(e) => setUserMove(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleMoveSubmit()}
                        />
                        <Button 
                          variant="primary" 
                          onClick={handleMoveSubmit}
                          disabled={!userMove.trim()}
                        >
                          Submit
                        </Button>
                      </div>
                    ) : (
                      <div className="answer-result">
                        <div className={`result-indicator ${userMove.toLowerCase() === currentCard.correctMove.toLowerCase() ? 'result-indicator--correct' : 'result-indicator--incorrect'}`}>
                          {userMove.toLowerCase() === currentCard.correctMove.toLowerCase() ? (
                            <>
                              <CheckCircle size={24} />
                              <span>Correct!</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={24} />
                              <span>Incorrect</span>
                            </>
                          )}
                        </div>
                        
                        <div className="correct-answer">
                          <span className="correct-answer__label">Correct move:</span>
                          <span className="correct-answer__move">{currentCard.correctMove}</span>
                        </div>
                        
                        {currentCard.comment && (
                          <div className="answer-explanation">
                            <p className="body-text body-text--sm">{currentCard.comment}</p>
                          </div>
                        )}
                        
                        <Button variant="primary" onClick={nextCard}>
                          Next Card
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrillTrainer;