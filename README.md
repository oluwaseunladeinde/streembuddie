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
- **📤 Multi-Format Export**: Export CVs as PDF, Word, HTML, or Text with professional templates
- **🎨 Professional Templates**: 4 beautiful CV designs optimized for different industries
- **⚙️ Customization Options**: Personalize colors, fonts, and layouts to match your style
- **👁️ Live Preview**: See exactly how your CV will look before exporting

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
- **Export Libraries**: jsPDF, docx, html2canvas, file-saver
- **Template System**: Custom CV template engine with customization options

## 📋 How to Use

1. **Enter Personal Info**: Start by providing your full name
2. **Upload CV**: Drag and drop your CV (PDF, DOC, DOCX) or click to browse
3. **Job Details**: Enter the company name, role, and job description
4. **Get Results**: Download your optimized CV and personalized cover letter

## 🎨 Export & Templates

### Professional CV Templates
- **Modern Professional**: Clean, contemporary design perfect for tech and creative roles
- **Classic Professional**: Traditional layout ideal for corporate environments
- **Creative Impact**: Eye-catching design for creative and design professionals
- **ATS Optimized**: Maximum compatibility with Applicant Tracking Systems

### Export Formats
- **PDF**: Print-ready, professional appearance (Recommended)
- **Word (.docx)**: Fully editable, track changes support
- **HTML**: Web portfolio, mobile responsive
- **Text**: ATS systems, universal compatibility

### Customization Options
- **Color Schemes**: Professional, Modern, Creative, and Classic palettes
- **Font Styles**: Modern, Classic, and Clean typography choices
- **Layout Variations**: Single-column and two-column designs
- **Live Preview**: See exactly how your CV will look before exporting

### How to Export
1. **Access Export Panel**: Click "Export & Templates" in header or CV section
2. **Choose Template**: Select from 4 professional designs
3. **Select Format**: Choose export format (PDF recommended)
4. **Customize**: Adjust colors and fonts (optional)
5. **Preview**: See your CV with selected template
6. **Export**: Download in your chosen format

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

### Multi-Format Export & Templates System 🆕
- **Professional CV Templates**: 4 different designs (Modern, Classic, Creative, ATS-Optimized)
- **Multiple Export Formats**: PDF (print-ready), Word (.docx), HTML (web), and Text (ATS)
- **Template Customization**: Color schemes, fonts, and layout variations
- **Live Preview System**: See your CV with selected template before exporting
- **ATS Optimization**: Templates designed for Applicant Tracking System compatibility
- **Dual Interface**: Full export panel in header, compact inline panel in CV section
- **Real Document Generation**: Uses jsPDF and docx libraries for production-quality output

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
│   ├── DataManagement.jsx   # Privacy and data controls
│   ├── ExportPanel.jsx      # Full-featured export interface
│   ├── InlineExportPanel.jsx # Compact inline export panel
│   ├── CVPreview.jsx        # Live template preview
│   └── ExportDemo.jsx       # Export features showcase
├── utils/
│   ├── cvAnalysis.js        # CV analysis utilities
│   ├── localStorage.js      # Local storage management
│   ├── cvExport.js          # Multi-format export utilities
│   └── cvTemplates.js       # Template system and customization
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
- **Export System**: Multi-format CV export with professional templates
- **Template Engine**: 4 professional CV designs with customization options
- **Preview System**: Live template preview before export
- **Customization Panel**: Color schemes, fonts, and layout options

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
