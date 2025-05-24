# MajChesster

A powerful cross-platform chess repertoire application built with Electron, React, and TypeScript. Features a dark Solo-Leveling inspired theme with advanced training capabilities.

![MajChesster Logo](https://i.ibb.co/0yNYj49r/Maj-Chesster-Logo-Final.png)

## Features

### 🏠 **Home Dashboard**
- Overview of all your repertoires
- Quick access to continue studying
- Usage statistics and progress tracking
- Beautiful card-based interface

### ✏️ **Line Editor**
- Interactive chess board with move input
- Split-view: move list ↔ board visualization
- Add annotations and comments to positions
- Real-time position analysis

### 🌳 **Variation Tree Viewer**
- Interactive, collapsible variation graph
- Visual representation of opening lines
- Navigate through complex variations
- Zoom and fullscreen capabilities

### 🔍 **Move Explorer**
- Integration with Lichess opening database
- Filter and search opening data
- Preview moves with statistics
- Win/draw/loss percentages and ratings

### 🎯 **Drill Trainer**
- Spaced-repetition flashcard system
- Practice key positions from your repertoire
- Track accuracy and improvement
- Difficulty-based card scheduling

### 📁 **Import & Export**
- Drag-and-drop PGN file import
- JSON export with full metadata
- Batch processing capabilities
- Data validation and error handling

### ⚙️ **Settings**
- Customizable board themes and piece sets
- Engine analysis configuration
- Notation style preferences
- Auto-save and backup options

## Technology Stack

- **Framework**: Electron + React + TypeScript
- **Styling**: SCSS with CSS custom properties
- **Chess Logic**: chess.js library
- **Icons**: Lucide React
- **Build**: Webpack + Electron Forge
- **Engine**: Stockfish integration

## Color Scheme

MajChesster features a distinctive dark theme inspired by Solo-Leveling:

- **Primary**: Neon Purple (#9B3DE4)
- **Secondary**: Deep Purple (#7A22A8) 
- **Accents**: Neon Blue (#00D0FF), Neon Cyan (#00FFC3)
- **Background**: Pure Black (#000000)
- **Text**: White (#FFFFFF) with purple accents

## Typography

- **Headings**: Allerta Stencil
- **Subheadings**: Alatsi
- **Body**: Glacial Indifference
- **Fine Print**: Ovo

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Eptulon/MajChesster.git
   cd MajChesster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Package for distribution**
   ```bash
   npm run make
   ```

This will create installers for your current platform in the `out/` directory.

## Cross-Platform Support

MajChesster supports:
- **Windows** (7, 8, 10, 11)
- **macOS** (10.14+)
- **Linux** (Ubuntu, Debian, Fedora, etc.)

## Data Format

### Repertoire JSON Schema
```json
{
  "id": "string",
  "name": "string", 
  "moves": ["string"],
  "annotations": {
    "move": "annotation"
  },
  "color": "white" | "black",
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "tags": ["string"]
}
```

## API Integration

### Lichess Opening Explorer
- Endpoint: `https://explorer.lichess.ovh/lichess`
- Parameters: `variant=standard&moves={moves}`
- Returns: Move popularity, win rates, and game statistics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Lichess** for the opening database API
- **Stockfish** for chess engine analysis
- **chess.js** for move validation and game logic
- **Electron** for cross-platform desktop capabilities

## Support

For support, feature requests, or bug reports, please open an issue on GitHub.

---

**Built with ❤️ for the chess community**
