# Manual Component Installation

Run these commands one by one in your terminal (where you are in the `Moltbook GUI` folder).
This is useful if the main install command gets stuck.

## 1. Core Framework (React)
```powershell
npm install react
npm install react-dom
```

## 2. Build Tools (Vite)
```powershell
npm install -D vite
npm install -D @vitejs/plugin-react
```

## 3. Styling (Tailwind CSS)
```powershell
npm install -D tailwindcss
npm install -D postcss
npm install -D autoprefixer
```

## 4. UI Libraries
```powershell
npm install lucide-react
npm install date-fns
```

## 5. Development Tools (Linting & Types)
```powershell
npm install -D eslint
npm install -D eslint-plugin-react
npm install -D eslint-plugin-react-hooks
npm install -D eslint-plugin-react-refresh
npm install -D @types/react
npm install -D @types/react-dom
```

## 6. Start the App!
Once all those are done:
```powershell
npm run dev
```
