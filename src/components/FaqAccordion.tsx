import { useEffect, useRef, useState, type ReactNode } from "react";

export interface FaqItem {
  q: string;
  a: ReactNode;
}

function Item({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // anima a altura (o template usa slideToggle do jQuery)
  useEffect(() => {
    setHeight(open && ref.current ? ref.current.scrollHeight : 0);
  }, [open]);

  return (
    <div className={open ? "accordion-single active" : "accordion-single"}>
      <h5 className="header-area" onClick={onToggle}>
        <button className="accordion-btn d-flex align-items-center d-flex position-relative w-100" type="button" aria-expanded={open}>
          {item.q}
        </button>
      </h5>
      <div
        ref={ref}
        className="content-area"
        inert={!open}
        style={{ display: "block", height, overflow: "hidden", paddingTop: 0, transition: "height 0.4s ease" }}
      >
        <div className="content-body" style={{ paddingTop: 18 }}>
          {item.a}
        </div>
      </div>
    </div>
  );
}

/** Acordeão do template (`.tab-faq.faq`), com a mesma marcação e classes. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="tab-faq faq">
      <div className="accordion-section d-grid gap-xxl-4 gap-lg-3 gap-2">
        {items.map((item, i) => (
          <Item key={item.q} item={item} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
        ))}
      </div>
    </div>
  );
}
