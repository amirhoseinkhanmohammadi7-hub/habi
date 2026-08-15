import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Utility function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial sample habits
const initialHabits = [
  {
    id: '1',
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation',
    category: 'Wellness',
    difficulty: 'easy',
    frequency: 'daily',
    reminderEnabled: true,
    reminderTime: '07:00',
    color: '#10b981',
    completedDates: [],
    notes: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Exercise',
    description: '30 minutes workout or running',
    category: 'Fitness',
    difficulty: 'medium',
    frequency: 'daily',
    reminderEnabled: true,
    reminderTime: '18:00',
    color: '#6366f1',
    completedDates: [],
    notes: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Read Book',
    description: 'Read at least 20 pages',
    category: 'Learning',
    difficulty: 'easy',
    frequency: 'daily',
    reminderEnabled: false,
    reminderTime: '21:00',
    color: '#f59e0b',
    completedDates: [],
    notes: [],
    createdAt: new Date().toISOString(),
  },
];

const categories = ['Wellness', 'Fitness', 'Learning', 'Productivity', 'Creativity', 'Social', 'Finance', 'Other'];
const difficulties = ['easy', 'medium', 'hard'];
const frequencies = ['daily', 'weekly', 'monthly'];
const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function App() {
  // State management
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });
  
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('today');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('purple');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Other',
    difficulty: 'medium',
    frequency: 'daily',
    reminderEnabled: false,
    reminderTime: '09:00',
    color: '#6366f1',
  });

  // Persist habits to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Get today's date string
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Calculate current streak for a habit
  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    const sortedDates = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    const checkDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const completedDate = new Date(sortedDates[i]);
      const diffDays = Math.floor((checkDate - completedDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Toggle habit completion
  const toggleHabit = (habitId, date = today) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const completedDates = habit.completedDates || [];
          const isCompleted = completedDates.includes(date);
          
          return {
            ...habit,
            completedDates: isCompleted
              ? completedDates.filter(d => d !== date)
              : [...completedDates, date],
          };
        }
        return habit;
      })
    );
  };

  // Add or update habit
  const saveHabit = () => {
    if (!formData.name.trim()) return;
    
    if (editingHabit) {
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === editingHabit.id
            ? { ...habit, ...formData }
            : habit
        )
      );
    } else {
      const newHabit = {
        id: generateId(),
        ...formData,
        completedDates: [],
        notes: [],
        createdAt: new Date().toISOString(),
      };
      setHabits(prevHabits => [...prevHabits, newHabit]);
    }
    
    closeModal();
  };

  // Delete habit
  const deleteHabit = (habitId) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
    }
  };

  // Add note to habit
  const addNote = (habitId, noteText) => {
    if (!noteText.trim()) return;
    
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              notes: [
                ...(habit.notes || []),
                {
                  id: generateId(),
                  text: noteText,
                  date: new Date().toISOString(),
                },
              ],
            }
          : habit
      )
    );
  };

  // Open modal for new/edit habit
  const openModal = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        name: habit.name,
        description: habit.description || '',
        category: habit.category,
        difficulty: habit.difficulty,
        frequency: habit.frequency,
        reminderEnabled: habit.reminderEnabled,
        reminderTime: habit.reminderTime || '09:00',
        color: habit.color,
      });
    } else {
      setEditingHabit(null);
      setFormData({
        name: '',
        description: '',
        category: 'Other',
        difficulty: 'medium',
        frequency: 'daily',
        reminderEnabled: false,
        reminderTime: '09:00',
        color: '#6366f1',
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingHabit(null);
  };

  // Filter habits
  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      const matchesCategory = filterCategory === 'all' || habit.category === filterCategory;
      const matchesDifficulty = filterDifficulty === 'all' || habit.difficulty === filterDifficulty;
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          habit.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [habits, filterCategory, filterDifficulty, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completedDates?.includes(today)).length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const totalCompletions = habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0);
    const bestStreak = Math.max(...habits.map(h => calculateStreak(h.completedDates)), 0);
    
    return { totalHabits, completedToday, completionRate, totalCompletions, bestStreak };
  }, [habits, today]);

  // Generate week data for chart
  const weekData = useMemo(() => {
    const startDate = startOfWeek(new Date());
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const completed = habits.filter(h => h.completedDates?.includes(dateStr)).length;
      
      return {
        day: days[i],
        completed,
        isToday: isSameDay(date, new Date()),
      };
    });
  }, [habits]);

  // Get habits for specific view
  const getHabitsForView = () => {
    switch (activeTab) {
      case 'today':
        return filteredHabits;
      case 'completed':
        return filteredHabits.filter(h => h.completedDates?.includes(today));
      case 'pending':
        return filteredHabits.filter(h => !h.completedDates?.includes(today));
      default:
        return filteredHabits;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>🎯 Habit Tracker Pro</h1>
        <p>Build better habits, track your progress, achieve your goals</p>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Column - Habits List */}
        <div>
          {/* Stats Cards */}
          <div className="card">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalHabits}</div>
                <div className="stat-label">Total Habits</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.completedToday}</div>
                <div className="stat-label">Completed Today</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.completionRate}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.bestStreak}</div>
                <div className="stat-label">Best Streak</div>
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weekData}>
                  <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                    {weekData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isToday ? '#6366f1' : '#10b981'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Your Habits</h2>
              <button className="btn btn-primary" onClick={() => openModal()}>
                + Add Habit
              </button>
            </div>

            {/* Search */}
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
              <button
                className={`filter-tab ${activeTab === 'today' ? 'active' : ''}`}
                onClick={() => setActiveTab('today')}
              >
                Today
              </button>
              <button
                className={`filter-tab ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </button>
              <button
                className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending
              </button>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '1rem' }}>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ width: 'auto', display: 'inline-block', marginRight: '0.5rem' }}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                style={{ width: 'auto', display: 'inline-block' }}
              >
                <option value="all">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Habits List */}
            <div>
              {getHabitsForView().length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <p>No habits found. Start by adding your first habit!</p>
                </div>
              ) : (
                getHabitsForView().map(habit => {
                  const isCompleted = habit.completedDates?.includes(today);
                  const streak = calculateStreak(habit.completedDates);
                  
                  return (
                    <div
                      key={habit.id}
                      className={`habit-item ${isCompleted ? 'completed' : ''}`}
                    >
                      <div
                        className={`habit-checkbox ${isCompleted ? 'checked' : ''}`}
                        onClick={() => toggleHabit(habit.id)}
                      >
                        {isCompleted && '✓'}
                      </div>
                      
                      <div className="habit-info">
                        <div className="habit-name" style={{ color: habit.color }}>
                          {habit.name}
                          <span className={`badge badge-${habit.difficulty}`} style={{ marginLeft: '0.5rem' }}>
                            {habit.difficulty}
                          </span>
                        </div>
                        {habit.description && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {habit.description}
                          </div>
                        )}
                        <div className="habit-streak">
                          🔥 {streak} day streak • {habit.category}
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min((streak / 30) * 100, 100)}%`,
                              background: `linear-gradient(90deg, ${habit.color}, var(--success-color))`,
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="habit-actions">
                        <button
                          className="btn-icon"
                          onClick={() => openModal(habit)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => deleteHabit(habit.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div>
          {/* Weekly Overview */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Weekly Overview</h2>
            </div>
            
            <div className="week-view">
              {weekData.map((dayData, index) => {
                const date = addDays(startOfWeek(new Date()), index);
                const dateStr = format(date, 'yyyy-MM-dd');
                
                return (
                  <div key={index} className="day-column">
                    <div className="day-header">{dayData.day}</div>
                    <div className="day-cells">
                      <div
                        className={`day-cell ${dayData.isToday ? 'today' : ''} ${
                          dayData.completed >= habits.length && habits.length > 0 ? 'completed' : ''
                        }`}
                      >
                        {format(date, 'd')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">🏆 Achievements</h2>
            </div>
            
            {stats.bestStreak >= 7 && (
              <div className="achievement-badge">
                <span>🔥</span>
                <span>Week Warrior - {stats.bestStreak} day streak!</span>
              </div>
            )}
            
            {stats.totalCompletions >= 50 && (
              <div className="achievement-badge" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                <span>⭐</span>
                <span>Dedication Master - {stats.totalCompletions} completions!</span>
              </div>
            )}
            
            {stats.completionRate === 100 && stats.totalHabits > 0 && (
              <div className="achievement-badge" style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}>
                <span>💯</span>
                <span>Perfect Day - All habits completed!</span>
              </div>
            )}
            
            {stats.bestStreak < 7 && stats.totalCompletions < 50 && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Keep going! Complete more habits to unlock achievements.
              </p>
            )}
          </div>

          {/* Quick Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">⚙️ Quick Settings</h2>
              <button
                className="btn-icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? '✕' : '⚙️'}
              </button>
            </div>
            
            {showSettings && (
              <div className="settings-section">
                <h3>Theme Color</h3>
                <div className="color-picker">
                  {colors.map(color => (
                    <div
                      key={color}
                      className={`color-option ${theme === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setTheme(color)}
                    />
                  ))}
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <button
                    className="btn btn-danger"
                    style={{ width: '100%' }}
                    onClick={() => {
                      if (confirm('Clear all data? This cannot be undone.')) {
                        localStorage.removeItem('habits');
                        setHabits(initialHabits);
                      }
                    }}
                  >
                    Reset All Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Habit */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Habit Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Meditation"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your habit..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <div className="frequency-options">
                {difficulties.map(diff => (
                  <div
                    key={diff}
                    className={`frequency-option ${formData.difficulty === diff ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, difficulty: diff })}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Frequency</label>
              <div className="frequency-options">
                {frequencies.map(freq => (
                  <div
                    key={freq}
                    className={`frequency-option ${formData.frequency === freq ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, frequency: freq })}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color: color })}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <div className="reminder-toggle">
                <label className="form-label" style={{ margin: 0 }}>Enable Reminder</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.reminderEnabled}
                    onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            {formData.reminderEnabled && (
              <div className="form-group">
                <label className="form-label">Reminder Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={closeModal} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveHabit} style={{ flex: 1 }}>
                {editingHabit ? 'Update Habit' : 'Create Habit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
