import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Edit3, 
  GitBranch, 
  Search, 
  Target, 
  Download, 
  Settings,
  Crown
} from 'lucide-react';
import { NavigationItem, ModuleRoute } from '../types';
import './Sidebar.scss';

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: 'Home',
    path: '/',
    description: 'Repertoire overview and quick actions'
  },
  {
    id: 'editor',
    label: 'Line Editor',
    icon: 'Edit3',
    path: '/editor',
    description: 'Create and edit opening lines'
  },
  {
    id: 'tree',
    label: 'Variation Tree',
    icon: 'GitBranch',
    path: '/tree',
    description: 'Visualize variation structures'
  },
  {
    id: 'explorer',
    label: 'Move Explorer',
    icon: 'Search',
    path: '/explorer',
    description: 'Explore opening database'
  },
  {
    id: 'trainer',
    label: 'Drill Trainer',
    icon: 'Target',
    path: '/trainer',
    description: 'Practice with spaced repetition'
  },
  {
    id: 'io',
    label: 'Import & Export',
    icon: 'Download',
    path: '/io',
    description: 'Manage PGN and JSON files'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    description: 'Configure application preferences'
  }
];

const iconComponents = {
  Home,
  Edit3,
  GitBranch,
  Search,
  Target,
  Download,
  Settings
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <Crown className="sidebar__logo-icon" />
          <span className="sidebar__logo-text">MajChesster</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          {navigationItems.map((item) => {
            const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id} className="sidebar__nav-item">
                <button
                  className={`sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  title={item.description}
                >
                  <IconComponent className="sidebar__nav-icon" size={20} />
                  <span className="sidebar__nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__version">
          <span className="fine-print">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;