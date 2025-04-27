import { createRoot } from 'react-dom/client'
import { ProductsProvider } from './lib/contexts/ProductsContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <ProductsProvider>
    <App />
  </ProductsProvider>
);
