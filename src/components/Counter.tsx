import { useEffect, useRef } from "react";

const fmt = (n: number) => n.toLocaleString("pt-BR");

/**
 * Substitui o jquery.counterup do template: conta de 0 até `end` quando entra na tela.
 * O HTML pré-renderizado já traz o número final (bom para SEO e para quem não tem JavaScript).
 */
export function Counter({ end }: { end: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 2500;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = fmt(Math.round(end * (1 - (1 - p) ** 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        el.textContent = "0";
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end]);

  return (
    <span className="count" ref={ref}>
      {fmt(end)}
    </span>
  );
}
