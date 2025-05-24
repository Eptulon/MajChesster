import React, { useState } from 'react';
import { useAppContext, useToast } from '../hooks/useAppContext';
import { Upload, Download, FileText, Database, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './ImportExport.scss';

const ImportExport: React.FC = () => {
  const { state, addRepertoire } = useAppContext();
  const { showToast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    setImporting(true);
    
    try {
      for (const file of files) {
        if (file.name.endsWith('.pgn')) {
          const content = await file.text();
          await processPGN(content, file.name);
        } else if (file.name.endsWith('.json')) {
          const content = await file.text();
          await processJSON(content, file.name);
        } else {
          showToast({
            type: 'warning',
            title: 'Unsupported File',
            message: `File ${file.name} is not supported. Please use PGN or JSON files.`
          });
        }
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Import Error',
        message: 'Failed to import files. Please check the file format.'
      });
    } finally {
      setImporting(false);
    }
  };

  const processPGN = async (content: string, filename: string) => {
    // Mock PGN processing
    const newRepertoire = {
      id: Date.now().toString(),
      name: filename.replace('.pgn', ''),
      moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], // Mock moves from PGN
      annotations: {
        'e4': 'King\'s pawn opening',
        'Bc4': 'Italian Game setup'
      },
      color: 'white' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['imported']
    };

    addRepertoire(newRepertoire);
    
    showToast({
      type: 'success',
      title: 'PGN Imported',
      message: `Successfully imported repertoire from ${filename}`
    });
  };

  const processJSON = async (content: string, filename: string) => {
    try {
      const data = JSON.parse(content);
      
      if (Array.isArray(data)) {
        // Multiple repertoires
        data.forEach((rep, index) => {
          const newRepertoire = {
            ...rep,
            id: `${Date.now()}-${index}`,
            createdAt: new Date(rep.createdAt || Date.now()),
            updatedAt: new Date(rep.updatedAt || Date.now())
          };
          addRepertoire(newRepertoire);
        });
        
        showToast({
          type: 'success',
          title: 'JSON Imported',
          message: `Successfully imported ${data.length} repertoires from ${filename}`
        });
      } else {
        // Single repertoire
        const newRepertoire = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date(data.createdAt || Date.now()),
          updatedAt: new Date(data.updatedAt || Date.now())
        };
        addRepertoire(newRepertoire);
        
        showToast({
          type: 'success',
          title: 'JSON Imported',
          message: `Successfully imported repertoire from ${filename}`
        });
      }
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleExportPGN = async () => {
    if (state.repertoires.length === 0) {
      showToast({
        type: 'warning',
        title: 'No Data',
        message: 'No repertoires available to export.'
      });
      return;
    }

    setExporting(true);
    
    try {
      // Mock PGN generation
      let pgnContent = '';
      
      state.repertoires.forEach((repertoire, index) => {
        pgnContent += `[Event "MajChesster Repertoire"]\n`;
        pgnContent += `[Site "MajChesster"]\n`;
        pgnContent += `[Date "${new Date().toISOString().split('T')[0]}"]\n`;
        pgnContent += `[Round "${index + 1}"]\n`;
        pgnContent += `[White "${repertoire.color === 'white' ? 'Repertoire' : 'Opponent'}"]\n`;
        pgnContent += `[Black "${repertoire.color === 'black' ? 'Repertoire' : 'Opponent'}"]\n`;
        pgnContent += `[Result "*"]\n`;
        pgnContent += `[Opening "${repertoire.name}"]\n\n`;
        
        // Add moves
        repertoire.moves.forEach((move, moveIndex) => {
          if (moveIndex % 2 === 0) {
            pgnContent += `${Math.floor(moveIndex / 2) + 1}. `;
          }
          pgnContent += `${move} `;
          
          // Add annotation if exists
          if (repertoire.annotations[move]) {
            pgnContent += `{${repertoire.annotations[move]}} `;
          }
        });
        
        pgnContent += '*\n\n';
      });

      // Trigger download
      const blob = new Blob([pgnContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `majchesster-repertoires-${new Date().toISOString().split('T')[0]}.pgn`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast({
        type: 'success',
        title: 'Export Complete',
        message: 'PGN file has been downloaded successfully.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Export Error',
        message: 'Failed to export PGN file.'
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = async () => {
    if (state.repertoires.length === 0) {
      showToast({
        type: 'warning',
        title: 'No Data',
        message: 'No repertoires available to export.'
      });
      return;
    }

    setExporting(true);
    
    try {
      const jsonContent = JSON.stringify(state.repertoires, null, 2);
      
      // Trigger download
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `majchesster-repertoires-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast({
        type: 'success',
        title: 'Export Complete',
        message: 'JSON file has been downloaded successfully.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Export Error',
        message: 'Failed to export JSON file.'
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="import-export">
      <div className="import-export__header">
        <h1 className="heading heading--2">Import & Export</h1>
        <p className="body-text body-text--lg">
          Manage your repertoire data with PGN and JSON file support.
        </p>
      </div>

      <div className="import-export__content">
        <div className="import-section">
          <Card className="import-card">
            <div className="import-card__header">
              <Upload size={32} className="import-card__icon" />
              <h2 className="subheading subheading--lg">Import Repertoires</h2>
            </div>
            
            <div className="import-card__content">
              <div
                className={`drop-zone ${dragActive ? 'drop-zone--active' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="drop-zone__content">
                  <FileText size={48} className="drop-zone__icon" />
                  <h3 className="subheading subheading--md">
                    Drag & drop files here
                  </h3>
                  <p className="body-text body-text--sm">
                    Support for PGN and JSON files
                  </p>
                  <div className="drop-zone__or">or</div>
                  <label className="file-input-label">
                    <input
                      type="file"
                      multiple
                      accept=".pgn,.json"
                      onChange={handleFileInput}
                      className="file-input"
                    />
                    <Button variant="secondary">
                      Choose Files
                    </Button>
                  </label>
                </div>
              </div>
              
              {importing && (
                <div className="import-status">
                  <div className="loading">
                    <div className="loading__spinner"></div>
                    <span className="loading__text">Importing files...</span>
                  </div>
                </div>
              )}
              
              <div className="import-info">
                <div className="info-item">
                  <AlertCircle size={16} />
                  <span>PGN files will be parsed for opening moves and annotations</span>
                </div>
                <div className="info-item">
                  <AlertCircle size={16} />
                  <span>JSON files should follow the MajChesster repertoire format</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="export-section">
          <Card className="export-card">
            <div className="export-card__header">
              <Download size={32} className="export-card__icon" />
              <h2 className="subheading subheading--lg">Export Repertoires</h2>
            </div>
            
            <div className="export-card__content">
              <div className="export-stats">
                <div className="export-stat">
                  <span className="export-stat__value">{state.repertoires.length}</span>
                  <span className="export-stat__label">Repertoires</span>
                </div>
                <div className="export-stat">
                  <span className="export-stat__value">
                    {state.repertoires.reduce((acc, rep) => acc + rep.moves.length, 0)}
                  </span>
                  <span className="export-stat__label">Total Moves</span>
                </div>
                <div className="export-stat">
                  <span className="export-stat__value">
                    {state.repertoires.reduce((acc, rep) => acc + Object.keys(rep.annotations).length, 0)}
                  </span>
                  <span className="export-stat__label">Annotations</span>
                </div>
              </div>
              
              <div className="export-options">
                <div className="export-option">
                  <div className="export-option__info">
                    <h3 className="subheading subheading--md">PGN Format</h3>
                    <p className="body-text body-text--sm">
                      Standard chess notation format compatible with most chess software.
                    </p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={handleExportPGN}
                    loading={exporting}
                    disabled={state.repertoires.length === 0}
                  >
                    <FileText size={16} />
                    Export PGN
                  </Button>
                </div>
                
                <div className="export-option">
                  <div className="export-option__info">
                    <h3 className="subheading subheading--md">JSON Format</h3>
                    <p className="body-text body-text--sm">
                      Complete data export including all metadata and annotations.
                    </p>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={handleExportJSON}
                    loading={exporting}
                    disabled={state.repertoires.length === 0}
                  >
                    <Database size={16} />
                    Export JSON
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;