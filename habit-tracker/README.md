# 🎯 Habit Tracker Pro

A comprehensive, feature-rich habit tracking application built with React and Vite.

## ✨ Features

### Core Functionality
- **Create & Manage Habits** - Add, edit, and delete habits with detailed configuration
- **Track Daily Progress** - Mark habits as complete with a simple click
- **Streak Tracking** - Monitor your consecutive day streaks for each habit
- **Progress Visualization** - Beautiful charts showing weekly completion data

### Advanced Features
- **Categories** - Organize habits into 8 predefined categories (Wellness, Fitness, Learning, Productivity, Creativity, Social, Finance, Other)
- **Difficulty Levels** - Set difficulty (Easy, Medium, Hard) for better goal management
- **Frequency Options** - Choose daily, weekly, or monthly frequency
- **Custom Colors** - Personalize each habit with color coding
- **Reminders** - Enable reminders with customizable times
- **Search & Filter** - Find habits quickly with search and filter by category/difficulty
- **Tab Views** - Switch between Today, Completed, and Pending views

### Analytics & Gamification
- **Statistics Dashboard** - View total habits, completions, completion rate, and best streak
- **Weekly Chart** - Visual bar chart showing completion patterns
- **Achievements System** - Unlock badges for milestones:
  - 🔥 Week Warrior - 7+ day streak
  - ⭐ Dedication Master - 50+ completions
  - 💯 Perfect Day - 100% completion rate

### User Experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Local Storage** - Data persists automatically in browser
- **Beautiful UI** - Modern gradient design with smooth animations
- **Dark/Light Compatible** - Clean design that works in any lighting

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd habit-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Open the app** in your browser (usually http://localhost:5173)
2. **Add your first habit** by clicking the "+ Add Habit" button
3. **Configure your habit**:
   - Name and description
   - Category (e.g., Fitness, Learning)
   - Difficulty level
   - Frequency
   - Color
   - Optional reminder
4. **Track progress** by clicking the checkbox each day
5. **View statistics** in the dashboard
6. **Earn achievements** as you build streaks!

## 📁 Project Structure

```
habit-tracker/
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Entry point
│   └── index.css         # Styles and theme
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **CSS3** - Custom styling with CSS variables
- **LocalStorage** - Data persistence

## 🎨 Customization

You can easily customize the app by modifying:

- **Colors** - Edit CSS variables in `index.css`
- **Categories** - Modify the `categories` array in `App.jsx`
- **Achievements** - Adjust thresholds in the stats calculations
- **Theme** - Change the gradient in the body background

## 📊 Data Storage

All data is stored locally in your browser's localStorage under the key `habits`. Your data includes:
- Habit configurations
- Completion history
- Notes (future feature)
- Creation dates

## 🔒 Privacy

This app runs entirely in your browser. No data is sent to any server. All information stays on your device.

## 📝 License

MIT License - Feel free to use and modify!

---

**Start building better habits today!** 🎯
