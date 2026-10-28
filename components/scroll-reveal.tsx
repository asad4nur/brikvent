"use client";

import { useEffect } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Fades every `.reveal` element up as it scrolls into view.
//
// This runs while parts of the page may still be hydrating, so it never
// touches attributes React owns (adding a class would cause a hydration
// mismatch). Instead it hides `.reveal` with an injected stylesheet and
// shows each element with the Web Animations API (`fill: "forwards"`).
// Without JavaScript nothing is hidden.
export default function ScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (el: Element, animate: boolean) =>
      el.animate(
        [
          { opacity: 0, transform: animate && !reduce ? "translateY(24px)" : "none" },
          { opacity: 1, transform: "none" },
        ],
        { duration: animate ? (reduce ? 200 : 800) : 0, easing: EASE, fill: "forwards" },
      );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target, true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      // Anything already on screen shows at once, without a flash.
      if (el.getBoundingClientRect().top < window.innerHeight) show(el, false);
      else observer.observe(el);
    });

    const style = document.createElement("style");
    style.textContent = ".reveal{opacity:0}";
    document.head.appendChild(style);

    return () => {
      observer.disconnect();
      style.remove();
    };
  }, []);

  return null;
}
