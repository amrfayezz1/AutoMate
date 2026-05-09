// Atomic primitives — Icon, Backplate, Pill, Card.
// Lucide icons via window.lucide.createIcons() called once on mount.

const { useEffect, useRef } = React;

function Icon({ name, size = 24, color, stroke = 2.25, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ icons: window.lucide.icons, attrs: { 'stroke-width': stroke } });
    }
  }, [name, stroke]);
  return <span ref={ref} style={{ display:'inline-flex', width:size, height:size, color, ...style }} />;
}

function Backplate({ tone = 'brand', size = 36, children }) {
  const map = {
    brand: AM.c.brand30, warn: AM.c.warn30, danger: AM.c.danger30,
    success: AM.c.success30, neutral: AM.c.s4,
    'brand-solid': AM.c.brand,
  };
  const fg = {
    brand: AM.c.brand, warn: AM.c.warn, danger: AM.c.danger,
    success: AM.c.success, neutral: AM.c.fg3, 'brand-solid': '#fff',
  };
  return (
    <span style={{
      width:size, height:size, borderRadius:9999, background:map[tone],
      display:'grid', placeItems:'center', color:fg[tone], flex:'none',
    }}>{children}</span>
  );
}

function Pill({ tone = 'warn', children }) {
  const m = {
    warn:{ bg:AM.c.warn20, fg:AM.c.warn },
    danger:{ bg:AM.c.danger20, fg:AM.c.danger },
    success:{ bg:AM.c.success20, fg:AM.c.success },
    brand:{ bg:AM.c.brand20, fg:AM.c.brand },
  }[tone];
  return (
    <span style={{
      padding:'4px 12px', borderRadius:9999, background:m.bg, color:m.fg,
      fontSize:12, fontWeight:500, lineHeight:'16px',
    }}>{children}</span>
  );
}

function Card({ children, tone = 'basic', style, onClick }) {
  const variants = {
    basic:    { background: AM.c.s2 },
    input:    { background: AM.c.s1 },
    alert:    { background: AM.c.warn20, border: `1.5px solid ${AM.c.warn}` },
    danger:   { background: AM.c.danger20, border: `1.5px solid ${AM.c.danger}` },
    selected: { background: AM.c.brand20, border: `1px solid ${AM.c.brand}` },
  }[tone];
  return (
    <div onClick={onClick} style={{
      borderRadius:16, padding:16, ...variants, cursor:onClick?'pointer':'default',
      transition:'opacity 100ms ease',
    }}
    onMouseDown={e=>e.currentTarget.style.opacity=0.95}
    onMouseUp={e=>e.currentTarget.style.opacity=1}
    onMouseLeave={e=>e.currentTarget.style.opacity=1}
    >{children}</div>
  );
}

window.Icon = Icon; window.Backplate = Backplate; window.Pill = Pill; window.Card = Card;
