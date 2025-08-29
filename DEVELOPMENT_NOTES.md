# StreemBuddie Development Notes

## Recent Improvements (August 2025)

### ✅ Enhanced Drag & Drop File Upload
The app now includes a professional drag-and-drop file upload system with the following features:

#### What Was Added:
1. **Custom Hook (`src/hooks/useDragAndDrop.js`)**
   - Handles all drag-and-drop logic and state management
   - Provides file validation (type, size limits)
   - Manages drag states for visual feedback
   - Reusable across the application

2. **Enhanced Upload UI**
   - Visual feedback when dragging files over the drop zone
   - Animated drag overlay with bounce effect
   - Error states with clear messaging
   - File size display and processing status
   - Loading animations during text extraction

3. **Better File Validation**
   - Supports PDF, DOC, DOCX files only
   - 10MB file size limit
   - Clear error messages for invalid files
   - Prevents multiple file uploads

#### Key Features:
- **Drag Counter**: Prevents premature drag leave when hovering over child elements
- **Visual States**: Different colors and animations for normal, drag, error states
- **File Processing**: Shows real-time status during text extraction
- **Error Handling**: User-friendly error messages with recovery guidance

### Technical Implementation Details

#### File Structure:
```
src/
├── hooks/
│   └── useDragAndDrop.js     # Reusable drag-and-drop logic
├── App.jsx                   # Main component with enhanced Step 2
└── index.css                 # Tailwind CSS v4 setup
```

#### Key Code Patterns:

1. **Hook Usage**:
```javascript
const { isDragOver, error: uploadError, dragHandlers, handleFileInputChange } = useDragAndDrop(handleCVUpload);
```

2. **Drag Handlers**:
```javascript
<div {...dragHandlers} className="drag-drop-zone">
  {/* Upload content */}
</div>
```

3. **State Management**:
- Uses `dragCounter` to handle nested elements
- Manages `isDragOver` for visual feedback
- Tracks `error` states for validation

## How to Continue Development Independently

### 1. Understanding the Codebase
- **App.jsx**: Main component with step-based wizard
- **useDragAndDrop.js**: Reusable hook for file uploads
- **Tailwind CSS v4**: No config file needed, just `@import "tailwindcss"`

### 2. Adding New Features
Here are self-contained improvements you can add:

#### A. Real PDF Text Extraction
```bash
npm install pdf-parse
```
Then replace the simulated extraction in `handleCVUpload` with real PDF parsing.

#### B. Local Storage for Form Data
Add persistence so users don't lose progress:
```javascript
// Save to localStorage
localStorage.setItem('streembuddie-data', JSON.stringify(formData));

// Load from localStorage
const savedData = localStorage.getItem('streembuddie-data');
if (savedData) {
  setFormData(JSON.parse(savedData));
}
```

#### C. CV Scoring System
Add a simple scoring algorithm that analyzes:
- Keyword match percentage
- CV length optimization
- Section completeness

### 3. Common Patterns in the Codebase

#### State Updates:
```javascript
setFormData(prev => ({ ...prev, newField: newValue }));
```

#### Conditional Styling:
```javascript
className={`base-classes ${condition ? 'active-classes' : 'inactive-classes'}`}
```

#### Loading States:
```javascript
{isLoading ? <LoadingSpinner /> : <NormalContent />}
```

## Troubleshooting Guide

### Tailwind CSS Issues
- Ensure `postcss.config.js` exists with `@tailwindcss/postcss`
- CSS import should be: `@import "tailwindcss";`
- Restart dev server after config changes

### File Upload Issues
- Check browser console for drag-and-drop errors
- Validate file types match the accepted formats
- Test with different file sizes to ensure validation works

### Development Workflow
1. Make small, incremental changes
2. Test each change in the browser
3. Use browser dev tools to debug issues
4. Keep the dev server running with `npm run dev`

## Next Steps for Independent Development

### Priority 1: Real File Processing
- Install `pdf-parse` or `mammoth` for real document parsing
- Replace simulated text extraction with actual parsing
- Add support for different document formats

### Priority 2: Enhanced CV Analysis
- Add keyword density analysis
- Implement ATS-friendly formatting suggestions
- Create industry-specific optimization templates

### Priority 3: Export Functionality
- Add PDF export capability using libraries like `jsPDF`
- Create multiple CV format templates
- Add print-friendly styling

## Resources for Continued Learning

### Documentation:
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [React Hooks Guide](https://react.dev/reference/react)
- [Vite Configuration](https://vitejs.dev/config/)

### Libraries to Consider:
- `pdf-parse`: PDF text extraction
- `mammoth`: Word document parsing
- `jsPDF`: PDF generation
- `html2canvas`: Screenshot/export functionality

## Architecture Notes

The app follows a simple, maintainable structure:
- **Component-based**: Each step is self-contained
- **Hook-based logic**: Business logic separated into custom hooks
- **State-driven UI**: All UI changes based on state updates
- **No external dependencies**: Currently works entirely in the browser

This approach makes it easy to:
- Add new features without breaking existing ones
- Test individual components in isolation
- Scale the application as needed
- Maintain clean, readable code

## Build and Deployment

### Development:
```bash
npm run dev        # Start development server
npm run lint       # Check code quality
```

### Production:
```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

The app is ready for deployment to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## Session Management & Data Persistence ✅ COMPLETED

### Overview
Full session management system with auto-save, application history, and privacy controls.

### Components Added:

#### 1. Local Storage Utilities (`src/utils/localStorage.js`)
- **Safe Storage**: Error-handled localStorage operations
- **Session Management**: Current session with 24hr auto-expiry
- **Application History**: Up to 10 recent applications (job details only, no CV text)
- **User Preferences**: Auto-save settings, UI preferences
- **Privacy Tools**: Data export, selective data clearing

#### 2. Session Manager Hook (`src/hooks/useSessionManager.js`)
- **Auto-save**: Debounced form data saving (1s delay)
- **Session Restoration**: Automatic reload of previous session
- **History Management**: Load/delete previous applications
- **Preference Control**: User setting management
- **Privacy First**: CV files/text never persisted to history

#### 3. Application History Component (`src/components/ApplicationHistory.jsx`)
- **Previous Work Display**: Shows recent applications with job details
- **Quick Continue**: One-click loading of previous job details
- **Smart Privacy**: Only loads company/role info, requires CV re-upload
- **Clean UI**: Compact view perfect for Step 1 integration

#### 4. Data Management Modal (`src/components/DataManagement.jsx`)
- **Storage Overview**: Shows current session and history status
- **Privacy Controls**: Toggle auto-save, view data usage
- **Export Function**: Download all data as JSON
- **Clear Options**: Selective or complete data removal
- **Privacy Notice**: Clear explanation of data handling

### Integration Features:

1. **Auto-Save Active**: Form data saves automatically as users type
2. **Session Restoration**: Users return where they left off (within 24 hours)
3. **Application History**: Previous applications accessible in Step 1
4. **Privacy Controls**: Data management available in header
5. **Smart Loading**: History loads safely without exposing sensitive CV data

### User Experience Improvements:

- **No Data Loss**: Work is preserved across browser sessions
- **Quick Restart**: Easy access to previous application attempts
- **Privacy Conscious**: Sensitive CV data never persisted
- **User Control**: Full control over what data is stored
- **Transparent**: Clear information about data handling

### Technical Implementation:

- **Debounced Auto-save**: Prevents excessive storage operations
- **Error Handling**: Graceful degradation if localStorage unavailable
- **Memory Efficient**: Automatic cleanup of old sessions
- **Privacy Focused**: Minimal data retention with user control
- **React Integration**: Seamless hooks-based integration

The session management system is production-ready and provides a professional user experience while maintaining strict privacy standards.
