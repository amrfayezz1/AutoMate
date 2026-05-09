// AutoMate phone shell — 402x874 iPhone artboard, status bar + home indicator
// + floating nav. Children render in the content area between status bar (54)
// and the bottom safe area.

const { useState } = React;

function PhoneFrame({ children, navTab, onNav, screenLabel }) {
  return (
    <div data-screen-label={screenLabel} style={{
      position:'relative', width:402, height:874, background:AM.c.bg,
      borderRadius:48, overflow:'hidden', fontFamily:AM.font, color:AM.c.fg1,
      boxShadow:'0 30px 80px rgba(0,0,0,0.5)',
    }}>
      <StatusBar/>
      <div style={{ position:'absolute', inset:'54px 0 53px 0', overflow:'auto' }}>
        {children}
      </div>
      {navTab && <NavBar active={navTab} onNav={onNav}/>}
      <HomeIndicator/>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{
      position:'absolute', left:0, top:0, width:'100%', height:54,
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'14px 32px 0', color:'#fff', fontWeight:500, fontSize:15,
    }}>
      <span style={{ fontVariantNumeric:'tabular-nums' }}>9:41</span>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <span style={{ fontSize:13 }}>●●●●</span>
        <span style={{ fontSize:11 }}>WiFi</span>
        <span style={{
          display:'inline-block', width:24, height:11, border:'1.5px solid #fff',
          borderRadius:3, position:'relative',
        }}>
          <span style={{ position:'absolute', inset:1, background:'#fff', borderRadius:1 }}/>
        </span>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div style={{
      position:'absolute', left:'50%', bottom:8, transform:'translateX(-50%)',
      width:134, height:5, borderRadius:9999, background:'rgba(110,120,134,0.8)',
    }}/>
  );
}

const NAV_TABS = [
  { key:'home', icon:'house', label:'Home' },
  { key:'maint', icon:'route', label:'Maintenance' },
  { key:'remind', icon:'calendar', label:'Reminders' },
  { key:'settings', icon:'settings', label:'Settings' },
];

function NavBar({ active, onNav }) {
  return (
    <div style={{
      position:'absolute', left:'50%', bottom:32, transform:'translateX(-50%)',
      width:369, height:67, borderRadius:9999, background:AM.c.nav,
      backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
      boxShadow:'0 0 15px rgba(0,0,0,0.5)',
      display:'flex', justifyContent:'space-between', padding:'12px 24px',
      alignItems:'center', zIndex:10,
    }}>
      {NAV_TABS.map(t => {
        const on = t.key === active;
        return (
          <button key={t.key} onClick={()=>onNav?.(t.key)} style={{
            background:'none', border:0, padding:0, cursor:'pointer',
            display:'flex', flexDirection:'column', alignItems:'center', gap:4,
            width:50, color: on ? AM.c.brand : AM.c.fgMuted, fontFamily:AM.font,
          }}>
            <Icon name={t.icon} size={24} color={on ? AM.c.brand : AM.c.fgMuted} stroke={on?2.5:2}/>
            <span style={{
              fontSize:12, fontWeight:500, lineHeight:1,
              color: on ? AM.c.fg1 : AM.c.fg2,
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

window.PhoneFrame = PhoneFrame;
