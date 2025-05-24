import React from 'react';
import { useSettings, useToast } from '../hooks/useAppContext';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './Settings.scss';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const handleSave = () => {
    showToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been saved successfully.'
    });
  };

  const handleReset = () => {
    updateSettings({
      notation: 'san',
      engineDepth: 15,
      autoSave: true,
      soundEnabled: true,
      showCoordinates: true,
      pieceTheme: 'classic',
      boardTheme: 'dark',
      animationSpeed: 'normal',
      theme: 'dark',
      language: 'en',
      updateChannel: 'stable',
    });
    
    showToast({
      type: 'info',
      title: 'Settings Reset',
      message: 'All settings have been reset to default values.'
    });
  };

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="heading heading--2">Settings</h1>
        <div className="settings__actions">
          <Button variant="ghost" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset to Defaults
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="settings__content">
        <div className="settings__section">
          <Card className="settings-group">
            <div className="settings-group__header">
              <h2 className="subheading subheading--lg">Chess Board</h2>
              <p className="body-text body-text--sm">
                Customize the appearance and behavior of the chess board.
              </p>
            </div>
            
            <div className="settings-group__content">
              <div className="setting-item">
                <label className="setting-item__label">
                  Piece Theme
                  <span className="setting-item__description">
                    Choose the style of chess pieces
                  </span>
                </label>
                <select 
                  className="input setting-item__select"
                  value={settings.pieceTheme}
                  onChange={(e) => updateSettings({ pieceTheme: e.target.value as any })}
                >
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="neon">Neon</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label className="setting-item__label">
                  Board Theme
                  <span className="setting-item__description">
                    Select the color scheme for the board
                  </span>
                </label>
                <select 
                  className="input setting-item__select"
                  value={settings.boardTheme}
                  onChange={(e) => updateSettings({ boardTheme: e.target.value as any })}
                >
                  <option value="dark">Dark</option>
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label className="setting-item__label">
                  Show Coordinates
                  <span className="setting-item__description">
                    Display file and rank labels on the board
                  </span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.showCoordinates}
                    onChange={(e) => updateSettings({ showCoordinates: e.target.checked })}
                  />
                  <span className="toggle__slider"></span>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-item__label">
                  Animation Speed
                  <span className="setting-item__description">
                    Speed of piece movement animations
                  </span>
                </label>
                <select 
                  className="input setting-item__select"
                  value={settings.animationSpeed}
                  onChange={(e) => updateSettings({ animationSpeed: e.target.value as any })}
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div className="settings__section">
          <Card className="settings-group">
            <div className="settings-group__header">
              <h2 className="subheading subheading--lg">Chess Engine</h2>
              <p className="body-text body-text--sm">
                Configure the Stockfish engine analysis settings.
              </p>
            </div>
            
            <div className="settings-group__content">
              <div className="setting-item">
                <label className="setting-item__label">
                  Engine Depth
                  <span className="setting-item__description">
                    Maximum search depth for analysis (1-30)
                  </span>
                </label>
                <div className="range-input">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={settings.engineDepth}
                    onChange={(e) => updateSettings({ engineDepth: parseInt(e.target.value) })}
                    className="range-input__slider"
                  />
                  <span className="range-input__value">{settings.engineDepth}</span>
                </div>
              </div>
              
              <div className="setting-item">
                <label className="setting-item__label">
                  Notation Style
                  <span className="setting-item__description">
                    Choose how moves are displayed
                  </span>
                </label>
                <select 
                  className="input setting-item__select"
                  value={settings.notation}
                  onChange={(e) => updateSettings({ notation: e.target.value as any })}
                >
                  <option value="san">Standard Algebraic (Nf3)</option>
                  <option value="lan">Long Algebraic (Ng1-f3)</option>
                  <option value="uci">UCI (g1f3)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div className="settings__section">
          <Card className="settings-group">
            <div className="settings-group__header">
              <h2 className="subheading subheading--lg">Application</h2>
              <p className="body-text body-text--sm">
                General application preferences and behavior.
              </p>
            </div>
            
            <div className="settings-group__content">
              <div className="setting-item">
                <label className="setting-item__label">
                  Auto Save
                  <span className="setting-item__description">
                    Automatically save changes to repertoires
                  </span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                  />
                  <span className="toggle__slider"></span>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-item__label">
                  Sound Effects
                  <span className="setting-item__description">
                    Play sounds for moves and notifications
                  </span>
                </label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  />
                  <span className="toggle__slider"></span>
                </label>
              </div>
              
              <div className="setting-item">
                <label className="setting-item__label">
                  Language
                  <span className="setting-item__description">
                    Interface language
                  </span>
                </label>
                <select 
                  className="input setting-item__select"
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as any })}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label className="setting-item__label">
                  Theme
                  <span className="setting-item__description">
                    Application color theme
                  </span>
                </label>
                <select 
                  className="input setting-item__select"
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as any })}
                >
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        <div className="settings__section">
          <Card className="settings-group">
            <div className="settings-group__header">
              <h2 className="subheading subheading--lg">Updates</h2>
              <p className="body-text body-text--sm">
                Configure how MajChesster handles updates.
              </p>
            </div>
            
            <div className="settings-group__content">
              <div className="setting-item">
                <label className="setting-item__label">
                  Update Channel
                  <span className="setting-item__description">
                    Choose which updates to receive
                  </span>
                </label>
                <select 
                  className="input setting-item__select"
                  value={settings.updateChannel}
                  onChange={(e) => updateSettings({ updateChannel: e.target.value as any })}
                >
                  <option value="stable">Stable (Recommended)</option>
                  <option value="beta">Beta (Early Access)</option>
                </select>
              </div>
              
              <div className="setting-item setting-item--info">
                <div className="info-box">
                  <SettingsIcon size={20} />
                  <div className="info-box__content">
                    <h3 className="info-box__title">About MajChesster</h3>
                    <p className="info-box__text">
                      Version 1.0.0 • Built with Electron and React
                    </p>
                    <p className="info-box__text">
                      A powerful chess repertoire application with advanced training features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;