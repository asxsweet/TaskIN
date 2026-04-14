/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import WorkDetail from "./pages/WorkDetail";
import Upload from "./pages/Upload";
import MyWorks from "./pages/MyWorks";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/work/:id" element={<WorkDetail />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/my-works" element={<MyWorks />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
