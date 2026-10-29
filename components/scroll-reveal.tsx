"use client";

import { useEffect } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const STAGGER_MS = 90;

// Scroll-in animations:
//   .reveal        the element fades and rises in when it enters the viewport
//   .reveal-group  its direct children do the same, one after another
//
// This can run while parts of the page are still hydrating, so it never
// touches attributes React owns. Off-screen targets are held invisible with
// a Web Animation; when they scroll in, the hold is cancelled and an entrance
// animation plays with `fill: "backwards"`, leaving no inline styles behind,
// so hover transforms and transitions keep working. Without JavaScript,
// nothing is hidden.
export default function ScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const holds = new Map<Element, Animation[]>();

    const targetsOf = (el: Element) =>
      el.classList.contains("reveal-group") ? Array.from(el.children) : [el];

    const hold = (el: Element) =>
      holds.set(
        el,
        targetsOf(el).map((t) => t.animate([{ opacity: 0 }], { duration: 1, fill: "forwards" })),
      );

    const show = (el: Element) => {
      holds.get(el)?.forEach((a) => a.cancel());
      holds.delete(el);
      targetsOf(el).forEach((t, i) =>
        t.animate(
          [
            {
              opacity: 0,
              transform: reduce ? "none" : "translateY(28px) scale(0.98)",
              filter: reduce ? "none" : "blur(4px)",
            },
            { opacity: 1, transform: "none", filter: "none" },
          ],
          {
            duration: reduce ? 200 : 850,
            delay: reduce ? 0 : i * STAGGER_MS,
            easing: EASE,
            fill: "backwards",
          },
        ),
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    document.querySelectorAll(".reveal, .reveal-group").forEach((el) => {
      // Anything already on screen stays as it is, without a flash.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      hold(el);
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      holds.forEach((anims) => anims.forEach((a) => a.cancel()));
    };
  }, []);

  return null;
}
