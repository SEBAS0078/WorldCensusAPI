import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from "react-router"
import Layout from './routes/layout'
import NotFound from "./routes/NotFound";
import DetailedView from "./routes/DetailedView";

createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<App />} />
        <Route path="/country/:code" element={<DetailedView />} />
        <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
)
