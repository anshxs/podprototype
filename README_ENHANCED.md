# Study Planner 2.0 - Modern & Elegant Edition

A sophisticated study planning application that combines clean design with powerful productivity features. Built with Next.js, Framer Motion, and Tailwind CSS for a premium user experience.

## Why Study Planner 2.0?

**Problem Solved**: Learning platforms are visually cluttered and kill student engagement. This app replaces overwhelming interfaces with a clean, structured, and visually delightful dashboard.

**Solution Delivered**: A unified platform for assignment tracking, progress visualization, study scheduling, goal management, and performance insights—all in one beautifully designed interface.

---

## Key Features

### Assignment Management
- Create, edit, and track assignments
- Set priorities and due dates
- Progress tracking with percentage completion
- Smart filters and sorting options
- Status management (not started, in-progress, completed)

### Rich Study Notes
- Powerful rich text editor (TipTap)
- Format text with bold, italic, headings, lists
- Tag-based organization
- Note linking to assignments
- Search and filter capabilities

### Grade Tracking
- Record assignment grades
- Automatic GPA calculation
- Subject performance analytics
- Visual grade distribution charts
- Grade trending and analysis

### Goal Setting System
- Create study goals with targets
- Break goals into milestones
- Track progress with visual indicators
- Priority-based organization
- Deadline management

### Study Schedules
- Weekly schedule planning
- Time-based study sessions
- Subject-specific scheduling
- Recurring sessions
- Schedule analytics and summaries

### Study Groups
- Create collaborative study groups
- Add group members
- Track member information
- Shared assignment foundation
- Team organization tools

### Pomodoro Timer
- 25-minute focus sessions
- 5-minute short breaks
- 15-minute long breaks
- Automatic session logging
- Study time tracking

### Analytics Dashboard
- Completion rates
- Study hours per week
- Subject-based performance
- Upcoming deadline alerts
- Professional data visualizations

---

## Design Features

### Modern Aesthetic
- **Dark Mode**: Eye-friendly interface optimized for study sessions
- **Neon Accents**: Vibrant cyan, pink, green, and purple colors
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Gradient Text**: Premium gradient overlays for emphasis
- **Smooth Animations**: Framer Motion-powered micro-interactions

### Interactive Elements
- Animated card entrances
- Hover glow effects
- Smooth state transitions
- Progress bar animations
- Staggered list animations

### Responsive Design
- Mobile-first approach
- Tablet optimized layouts
- Desktop enhanced experience
- Flexible grid system
- Touch-friendly interactions

---

## Pages & Navigation

| Page | Route | Features |
|------|-------|----------|
| Dashboard | `/` | Overview, stats, quick actions, theme settings |
| Assignments | `/assignments` | CRUD operations, filtering, progress tracking |
| Study Notes | `/notes` | Rich text editor, tagging, organization |
| Grades | `/grades` | GPA calculation, performance charts |
| Calendar | `/calendar` | Visual deadline calendar, event overview |
| Goals | `/goals` | Goal creation, milestones, progress tracking |
| Schedules | `/schedules` | Weekly planning, time management |
| Study Groups | `/groups` | Group creation, member management |
| Analytics | `/analytics` | Performance insights, data visualization |
| Timer | `/timer` | Pomodoro sessions, tracking |
| Subjects | `/subjects` | Subject management, color coding |
| Settings | `/settings` | Preferences, theme customization, data management |

---

## Technical Stack

### Frontend Framework
- **Next.js 16**: App Router, server components, optimized performance
- **React 19**: Latest hooks, improved rendering

### Styling & Animation
- **Tailwind CSS v4**: Utility-first styling with custom theme
- **Framer Motion**: Smooth page and component animations
- **CSS Variables**: Dynamic theming system

### Rich Content & Forms
- **TipTap**: Headless rich text editor
- **React Hook Form**: Form state management (ready for use)

### Data Visualization
- **Recharts**: Professional chart library
- **Responsive Charts**: Auto-scaling visualizations

### Drag & Drop
- **@dnd-kit**: Modern drag-drop foundation (ready for implementation)

### State Management
- **React Context API**: Global state with custom hooks
- **Local Storage**: Browser-based persistence
- **Custom Hooks**: Reusable logic (useAssignments, useTimer, useNotifications)

---

## Getting Started

### Installation

```bash
# Clone or download the project
cd study-planner

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup
- The app comes pre-loaded with sample data
- All settings are automatically saved to browser storage
- No backend or authentication required

### Customization
Visit **Settings** to:
- Choose dark/light mode
- Select accent color (cyan, pink, green, purple)
- Configure notification preferences
- Manage notification timing

---

## Project Structure

```
study-planner/
├── app/                      # Next.js pages
│   ├── page.tsx             # Dashboard
│   ├── assignments/         # Assignment management
│   ├── notes/               # Study notes
│   ├── grades/              # Grade tracking
│   ├── goals/               # Goal setting
│   ├── schedules/           # Study scheduling
│   ├── groups/              # Study groups
│   ├── analytics/           # Analytics dashboard
│   ├── timer/               # Pomodoro timer
│   ├── subjects/            # Subject management
│   ├── settings/            # Settings & preferences
│   └── layout.tsx           # Root layout
├── components/
│   ├── shared/              # Reusable components
│   │   ├── Navigation.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── AnimatedCard.tsx
│   │   ├── GlassCard.tsx
│   │   └── ThemeSettings.tsx
│   ├── assignments/         # Assignment-specific
│   ├── notes/              # Notes-specific
│   └── ui/                 # UI primitives (shadcn)
├── context/
│   └── StorageContext.tsx  # Global state
├── hooks/
│   ├── useAssignments.ts
│   ├── useTimer.ts
│   └── useNotifications.ts
├── lib/
│   ├── types.ts            # TypeScript definitions
│   ├── constants.ts        # App constants
│   └── dateHelpers.ts      # Utility functions
├── app/globals.css         # Global styles & animations
└── package.json

```

---

## Data Model

### Core Entities

**Assignment**
```typescript
{
  id: string
  title: string
  subject: string
  description?: string
  dueDate: string
  status: 'not-started' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  estimatedHours: number
  completionPercentage: number
  grade?: number
  createdAt: string
}
```

**StudyNote**
```typescript
{
  id: string
  assignmentId: string
  title: string
  content: string (HTML)
  tags: string[]
  createdAt: string
  updatedAt: string
}
```

**Grade**
```typescript
{
  id: string
  assignmentId: string
  score: number
  maxScore: number
  comments?: string
  recordedAt: string
}
```

**Goal**
```typescript
{
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: 'hours' | 'percentage' | 'count'
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  milestones: Milestone[]
  createdAt: string
}
```

---

## Browser Storage

All data is stored in browser localStorage under these keys:
- `study-planner-assignments`
- `study-planner-subjects`
- `study-planner-sessions`
- `study-planner-notes`
- `study-planner-grades`
- `study-planner-goals`
- `study-planner-schedules`
- `study-planner-groups`
- `study-planner-theme`
- `study-planner-notifications`
- `study-planner-initialized`

---

## Customization

### Color Scheme
Edit `/app/globals.css` to modify the neon accent colors:

```css
--primary: #00d9ff;      /* Cyan */
--secondary: #ff006e;    /* Pink */
--accent: #00ff88;       /* Green */
```

### Add New Subjects
1. Go to `/subjects` page
2. Click "Add Subject"
3. Choose name, color, and icon
4. Subjects are available for assignment filtering

### Create Study Groups
1. Navigate to `/groups`
2. Click "New Group"
3. Add members with email addresses
4. Manage group assignments

---

## Performance Optimizations

- Zero external API calls
- Instant page loads (no backend latency)
- Optimized React rendering
- Smooth 60fps animations
- Efficient state management
- Code-split pages
- CSS-in-JS minimization

---

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Tips for Success

1. **Start with assignments**: Add your current or upcoming assignments
2. **Use subjects**: Organize assignments by subject for better tracking
3. **Set goals**: Create study goals and track progress
4. **Schedule sessions**: Plan weekly study blocks
5. **Take notes**: Use the rich editor for assignment notes
6. **Monitor grades**: Track grades to identify improvement areas
7. **Use the timer**: Regular Pomodoro sessions improve focus
8. **Check analytics**: Review your performance dashboard weekly

---

## Features Coming Soon

- Cloud synchronization
- Mobile app version
- Real-time collaboration
- AI study recommendations
- Integration with calendar apps
- Automatic reminders
- Dark mode toggle
- Export reports
- Study streak tracking

---

## Support & Feedback

This is a self-contained web application. All data is stored locally in your browser. For the best experience:

- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Enable JavaScript
- Allow localStorage access
- Clear cache if experiencing issues

---

## License

This study planner is provided as-is for educational and personal use.

---

**Study Planner 2.0** - Master your studies with elegance and efficiency.

*Designed for students who demand both beauty and functionality.*
