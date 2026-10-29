import { createBrowserRouter } from "react-router";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import MemoListPage from "./pages/MemoListPage";
import MemoDetailEditPage from "./pages/MemoDetailEditPage";
import SettingsPage from "./pages/SettingsPage";
import CodeMasterPage from "./pages/CodeMasterPage";
import CommonSettingsPage from "./pages/CommonSettingsPage";
import SystemSettingsPage from "./pages/SystemSettingsPage";

const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: MemoListPage },
      { path: "memo/new", Component: MemoDetailEditPage },
      { path: "memo/:memoId", Component: MemoDetailEditPage },
      { path: "memo/:memoId/edit", Component: MemoDetailEditPage },
      { path: "settings", Component: SettingsPage },
      { path: "code-masters", Component: CodeMasterPage },
      { path: "common-settings", Component: CommonSettingsPage },
      { path: "systems", Component: SystemSettingsPage }
    ]
  }
]);

export default router;
