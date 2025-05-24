import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Plus, Play, BarChart3, Clock, Target } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './HomeDashboard.scss';

const HomeDashboard: React.FC = () => {
  const { state, setCurrentRepertoire } = useAppContext();
  const navigate = useNavigate();

  const handleCreateRepertoire = () => {
    navigate('/editor');
  };

  const handleContinueRepertoire = (repertoire: any) => {
    setCurrentRepertoire(repertoire);
    navigate('/editor');
  };

  const handleStartTraining = () => {
    navigate('/trainer');
  };

  const mockStats = {
    totalRepertoires: state.repertoires.length,
    totalLines: state.repertoires.reduce((acc, rep) => acc + rep.moves.length, 0),
    studyTime: '2h 15m',
    accuracy: '87%',
  };

  return (
    <div className="home-dashboard">
      <div className="home-dashboard__header">
        <h1 className="heading heading--1">Welcome to MajChesster</h1>
        <p className="body-text body-text--lg">
          Build and master your chess opening repertoire with advanced tools and spaced repetition training.
        </p>
      </div>

      <div className="home-dashboard__stats">
        <Card className="stat-card">
          <div className="stat-card__icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{mockStats.totalRepertoires}</div>
            <div className="stat-card__label">Repertoires</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card__icon">
            <Target size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{mockStats.totalLines}</div>
            <div className="stat-card__label">Opening Lines</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card__icon">
            <Clock size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{mockStats.studyTime}</div>
            <div className="stat-card__label">Study Time</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card__icon">
            <Play size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{mockStats.accuracy}</div>
            <div className="stat-card__label">Training Accuracy</div>
          </div>
        </Card>
      </div>

      <div className="home-dashboard__actions">
        <Card className="action-card" hover onClick={handleCreateRepertoire}>
          <div className="action-card__icon">
            <Plus size={32} />
          </div>
          <div className="action-card__content">
            <h3 className="subheading subheading--lg">Create New Repertoire</h3>
            <p className="body-text body-text--sm">
              Start building a new opening repertoire from scratch or import from PGN.
            </p>
          </div>
        </Card>

        <Card className="action-card" hover onClick={handleStartTraining}>
          <div className="action-card__icon">
            <Target size={32} />
          </div>
          <div className="action-card__content">
            <h3 className="subheading subheading--lg">Start Training Session</h3>
            <p className="body-text body-text--sm">
              Practice your repertoire with spaced repetition flashcards.
            </p>
          </div>
        </Card>
      </div>

      <div className="home-dashboard__repertoires">
        <div className="repertoires-header">
          <h2 className="subheading subheading--lg">Your Repertoires</h2>
          <Button variant="primary" onClick={handleCreateRepertoire}>
            <Plus size={16} />
            New Repertoire
          </Button>
        </div>

        {state.repertoires.length === 0 ? (
          <div className="empty">
            <div className="empty__icon">♔</div>
            <h3 className="empty__title">No repertoires yet</h3>
            <p className="empty__message">
              Create your first chess opening repertoire to get started with MajChesster.
            </p>
            <div className="empty__action">
              <Button variant="primary" onClick={handleCreateRepertoire}>
                <Plus size={16} />
                Create Your First Repertoire
              </Button>
            </div>
          </div>
        ) : (
          <div className="repertoires-grid">
            {state.repertoires.map((repertoire) => (
              <Card
                key={repertoire.id}
                className="repertoire-card"
                hover
                onClick={() => handleContinueRepertoire(repertoire)}
              >
                <div className="repertoire-card__header">
                  <h3 className="repertoire-card__title">{repertoire.name}</h3>
                  <span className={`repertoire-card__color repertoire-card__color--${repertoire.color}`}>
                    {repertoire.color === 'white' ? '♔' : '♚'}
                  </span>
                </div>
                <div className="repertoire-card__stats">
                  <div className="repertoire-card__stat">
                    <span className="repertoire-card__stat-value">{repertoire.moves.length}</span>
                    <span className="repertoire-card__stat-label">moves</span>
                  </div>
                  <div className="repertoire-card__stat">
                    <span className="repertoire-card__stat-value">
                      {Object.keys(repertoire.annotations).length}
                    </span>
                    <span className="repertoire-card__stat-label">notes</span>
                  </div>
                </div>
                <div className="repertoire-card__footer">
                  <span className="fine-print">
                    Updated {new Date(repertoire.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;