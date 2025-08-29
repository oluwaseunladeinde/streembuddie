# StreemBuddie 🚀

**AI-Powered CV Optimization Tool**

StreemBuddie is a modern web application that helps job seekers optimize their CVs and generate personalized cover letters using AI-powered analysis. Built with React, Vite, and Tailwind CSS.

## ✨ Features

- **🎯 Smart CV Optimization**: AI-powered analysis that tailors your CV to specific job descriptions
- **📊 CV Scoring & Analysis**: Real-time scoring with skill matching and improvement recommendations  
- **📄 Cover Letter Generation**: Automatically generates personalized cover letters
- **📁 Drag & Drop Upload**: Professional file upload with validation and visual feedback
- **💾 Auto-Save & Session Management**: Never lose your work with automatic saving and session restoration
- **📝 Application History**: Quick access to previous applications for efficiency
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations
- **🔒 Privacy First**: All processing happens in your browser - no data sent to servers
- **📱 Mobile Friendly**: Responsive design that works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd streembuddie

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Build Tool**: Vite with HMR
- **Code Quality**: ESLint
- **File Processing**: Custom drag-and-drop implementation

## 📋 How to Use

1. **Enter Personal Info**: Start by providing your full name
2. **Upload CV**: Drag and drop your CV (PDF, DOC, DOCX) or click to browse
3. **Job Details**: Enter the company name, role, and job description
4. **Get Results**: Download your optimized CV and personalized cover letter

## 🎯 Recent Updates (August 2025)

### Enhanced Drag & Drop File Upload
- **Professional drag-and-drop interface** with visual feedback
- **Smart file validation** (type, size, format checking)
- **Real-time processing status** with loading animations
- **Error handling** with clear, actionable messages
- **File information display** showing name and size

### CV Scoring & Analysis Dashboard
- **Real-time CV scoring** with detailed analysis as you type
- **Skill matching analysis** shows which job requirements you meet
- **Missing skills identification** with priority recommendations
- **Visual progress bars** and score indicators
- **Actionable recommendations** for CV improvement

### Session Management & Data Persistence
- **Auto-save functionality** preserves work as you type (1-second debounce)
- **Session restoration** allows users to continue where they left off
- **Application history** for quick access to previous job applications
- **Privacy-focused storage** - CV files never saved, only job details
- **Data management controls** for export and privacy management
- **User preferences** with customizable settings

### Technical Improvements
- **Custom React hooks** for reusable logic (`useDragAndDrop`, `useCVAnalysis`, `useSessionManager`)
- **Enhanced state management** for better user experience
- **Comprehensive error handling** and validation
- **Local storage utilities** with error handling and data encryption
- **Component-based architecture** for maintainability

## 🔧 Development

### Project Structure
```
src/
├── hooks/
│   ├── useDragAndDrop.js    # Reusable drag-and-drop logic
│   ├── useCVAnalysis.js     # CV scoring and analysis
│   └── useSessionManager.js # Session persistence and history
├── components/
│   ├── ScoringComponents.jsx # CV analysis dashboard components
│   ├── ApplicationHistory.jsx # Previous applications display
│   └── DataManagement.jsx   # Privacy and data controls
├── utils/
│   ├── cvAnalysis.js        # CV analysis utilities
│   └── localStorage.js      # Local storage management
├── App.jsx                  # Main application component
├── main.jsx                 # Application entry point
└── index.css                # Tailwind CSS imports
```

### Key Components
- **Step-based Wizard**: Guides users through the optimization process
- **Drag & Drop Upload**: Professional file upload with validation
- **CV Analysis Dashboard**: Real-time scoring with detailed insights
- **CV Optimization Engine**: AI-powered content enhancement
- **Cover Letter Generator**: Personalized cover letter creation
- **Session Management**: Auto-save and application history
- **Privacy Controls**: Data management and export tools

## 🚀 Deployment

The app is ready for deployment to any static hosting service:

- **Vercel**: `npm run build` then deploy the `dist` folder
- **Netlify**: Connect your repo and set build command to `npm run build`
- **GitHub Pages**: Build locally and push to `gh-pages` branch

## 🤝 Contributing

This is a personal project, but feel free to:
- Report issues or bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT License - feel free to use this code for your own projects!

---

**Built with ❤️ for job seekers everywhere**
