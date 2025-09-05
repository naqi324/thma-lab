# CLAUDE.md - Project Documentation for Healthcare GenAI Training Application

## 🏥 Project Overview

### Purpose
This single-page web application provides step-by-step instructions for healthcare executives to build generative AI chat applications using Amazon SageMaker Unified Studio. The application focuses on creating two specific healthcare-focused AI assistants:
1. **Formulary & Patient Education Bot** - Powered by Palmyra X5
2. **Biomedical/IT Troubleshooting Agent** - Powered by Nova Lite

### Target Audience
- **Primary**: Healthcare executives (non-technical)
- **Secondary**: Healthcare IT administrators
- **Characteristics**: Limited technical background, need clear visual guidance, focused on practical implementation

### Current State
- Simple React-based single-page application
- Markdown-driven content rendering
- Basic instructional design with step-by-step screenshots
- Clean, professional aesthetic with light/dark mode support
- Copy-to-clipboard functionality for code snippets

### Business Goals
- Enable healthcare executives to independently create AI chat applications
- Reduce dependency on technical staff for initial AI prototyping
- Demonstrate practical healthcare use cases for generative AI
- Provide hands-on experience with Amazon SageMaker Unified Studio

---

## 🏗️ Technical Architecture

### Technology Stack

#### Core Framework
- **Vite 5.4.10**: Build tool and development server
- **React 18.2.0**: UI framework with TypeScript support
- **TypeScript 5.4.5**: Type-safe development

#### Key Dependencies
```json
{
  "markdown-it": "^14.1.0",        // Markdown parsing and rendering
  "highlight.js": "^11.11.1",      // Syntax highlighting for code blocks
  "aws-amplify": "^6.6.6",          // AWS integration (currently minimal usage)
  "@aws-amplify/ui-react": "^6.5.5" // AWS UI components (future expansion)
}
```

#### Build Configuration
- **Development**: `npm run dev` (Vite dev server on port 5173)
- **Production**: `npm run build` (TypeScript compilation + Vite bundling)
- **Preview**: `npm run preview` (Production build preview)
- **Linting**: `npm run lint` (ESLint with TypeScript support)

### File Structure
```
thma-lab/
├── public/
│   ├── index.md                   # Main instructional content (Markdown)
│   ├── images/                     # Screenshot assets for instructions
│   │   ├── unified-build-chat-agent.png
│   │   ├── save-button.png
│   │   ├── back-to-configs.png
│   │   ├── create-app.png
│   │   ├── create-function.png
│   │   ├── select-functions.png
│   │   ├── three-dots.png
│   │   ├── rename.png
│   │   ├── add-example.png        # Add example button interface
│   │   └── formulary-guard.png    # Guardrails dropdown selection
│   ├── kb/                         # Knowledge base CSV files
│   │   ├── formulary-kb.csv
│   │   ├── device-kb.csv
│   │   └── sop-kb.csv
│   └── vite.svg                    # Default favicon
├── src/
│   ├── App.tsx                     # Main React component
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles with design system
│   ├── App.css                     # Component-specific styles (minimal)
│   └── vite-env.d.ts              # TypeScript environment definitions
├── dist/                           # Production build output
├── amplify/                        # AWS Amplify backend configuration
│   ├── auth/resource.ts
│   ├── data/resource.ts
│   └── backend.ts
└── Configuration Files
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── amplify.yml
```

### AWS Amplify Integration
- **Authentication**: Cognito configuration ready (not actively used)
- **Backend**: Amplify backend setup for future expansion
- **Data**: DynamoDB resource configuration available
- **Deployment**: Amplify hosting configuration via `amplify.yml`

---

## 🎨 Current Features and Content

### Content Architecture

#### Main Instructional Flow
1. **Introduction**: Overview of the two chat bots to build
2. **App 1: Formulary Assistant**
   - Model configuration (Palmyra X5)
   - System prompt engineering
   - Example conversations setup
   - Inference parameters tuning
   - Knowledge base creation
   - Guardrails implementation
   - UI customization
3. **App 2: Biomedical/IT Agent**
   - Model configuration (Nova Lite)
   - Advanced system prompt
   - Function calling setup (API integration)
   - Multiple knowledge bases
   - Complex JSON schemas for APIs

#### Interactive Elements
- **Code Blocks**: Syntax-highlighted with copy buttons
- **Collapsible Sections**: `<details>` tags for lengthy JSON schemas
- **Visual Guides**: Screenshots at critical decision points
- **Quick-Start Prompts**: Pre-written example queries

### Current UI/UX Implementation

#### Visual Design System
```css
/* Design Tokens */
--radius: 14px;              /* Rounded corners for modern feel */
--shadow: 0 2px 10px rgba(); /* Subtle depth */
--fs-0 to --fs-3;           /* Fluid typography scale */

/* Color Palette (Light Mode) */
--bg: #fafafa;              /* Soft background */
--surface: #ffffff;         /* Card surface */
--text: #1f2328;           /* High contrast text */
--link: #2563eb;           /* Accessible blue links */

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  /* Automatic dark theme adaptation */
}
```

#### Responsive Layout
- Single-column centered card design (max-width: 900px)
- Fluid typography with clamp() functions
- Mobile-first approach with graceful scaling
- Image optimization with automatic sizing

#### Component Patterns
1. **Markdown Renderer**: Custom configuration with highlight.js integration
2. **Copy Button System**: Dynamic injection for all code blocks
3. **Image Handling**: Rounded corners and shadows for professional appearance
4. **Typography**: Inter font family for optimal readability

---

## 📋 Design System Requirements

### Accessibility Standards
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Font Size**: Base 16px minimum for body text
- **Interactive Elements**: Minimum 44x44px touch targets
- **Keyboard Navigation**: Full keyboard accessibility required
- **Screen Reader Support**: Semantic HTML and ARIA labels

### Professional Healthcare Aesthetics
- **Trust Indicators**: Clean, clinical design language
- **Visual Hierarchy**: Clear step progression and numbering
- **Error Prevention**: Visual confirmation for critical actions
- **Consistency**: Uniform styling across all instructional elements

### Content Presentation Guidelines
- **Reading Level**: 8th-10th grade comprehension level
- **Sentence Structure**: Short, action-oriented sentences
- **Technical Terms**: Glossary or inline explanations needed
- **Visual Learning**: Screenshot for every critical step
- **Progress Indicators**: Clear section numbering and completion tracking

---

## 📚 SageMaker Unified Instructions Documentation

### Current Content Structure

#### Section Organization
1. **Bot Overview** (2 applications)
2. **Formulary Assistant Setup** (8 major configuration areas)
   - Model selection
   - System prompt configuration
   - Example management
   - Parameter tuning
   - Knowledge base setup
   - Guardrail implementation
   - UI customization
   - Deployment options
3. **Biomedical/IT Agent Setup** (9 configuration areas)
   - Advanced model configuration
   - Complex system prompting
   - Function definitions (2 API schemas)
   - Multi-knowledge base setup

#### Code Examples Provided
- **System Prompts**: 2 complete examples with safety guidelines
- **User/Model Examples**: 5 conversation pairs
- **JSON Schemas**: 2 complete OpenAPI specifications (600+ lines)
- **Quick-Start Prompts**: 6 pre-written queries

#### Visual Documentation
- **10 Screenshots** strategically placed at decision points
- **Filename Convention**: Descriptive kebab-case (e.g., `save-button.png`)
- **Resolution**: High-quality PNGs for clarity
- **Context**: Each image shows surrounding UI for orientation
- **Recent Additions**: 
  - `add-example.png`: Shows the "Add example" button location in the UI
  - `formulary-guard.png`: Displays the guardrails dropdown selection interface

---

## 🚀 Improvement Roadmap

### Phase 1: Enhanced User Experience (Priority: High)
- [ ] **Progress Tracking System**
  - Session-persistent checkbox states
  - Visual progress bar
  - Time estimates per section
- [ ] **Interactive Navigation**
  - Sticky table of contents
  - Smooth scroll to sections
  - Breadcrumb navigation
- [ ] **Enhanced Visual Feedback**
  - Success animations for copy actions
  - Loading states during content fetch
  - Hover effects on interactive elements

### Phase 2: Content Enhancements (Priority: High)
- [ ] **Glossary System**
  - Tooltip definitions for technical terms
  - Expandable glossary sidebar
  - Context-sensitive help
- [ ] **Print Optimization**
  - Print-friendly stylesheet
  - PDF export functionality
  - QR codes for mobile access

### Phase 3: Advanced Features (Priority: Medium)
- [ ] **Search Functionality**
  - Full-text search across instructions
  - Keyword highlighting
  - Search suggestions
- [ ] **Offline Capability**
  - Service worker implementation
  - Local storage for progress
  - Offline-first architecture

---

## 💻 Development Guidelines

### Code Standards

#### TypeScript Configuration
```typescript
// Strict type checking enabled
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Component Patterns
```typescript
// Functional components with explicit typing
export default function ComponentName(): JSX.Element {
  const [state, setState] = useState<Type>(initialValue);
  // Component logic
  return <jsx />;
}
```

#### CSS Architecture
- **Methodology**: CSS Custom Properties for theming
- **Organization**: Global tokens → Component styles → Utilities
- **Naming**: Kebab-case for classes, semantic variable names
- **Performance**: Critical CSS inlined, non-critical deferred

### Development Workflow
1. **Local Development**: `npm install && npm run dev`
2. **Type Checking**: Automatic via TypeScript in IDE
3. **Linting**: `npm run lint` before commits
4. **Building**: `npm run build` for production
5. **Testing**: Manual testing focus on accessibility

### Git Workflow
- **Branch Strategy**: Feature branches from main
- **Commit Convention**: Conventional commits (feat/fix/docs)
- **PR Requirements**: Description, screenshots, testing notes
- **Code Review**: Focus on accessibility and UX

---

## 🧪 Testing Considerations

### Browser Compatibility Matrix
| Browser | Minimum Version | Priority |
|---------|----------------|----------|
| Chrome | 90+ | High |
| Safari | 14+ | High |
| Edge | 90+ | Medium |
| Firefox | 88+ | Medium |
| Safari iOS | 14+ | High |

### Performance Targets
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Total Bundle Size**: < 200KB gzipped
- **Lighthouse Score**: > 90 across all categories

---

## 🚢 Deployment Information

### Current Hosting Setup
- **Platform**: AWS Amplify Hosting
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Node Version**: 18.x LTS

### Environment Variables
```bash
# Currently none required
# Future AWS configuration will go here
```

### Build Process
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Deployment Checklist
- [ ] Run `npm run lint` - no warnings
- [ ] Run `npm run build` - successful build
- [ ] Test in production mode: `npm run preview`
- [ ] Verify all images load correctly
- [ ] Test copy buttons functionality
- [ ] Validate responsive design

---

## 📌 Quick Reference Guide

### Common Development Tasks

#### Adding New Instructions
1. Edit `/public/index.md`
2. Add screenshots to `/public/images/`
3. Reference images with `/images/filename.png`
4. Test locally with `npm run dev`

#### Updating Styles
1. Global design tokens: `/src/index.css` (CSS variables)
2. Component styles: `/src/App.css` (minimal usage)
3. Dark mode: Media query in `/src/index.css`

#### Adding Code Examples
```markdown
```language
// Code here - will get syntax highlighting and copy button
```
```

#### Creating Collapsible Sections
```html
<details>
<summary>Click to expand</summary>

Content here...

</details>
```

### File Locations Quick Reference
- **Main content**: `/public/index.md`
- **Screenshots**: `/public/images/`
- **Knowledge bases**: `/public/kb/`
- **React app**: `/src/App.tsx`
- **Global styles**: `/src/index.css`
- **Build output**: `/dist/`
- **AWS config**: `/amplify/`

### Important URLs and Endpoints
- **Development**: http://localhost:5173
- **SageMaker Unified**: https://dzd_bv47inn29chvps.sagemaker.us-west-2.on.aws/home
- **Mock API Gateway**: https://t1ba96kty9.execute-api.us-west-2.amazonaws.com/prod
- **API Key**: `7R0ltfmKbL7i8Pj5JJbc2a5lgatIBYMr2B5lCxRi`

### NPM Scripts Reference
```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run preview  # Preview production build
npm run lint     # Run ESLint checks
```

---

## 📝 Notes for UI/UX Improvements

### Immediate Improvements Needed
1. **Visual Hierarchy**: Stronger differentiation between major sections
2. **Interactive Feedback**: Better visual responses to user actions
3. **Mobile Experience**: Optimized touch interactions and layout
4. **Loading States**: Skeleton screens during content load
5. **Error Handling**: Graceful fallbacks for network issues

### Design System Expansion
- **Component Library**: Standardized buttons, cards, forms
- **Icon System**: Consistent iconography throughout
- **Animation Library**: Micro-interactions and transitions
- **Color Palette**: Extended palette for status indicators
- **Typography Scale**: More granular heading levels

### User Journey Optimization
- **Onboarding Flow**: Welcome screen with overview
- **Progress Persistence**: Save and resume capability
- **Help System**: Contextual help and troubleshooting
- **Success Confirmation**: Clear completion indicators
- **Next Steps**: Guidance after tutorial completion

---

## 🆘 Support and Maintenance

### Known Issues
- Copy buttons may not appear immediately in Firefox
- Dark mode code blocks need contrast improvement
- Large JSON schemas can cause horizontal scroll on mobile

### Maintenance Tasks
- Regular screenshot updates as SageMaker UI evolves
- Dependency updates monthly via npm audit
- Content review quarterly for accuracy
- Accessibility audit bi-annually

### Contact and Resources
- **Repository**: Internal GitHub/GitLab location
- **Documentation**: This file (CLAUDE.md)
- **Issues**: Track in project management system

---

*Last Updated: September 2024*
*Version: 1.0.1*
*Status: Active Development*
*Recent Updates: Added documentation for new screenshot images (add-example.png, formulary-guard.png)*