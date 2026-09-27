import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import ArticlePage from "./ArticlePage";
import SubscribePage from "./SubscribePage";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import {
  LearningBlogPage,
  PartitionedCachePage,
  ProjectDetailPage,
  ProfessionalHomePage,
  ResumePage,
  SystemsBasicsPage,
} from "./PortfolioPages";
import "./styles.css";

const validRoutes = new Set([
  "/",
  "/notes/systems-basics",
  "/blog",
  "/resume",
  "/subscribe",
  "/writing/hidden-human",
  "/writing/partitioned-cache",
  "/projects/selfcheckgpt",
]);

const getRoute = () => {
  if (window.location.hash === "#/writing/hidden-human") return "/writing/hidden-human";
  if (window.location.hash === "#/subscribe") return "/subscribe";
  if (["/research", "/about"].includes(window.location.pathname)) return "/";
  if (["/projects", "/notes", "/explorations", "/articles"].includes(window.location.pathname)) return "/blog";
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
    "/": <ProfessionalHomePage onNavigate={navigate} />,
    "/projects/selfcheckgpt": <ProjectDetailPage onNavigate={navigate} />,
    "/notes/systems-basics": <SystemsBasicsPage onNavigate={navigate} />,
    "/writing/partitioned-cache": <PartitionedCachePage onNavigate={navigate} />,
    "/blog": <LearningBlogPage onNavigate={navigate} onArticle={openArticle} />,
    "/resume": <ResumePage />,
  };

  return (
    <div className="site-shell">
      <SiteHeader route={route} onNavigate={navigate} onSubscribe={openSubscribe} />
      {route === "/writing/hidden-human" ? (
        <ArticlePage onBack={() => navigate("/blog")} />
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
