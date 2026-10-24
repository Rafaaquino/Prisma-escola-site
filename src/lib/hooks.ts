import { useEffect } from "react";
import { useLocation } from "react-router";
import { applyConsent, getConsent, trackPageView } from "./tracking";

/**
 * Substitui o WOW.js do template, com o mesmo comportamento: todo elemento `.wow` fica oculto e entra com a animação
 * do animate.css (classe + data-wow-delay) quando aparece na tela — inclusive os que já estão visíveis ao carregar.
 * Sem JavaScript, tudo fica visível (o HTML pré-renderizado não esconde nada); com "reduzir movimento" ligado, não anima.
 */
export function useWow() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(".wow"));
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.visibility = "";
          el.style.animationName = "";
          el.classList.add("animated");
          io.unobserve(el);
        }
      },
      // sem margem negativa: o WOW original revela assim que o elemento aparece (uma margem esconderia, para sempre, o que fica no fim da página)
      { threshold: 0 },
    );

    for (const el of targets) {
      el.style.visibility = "hidden";
      el.style.animationName = "none";
      const delay = el.dataset.wowDelay;
      if (delay && /^\d*\.?\d+m?s$/.test(delay)) el.style.animationDelay = delay;
      io.observe(el);
    }
    return () => io.disconnect();
  }, [pathname]);
}

/** Substitui o `.sticky` do main.js do template: classe aplicada quando a página passa de 250px de rolagem. */
export function useStickyHeader(offset = 250) {
  return useScrolledPast(offset);
}

import { useState } from "react";

function useScrolledPast(offset: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return past;
}

/** Liga as ferramentas já permitidas pelo visitante e registra a página a cada navegação (sem consentimento, não faz nada). */
export function useTracking() {
  const { pathname } = useLocation();
  useEffect(() => {
    const consent = getConsent();
    if (!consent) return;
    applyConsent(consent);
    trackPageView(window.location.pathname);
  }, [pathname]);
}
