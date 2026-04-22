# Study Planner - Clean & Focused Learning Platform

A visual study planner designed to replace cluttered learning interfaces with a clean, structured dashboard that unifies assignment tracking, progress visualization, and study scheduling.

## Features

### 📋 Assignment Tracking
- **Create & Manage Assignments**: Add assignments with title, subject, due date, priority, and description
- **Track Progress**: Visual progress bars showing completion percentage for each assignment
- **Status Management**: Mark assignments as "Not Started", "In Progress", or "Completed"
- **Smart Filtering**: Filter by status, subject, priority, or search by title/description
- **Bulk Actions**: Quick-click to toggle assignment completion

### 📅 Calendar View
- **Visual Scheduling**: See all your assignments laid out on a calendar
- **Month Navigation**: Easily navigate between months
- **Assignment Count**: Quick overview of how many assignments are due on each day
- **Today Indicator**: Clear marking of the current date

### 📊 Progress Analytics
- **Completion Rate**: Track your overall completion percentage
- **Status Breakdown**: Pie chart showing distribution of assignment statuses
- **Subject Progress**: Detailed progress bars for each subject
- **Priority Analysis**: See how many high/medium/low priority assignments you have
- **Study Insights**: Weekly statistics on assignments and study hours

### ⏱️ Study Timer (Pomodoro)
- **25-Minute Work Sessions**: Focus-friendly work duration
- **5-Minute Short Breaks**: Quick recovery between sessions
- **15-Minute Long Breaks**: Extended break after 4 sessions
- **Session Tracking**: Save completed sessions with subject association
- **Visual Feedback**: Clear indication of current mode (work/break)

### 🏷️ Subject Organization
- **Custom Subjects**: Create subjects/courses with custom colors and icons
- **Color Coding**: Visual distinction between different subjects across the app
- **Assignment Grouping**: All assignments automatically organized by subject
- **Quick Stats**: See assignment count for each subject

### 🔔 Smart Notifications
- **Upcoming Deadlines**: Get notified about assignments due in the next 3+ days
- **Overdue Alerts**: Clear indication of assignments that need immediate attention
- **Visual Bell Icon**: Quick access to all notifications from the sidebar

## Data Persistence

All data is automatically saved to your browser's localStorage:
- Assignments and their details
- Subjects and customizations
- Study sessions and timer history
- Notification preferences

Data persists across browser sessions and is available offline.

## Getting Started

1. **Visit the Dashboard**: Get an overview of your upcoming assignments and quick stats
2. **Create Your Subjects**: Customize your courses with colors and names
3. **Add Assignments**: Start adding your assignments with deadlines and priorities
4. **View Calendar**: See your entire month at a glance
5. **Use the Timer**: Start Pomodoro sessions to maintain focus
6. **Check Analytics**: Monitor your progress and study patterns
7. **Get Notifications**: Stay on top of upcoming deadlines

## Color System

The app uses a clean, minimal color palette:
- **Primary**: Blue (#3b82f6) - Main actions and highlights
- **Success**: Green (#10b981) - Completed items
- **Warning**: Orange (#f59e0b) - Medium priority
- **Error**: Red (#ef4444) - High priority and overdue items
- **Neutral**: Grays and whites - Clean, distraction-free backgrounds

## Responsive Design

The Study Planner is fully responsive and works great on:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop computers

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid & Flexbox

## Technologies Used

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: Browser localStorage

## Tips for Success

1. **Use Priority Levels**: Mark high-priority tasks clearly to focus on what matters
2. **Regular Check-ins**: Visit the Dashboard daily to stay on top of deadlines
3. **Pomodoro Technique**: Use the timer to maintain focus and avoid burnout
4. **Track Sessions**: Save your study sessions to build accountability
5. **Review Analytics**: Check your progress weekly to identify patterns
6. **Color Code**: Use subject colors to quickly identify task categories

---

**Master your studies with focused planning and tracking.**
