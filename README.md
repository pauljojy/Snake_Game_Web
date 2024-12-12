# Snake Game

A modern implementation of the classic Snake game with a retro Galaga-inspired theme and global high scores system. Built with HTML5 Canvas, JavaScript, and Firebase.

[Add a screenshot or GIF of your game here]

## 🎮 Play Now

[\[Click to Play\]](https://snake-game-web-delta.vercel.app/)

## ✨ Features

- 🐍 Classic Snake gameplay with modern visuals
- 🎨 Retro Galaga-inspired theme with neon effects
- 🏆 Global leaderboard system using Firebase
- 📱 Fully responsive design for both desktop and mobile
- ⌨️ Multiple control options:
  - Desktop: Arrow keys
  - Mobile: Touch/Swipe controls
- ⏸️ Pause functionality (ESC key on desktop, Pause button on mobile)
- 🔄 Progressive difficulty - speed increases as you score higher
- 💾 Offline fallback for high scores

## 🎯 How to Play

1. Use arrow keys (desktop) or swipe gestures (mobile) to control the snake
2. Eat the food to grow longer and score points
3. Avoid hitting the walls or yourself
4. Try to achieve a high score and get on the leaderboard!

## 🛠️ Built With

- HTML5 Canvas for game rendering
- CSS3 for styling and animations
- Vanilla JavaScript for game logic
- Firebase Firestore for global high scores
- Google Fonts (Press Start 2P) for retro styling

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/snake-game.git
```

2. Open `index.html` in your web browser to play locally

3. To enable high scores:
   - Create a Firebase project
   - Enable Firestore Database
   - Update Firebase configuration in `index.html`

## 🔧 Firebase Configuration

Replace the Firebase configuration in `index.html` with your own:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

## 📱 Mobile Support

- Responsive design that works on all screen sizes
- Touch controls optimized for mobile play
- Mobile-specific pause button
- Adjusted UI elements for better mobile experience

## 🎮 Controls

### Desktop

- ⬆️ Up Arrow: Move Up
- ⬇️ Down Arrow: Move Down
- ⬅️ Left Arrow: Move Left
- ➡️ Right Arrow: Move Right
- ESC: Pause Game
- Space: Restart after game over

### Mobile

- Swipe Up: Move Up
- Swipe Down: Move Down
- Swipe Left: Move Left
- Swipe Right: Move Right
- Pause Button: Pause Game
- Touch Screen: Restart after game over

## 🏗️ Project Structure

```
snake-game/
│
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── game.js            # Game logic and Firebase integration
└── README.md          # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👏 Acknowledgments

- Inspired by the classic Snake game
- Galaga-inspired visual theme
- Firebase for providing the backend infrastructure
- Google Fonts for the retro typeface

## 📧 Contact

Project Link: [Snake Game](https://github.com/pauljojy/Snake_Game_Web)
