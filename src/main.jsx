import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import ArticlePage from "./ArticlePage";
import SubscribePage from "./SubscribePage";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import {
  AboutPage,
  HomePage,
  NotesPage,
  ProjectDetailPage,
  ProjectsPage,
  ResearchPage,
  ResumePage,
  WritingPage,
} from "./PortfolioPages";
import "./styles.css";

const validRoutes = new Set([
  "/",
  "/research",
  "/projects",
  "/notes",
  "/articles",
  "/resume",
  "/about",
  "/subscribe",
  "/writing/hidden-human",
  "/projects/selfcheckgpt",
]);

const getRoute = () => {
  if (window.location.hash === "#/writing/hidden-human") return "/writing/hidden-human";
  if (window.location.hash === "#/subscribe") return "/subscribe";
  if (window.location.pathname === "/explorations") return "/notes";
  return validRoutes.has(window.location.pathname) ? window.location.pathname : "/";
};

function App() {
  const [route, setRoute] = useState(getRoute);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  useEffect(() => {
    const syncRoute = () => {
      setRoute(getRoute());
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    };
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  const openSubscribe = () => {
    if (route === "/subscribe") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/subscribe");
    }
  };
  const openArticle = () => navigate("/writing/hidden-human");

  const pages = {
    "/": <HomePage onNavigate={navigate} onArticle={openArticle} />,
    "/research": <ResearchPage onNavigate={navigate} />,
    "/projects": <ProjectsPage onNavigate={navigate} />,
    "/projects/selfcheckgpt": <ProjectDetailPage />,
    "/notes": <NotesPage onNavigate={navigate} />,
    "/articles": <WritingPage onArticle={openArticle} />,
    "/resume": <ResumePage />,
    "/about": <AboutPage />,
  };

  return (
    <div className="site-shell">
      <SiteHeader route={route} onNavigate={navigate} onSubscribe={openSubscribe} />
      {route === "/writing/hidden-human" ? (
        <ArticlePage onBack={() => navigate("/articles")} />
      ) : route === "/subscribe" ? (
        <SubscribePage onBack={() => navigate("/")} />
      ) : (
        pages[route] || pages["/"]
      )}
      <SiteFooter onNavigate={navigate} onSubscribe={openSubscribe} onArticle={openArticle} />
      <Analytics />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
