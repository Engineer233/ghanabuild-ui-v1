# Ghanabuild.AI - Advanced House Cost Estimator

> ⚠️ **PRODUCTION INCIDENT RESOLVED** ⚠️  
> **Previous Issue:** The production website was displaying only a static screenshot ([reference image](docs/site-not-ready.png)) instead of the interactive application.  
> **Status:** ✅ **RESOLVED** - The site is now fully functional and production-ready.  
> **Details:** See [QA Incident Resolution Report](docs/QA-incident-resolution-report.md) for complete investigation and resolution documentation.

---

## About

Ghanabuild.AI is an advanced React-based application that provides accurate cost estimation for construction projects in Ghana. The application features an interactive form that collects project details and provides real-time cost calculations.

## Features

- Interactive project details form with validation
- Real-time cost estimation for construction projects
- Responsive design for desktop and mobile devices
- Error handling and user feedback
- Professional UI with Tailwind CSS styling

## Technology Stack

- **Frontend:** React 18 with Vite
- **Styling:** Tailwind CSS (CDN)
- **Animation:** Framer Motion
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 20.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Engineer233/ghanabuild-ui-v1.git
cd ghanabuild-ui-v1
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the application.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── App.jsx      # Main application component
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles
├── docs/            # Documentation
│   ├── QA-incident-resolution-report.md
│   └── site-not-ready.png
├── package.json     # Dependencies and scripts
├── vite.config.js   # Vite configuration
└── vercel.json      # Deployment configuration
```

## Quality Assurance

This project follows strict quality assurance practices:

- ✅ **Build Validation:** All builds are validated before deployment
- ✅ **Error Monitoring:** Real-time application health monitoring
- ✅ **User Testing:** Comprehensive testing of user workflows
- ✅ **Incident Response:** Documented incident resolution procedures

For incident resolution procedures and quality assurance documentation, see [docs/QA-incident-resolution-report.md](docs/QA-incident-resolution-report.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
- Create an issue in this repository
- Check the [QA documentation](docs/QA-incident-resolution-report.md) for common issues
- Contact the development team

## License

This project is proprietary software. All rights reserved.

---

**Status:** 🟢 Production Ready  
**Last Updated:** 2025-01-05  
**Version:** 1.0.0