import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Play, Pause, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import Button from './Button';
import './TopBar.scss';

const TopBar: React.FC = () => {
  const { state, toggleAnalysisMode, setEngineEnabled } = useAppContext();

  const handleEngineToggle = () => {
    setEngineEnabled(!state.engineEnabled);
  };

  const handleResetPosition = () => {
    // Reset to starting position
    // This would be implemented with proper chess logic
    console.log('Reset position');
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="topbar__breadcrumb">
          {state.currentRepertoire ? (
            <>
              <span className="topbar__breadcrumb-item">
                {state.currentRepertoire.name}
              </span>
              <span className="topbar__breadcrumb-separator">/</span>
              <span className="topbar__breadcrumb-item topbar__breadcrumb-item--current">
                Line Editor
              </span>
            </>
          ) : (
            <span className="topbar__breadcrumb-item topbar__breadcrumb-item--current">
              MajChesster
            </span>
          )}
        </div>
      </div>

      <div className="topbar__center">
        <div className="topbar__controls">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetPosition}
            className="topbar__control-btn"
          >
            <RotateCcw size={16} />
            Reset
          </Button>

          <Button
            variant={state.isAnalysisMode ? 'primary' : 'ghost'}
            size="sm"
            onClick={toggleAnalysisMode}
            className="topbar__control-btn"
          >
            {state.isAnalysisMode ? <Pause size={16} /> : <Play size={16} />}
            {state.isAnalysisMode ? 'Stop Analysis' : 'Analyze'}
          </Button>

          <Button
            variant={state.engineEnabled ? 'primary' : 'ghost'}
            size="sm"
            onClick={handleEngineToggle}
            className="topbar__control-btn"
          >
            <SettingsIcon size={16} />
            Engine {state.engineEnabled ? 'On' : 'Off'}
          </Button>
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__status">
          {state.engineEnabled && (
            <div className="topbar__engine-status">
              <span className="topbar__engine-indicator" />
              <span className="topbar__engine-text">
                Depth {state.engineDepth}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;