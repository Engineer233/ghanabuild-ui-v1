# Ghanabuild.AI UI v1

This is a sample README file for the project.

## PostCSS Configuration and ES Module Compatibility

This project uses ES module syntax with Node.js 20.x and `"type": "module"` in package.json. The PostCSS configuration has been optimized for this setup.

### Current Configuration
- `postcss.config.js`: Uses ES module syntax (`export default`)
- `package.json`: Contains `"type": "module"` for ES module support
- TailwindCSS v4 with `@tailwindcss/postcss` plugin

### Fallback Strategy for CommonJS

If you encounter ES module compatibility issues and need to revert to CommonJS:

1. **Option 1: Use .cjs extension (Recommended)**
   ```bash
   # Rename the PostCSS config file
   mv postcss.config.js postcss.config.cjs
   ```
   
   Then update `postcss.config.cjs` to use CommonJS syntax:
   ```javascript
   const tailwindcss = require('@tailwindcss/postcss');
   const autoprefixer = require('autoprefixer');
   
   module.exports = {
     plugins: [
       tailwindcss,
       autoprefixer,
     ],
   };
   ```

2. **Option 2: Remove "type": "module" from package.json**
   ```json
   {
     "name": "ghanabuild-ui-v1",
     "version": "1.0.0",
     "private": true,
     // Remove this line: "type": "module",
     ...
   }
   ```
   
   Then update all config files to use CommonJS syntax.

### Build Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

### Troubleshooting
- If you see "ReferenceError: module is not defined", ensure you're using ES module syntax with `"type": "module"`
- If PostCSS fails to load plugins, verify that `@tailwindcss/postcss` and `autoprefixer` are installed
- For TailwindCSS v4, use `@tailwindcss/postcss` instead of the direct `tailwindcss` package in PostCSS config