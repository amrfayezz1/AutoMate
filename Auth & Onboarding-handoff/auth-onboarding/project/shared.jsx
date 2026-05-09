/* AutoMate — shared primitives for all flow screens.
   Imported globally; assigns to window so other Babel files can use them.
*/

const { useState, useRef, useEffect } = React;

/* ───────────── frame chrome ───────────── */

const screenStyle = {
  position:'relative',
  width:402, height:874,
  background:'var(--bg)',
  color:'var(--text)',
  overflow:'hidden',
  fontFamily:'Montserrat, system-ui, sans-serif',
};

function StatusBar({ light = true }){
  const c = light ? '#fff' : '#111';
  return (
    <div style={{position:'absolute',inset:'0 0 auto 0',height:54,zIndex:5,
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'18px 32px 0',color:c,fontSize:15,fontWeight:600,letterSpacing:0.2,
      pointerEvents:'none'}}>
      <span>9:41</span>
      <span style={{display:'flex',gap:6,alignItems:'center'}}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          {[2,5,8,11].map((h,i)=>(
            <rect key={i} x={i*4} y={11-h} width="3" height={h} rx="0.7" fill={c}/>
          ))}
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 10.4l1.7-2c-.5-.4-1.1-.6-1.7-.6s-1.2.2-1.7.6l1.7 2zM10.6 6.7l1.7-2c-1.3-1.1-3-1.7-4.8-1.7s-3.5.6-4.8 1.7l1.7 2c.9-.7 2-1.1 3.1-1.1s2.2.4 3.1 1.1zM13.7 3.1l1.7-2C13.2.4 10.5-.5 7.5-.5S1.8.4-.4 1.1l1.7 2c1.7-1 3.8-1.6 6.2-1.6s4.5.6 6.2 1.6z" fill={c}/>
        </svg>
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={c} opacity="0.4"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill={c}/>
          <rect x="24" y="4" width="2" height="4" rx="1" fill={c} opacity="0.4"/>
        </svg>
      </span>
    </div>
  );
}

function HomeIndicator(){
  return (
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:21,
      display:'flex',alignItems:'flex-end',justifyContent:'center',paddingBottom:8,
      pointerEvents:'none',zIndex:5}}>
      <div style={{width:139,height:5,borderRadius:3,background:'rgb(110,120,134)'}}/>
    </div>
  );
}

/* ───────────── brand ───────────── */

function Logo({ size = 56, glow = true }){
  return (
    <div style={{width:size, height:size, position:'relative',
      borderRadius:size*0.32,
      background:'linear-gradient(140deg, rgb(58,134,255) 0%, rgb(76,156,255) 60%, rgb(46,108,220) 100%)',
      display:'grid', placeItems:'center',
      boxShadow: glow ? '0 14px 40px -10px rgba(58,134,255,0.55), inset 0 1px 0 rgba(255,255,255,0.18)' : 'inset 0 1px 0 rgba(255,255,255,0.18)',
    }}>
      <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none">
        <path d="M5 19 L12 4 L19 19" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.3 13 L15.7 13" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
        <circle cx="12" cy="20.6" r="1.2" fill="white"/>
      </svg>
    </div>
  );
}

function Wordmark({ size = 28 }){
  return (
    <div style={{display:'flex', alignItems:'baseline', gap:0,
      fontSize:size, fontWeight:700, letterSpacing:-0.6, color:'var(--text)'}}>
      <span>Auto</span>
      <span style={{color:'var(--primary)'}}>Mate</span>
    </div>
  );
}

/* ───────────── controls ───────────── */

function PrimaryButton({ children, onClick, style, disabled }){
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:'100%', height:56, border:'none',
      cursor: disabled?'not-allowed':'pointer',
      borderRadius:16, background:'var(--primary)', color:'var(--text)',
      fontFamily:'inherit', fontSize:16, fontWeight:600, letterSpacing:0.1,
      boxShadow:'0 14px 30px -10px rgba(58,134,255,0.55)',
      opacity: disabled ? 0.45 : 1,
      ...style,
    }}>{children}</button>
  );
}

function GhostButton({ children, onClick, style }){
  return (
    <button onClick={onClick} style={{
      width:'100%', height:56, cursor:'pointer',
      borderRadius:16, background:'transparent',
      border:'1px solid rgba(176,182,195,0.18)',
      color:'var(--text)', fontFamily:'inherit', fontSize:16, fontWeight:500,
      ...style,
    }}>{children}</button>
  );
}

function Field({ label, value, onChange, type='text', icon, trailing, autoFocus, placeholder, hint, error }){
  const [focus, setFocus] = useState(false);
  return (
    <label style={{display:'block'}}>
      <div style={{fontSize:12, color:'var(--text-2)', fontWeight:500, marginBottom:8, letterSpacing:0.3, textTransform:'uppercase'}}>{label}</div>
      <div style={{
        position:'relative', height:56, borderRadius:14,
        background:'var(--surface)',
        border: `1px solid ${error?'var(--danger)': focus ? 'var(--primary)' : 'rgba(176,182,195,0.10)'}`,
        boxShadow: focus && !error ? '0 0 0 4px rgba(58,134,255,0.12)' : 'none',
        transition:'all .15s ease',
        display:'flex', alignItems:'center', padding:'0 14px',
      }}>
        {icon && <span style={{display:'flex', marginRight:10, color:focus?'var(--primary)':'var(--text-2)'}}>{icon}</span>}
        <input
          autoFocus={autoFocus}
          type={type} value={value} onChange={e=>onChange(e.target.value)}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          placeholder={placeholder}
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            color:'var(--text)', fontFamily:'inherit', fontSize:15, fontWeight:500,
          }}
        />
        {trailing}
      </div>
      {(hint || error) && (
        <div style={{fontSize:12, marginTop:6, color: error?'var(--danger)':'var(--text-2)', fontWeight:500}}>
          {error || hint}
        </div>
      )}
    </label>
  );
}

function BackButton({ onClick }){
  return (
    <button onClick={onClick} style={{
      width:44, height:44, borderRadius:14,
      background:'var(--surface)', border:'1px solid rgba(176,182,195,0.10)',
      color:'var(--text)', cursor:'pointer',
      display:'grid', placeItems:'center',
    }}>{I.back}</button>
  );
}

function CheckBox({ checked, onChange, size=20 }){
  return (
    <span onClick={onChange} style={{
      width:size, height:size, borderRadius:6, flex:'none',
      background: checked ? 'var(--primary)' : 'transparent',
      border: `1.5px solid ${checked ? 'var(--primary)' : 'rgba(176,182,195,0.3)'}`,
      display:'grid', placeItems:'center', color:'white', cursor:'pointer',
      transition:'all .12s ease',
    }}>{checked && I.check}</span>
  );
}

function Radio({ checked, onChange, size=20 }){
  return (
    <span onClick={onChange} style={{
      width:size, height:size, borderRadius:'50%', flex:'none',
      background:'transparent',
      border: `1.5px solid ${checked ? 'var(--primary)' : 'rgba(176,182,195,0.3)'}`,
      display:'grid', placeItems:'center', cursor:'pointer',
      transition:'all .12s ease',
    }}>
      {checked && <span style={{width:size*0.5, height:size*0.5, borderRadius:'50%', background:'var(--primary)'}}/>}
    </span>
  );
}

function Stepper({ step, total }){
  return (
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{
          height:4, borderRadius:99,
          width: i===step ? 28 : 18,
          background: i<=step ? 'var(--primary)' : 'rgba(176,182,195,0.18)',
          transition:'all .25s ease',
        }}/>
      ))}
    </div>
  );
}

/* ───────────── icons ───────────── */

const I = {
  mail:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  lock:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6"/></svg>,
  user:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M4.5 20c.8-3.7 4-6 7.5-6s6.7 2.3 7.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  eye:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6"/></svg>,
  eyeOff:<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9 5.6c1-.4 2-.6 3-.6 6 0 9.5 7 9.5 7-.5 1-1.3 2.2-2.4 3.3M6.4 6.5C4 8.2 2.5 11 2.5 11s3.5 7 9.5 7c1.4 0 2.7-.4 3.8-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  back:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14.5 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  car:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 17h14M5 17v2M19 17v2M5 17l1.4-5.5a2 2 0 012-1.5h7.2a2 2 0 011.9 1.5L17 17M3 17h18M7 14h2M15 14h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  hash:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  gauge: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 14a8 8 0 1116 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 14l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="14" r="1.5" fill="currentColor"/></svg>,
  cal:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  drop:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3.5s6.5 7.5 6.5 12a6.5 6.5 0 11-13 0c0-4.5 6.5-12 6.5-12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  tire:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  brake: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/><path d="M12 4l1.5 4M12 20l-1.5-4M4 12l4-1.5M20 12l-4 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  filter:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 6h14l-5 7v6l-4-2v-4L5 6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  battery:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/><rect x="20" y="10" width="2" height="4" rx="1" fill="currentColor"/><path d="M7 10l3 4M10 10v4M13 10l3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  bell:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 16V11a6 6 0 1112 0v5l1.5 2.5h-15L6 16z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  spark: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>,
};

/* ───────────── exports ───────────── */

Object.assign(window, {
  screenStyle, StatusBar, HomeIndicator,
  Logo, Wordmark,
  PrimaryButton, GhostButton, Field, BackButton, CheckBox, Radio, Stepper,
  I,
});
