import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { GitBranch, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './VariationTree.scss';

interface TreeNode {
  id: string;
  move: string;
  fen: string;
  children: TreeNode[];
  isMainLine: boolean;
  comment?: string;
}

const VariationTree: React.FC = () => {
  const { state } = useAppContext();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Mock tree data
  const mockTree: TreeNode = {
    id: 'root',
    move: 'Starting Position',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    isMainLine: true,
    children: [
      {
        id: 'e4',
        move: 'e4',
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        isMainLine: true,
        children: [
          {
            id: 'e5',
            move: 'e5',
            fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
            isMainLine: true,
            children: [
              {
                id: 'nf3',
                move: 'Nf3',
                fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
                isMainLine: true,
                children: [],
                comment: 'The Italian Game setup'
              }
            ]
          },
          {
            id: 'c5',
            move: 'c5',
            fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
            isMainLine: false,
            children: [],
            comment: 'Sicilian Defense'
          }
        ]
      },
      {
        id: 'd4',
        move: 'd4',
        fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1',
        isMainLine: false,
        children: [],
        comment: "Queen's Pawn opening"
      }
    ]
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isSelected = selectedNode === node.id;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="tree-node-container">
        <div
          className={`tree-node ${isSelected ? 'tree-node--selected' : ''} ${node.isMainLine ? 'tree-node--main' : 'tree-node--variation'}`}
          onClick={() => handleNodeClick(node.id)}
          style={{ marginLeft: `${level * 40}px` }}
        >
          <div className="tree-node__content">
            <div className="tree-node__move">{node.move}</div>
            {node.comment && (
              <div className="tree-node__comment">{node.comment}</div>
            )}
          </div>
          {hasChildren && (
            <div className="tree-node__indicator">
              <GitBranch size={12} />
            </div>
          )}
        </div>
        
        {hasChildren && (
          <div className="tree-node__children">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="variation-tree">
      <div className="variation-tree__header">
        <h1 className="heading heading--2">Variation Tree</h1>
        <div className="variation-tree__controls">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut size={16} />
          </Button>
          <span className="variation-tree__zoom">{zoomLevel}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Maximize2 size={16} />
            Fullscreen
          </Button>
        </div>
      </div>

      <div className="variation-tree__content">
        <Card className="tree-container">
          <div 
            className="tree-viewport"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {state.currentRepertoire ? (
              <div className="tree-root">
                {renderTreeNode(mockTree)}
              </div>
            ) : (
              <div className="empty">
                <div className="empty__icon">
                  <GitBranch size={48} />
                </div>
                <h3 className="empty__title">No repertoire selected</h3>
                <p className="empty__message">
                  Select a repertoire to visualize its variation tree structure.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="tree-info">
          <div className="tree-info__header">
            <h3 className="subheading subheading--md">Position Details</h3>
          </div>
          
          {selectedNode ? (
            <div className="tree-info__content">
              <div className="tree-info__section">
                <label className="tree-info__label">Move:</label>
                <span className="tree-info__value">e4</span>
              </div>
              
              <div className="tree-info__section">
                <label className="tree-info__label">FEN:</label>
                <span className="tree-info__value tree-info__value--mono">
                  rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e3 0 1
                </span>
              </div>
              
              <div className="tree-info__section">
                <label className="tree-info__label">Type:</label>
                <span className="tree-info__value">Main Line</span>
              </div>
              
              <div className="tree-info__section">
                <label className="tree-info__label">Comment:</label>
                <textarea 
                  className="input tree-info__textarea"
                  placeholder="Add notes for this position..."
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div className="tree-info__empty">
              <p className="body-text body-text--sm">
                Click on a node in the tree to view position details.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VariationTree;