import { useEffect, useState } from "react";
import { Img } from "./Img";

/** Preloader do template (mesmo HTML/CSS): some 1s depois do `load`, como no main.js original. */
export function Preloader() {
  const [phase, setPhase] = useState<"on" | "out" | "gone">("on");

  useEffect(() => {
    const timers: number[] = [];
    const hide = () => {
      timers.push(
        window.setTimeout(() => {
          setPhase("out");
          timers.push(window.setTimeout(() => setPhase("gone"), 400));
        }, 1000),
      );
    };

    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });

    return () => {
      window.removeEventListener("load", hide);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (phase === "gone") return null;
  return (
    <div id="preloader" className={phase === "out" ? "preloader is-out" : "preloader"} aria-hidden="true">
      <span></span>
      <span></span>
      <span className="man-pre">
        <Img src="logo/logo.webp" alt="" width={110} height={110} loading="eager" />
      </span>
    </div>
  );
}
