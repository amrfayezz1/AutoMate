/* AutoMate — auth screens.
   Splash, Welcome (onboarding carousel), SignIn, SignUp, ForgotPassword, VerifyEmail.
*/

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

/* ───────────────────────── 01 Splash ───────────────────────── */

function Splash(){
  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 50% 30%, rgba(58,134,255,0.22) 0%, rgba(58,134,255,0) 55%)'}}/>
      <svg style={{position:'absolute',inset:0,opacity:0.08}} width="100%" height="100%">
        <defs>
          <pattern id="grid-splash" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" stroke="white" strokeWidth="0.5" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-splash)"/>
      </svg>

      <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:28, zIndex:2}}>
        <div style={{position:'relative', width:200, height:200, display:'grid', placeItems:'center'}}>
          {[200,160,120].map((s,i)=>(
            <div key={i} style={{
              position:'absolute', width:s, height:s, borderRadius:'50%',
              border:`1px solid rgba(58,134,255,${0.12 + i*0.07})`,
            }}/>
          ))}
          <Logo size={84}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10}}>
          <Wordmark size={36}/>
          <div style={{fontSize:13, color:'var(--text-2)', letterSpacing:2, textTransform:'uppercase', fontWeight:500}}>Maintenance · Simplified</div>
        </div>
      </div>

      <div style={{position:'absolute', left:0, right:0, bottom:90,
        display:'flex', justifyContent:'center'}}>
        <div style={{width:120, height:3, borderRadius:99, background:'rgba(176,182,195,0.12)', overflow:'hidden'}}>
          <div style={{
            width:'40%', height:'100%', background:'var(--primary)', borderRadius:99,
            animation:'splashbar 1.6s ease-in-out infinite',
          }}/>
        </div>
      </div>
      <style>{`@keyframes splashbar{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
      <HomeIndicator/>
    </div>
  );
}

/* ───────────────────────── 02 Welcome carousel ───────────────────────── */

function Welcome({ initialPage = 0 }){
  const [page, setPage] = useStateA(initialPage);
  const slides = [
    {
      title:'Stay ahead of every service',
      copy:'AutoMate tracks oil, tires, brakes and more — so nothing slips past you.',
      art: <ArtMileage/>,
    },
    {
      title:'One tap to log it',
      copy:'Update mileage, log a repair, attach a receipt — in seconds.',
      art: <ArtLog/>,
    },
    {
      title:'Smart reminders',
      copy:'We do the math on intervals. You just drive.',
      art: <ArtBell/>,
    },
  ];
  const s = slides[page];
  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:'54px 0 21px 0', display:'flex', flexDirection:'column'}}>

        <div style={{flex:'0 0 380px', position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', inset:0,
            background:'radial-gradient(ellipse at 50% 60%, rgba(58,134,255,0.22) 0%, rgba(58,134,255,0) 60%)'}}/>
          <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center'}}>
            {s.art}
          </div>
          <button style={{position:'absolute', top:14, right:20,
            background:'transparent', border:'none', color:'var(--text-2)',
            fontFamily:'inherit', fontSize:14, fontWeight:500, cursor:'pointer'}}>Skip</button>
        </div>

        <div style={{flex:1, padding:'32px 28px 28px',
          display:'flex', flexDirection:'column', gap:20}}>

          <div style={{display:'flex', gap:6}}>
            {slides.map((_,i)=>(
              <div key={i} onClick={()=>setPage(i)} style={{
                cursor:'pointer',
                height:4, borderRadius:2,
                width: i===page ? 28 : 8,
                background: i===page ? 'var(--primary)' : 'rgba(176,182,195,0.20)',
                transition:'width .25s ease, background .25s ease',
              }}/>
            ))}
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:12, flex:1}}>
            <h1 style={{margin:0, fontSize:30, lineHeight:'36px', fontWeight:700, letterSpacing:-0.6, textWrap:'pretty'}}>{s.title}</h1>
            <p style={{margin:0, color:'var(--text-2)', fontSize:15, lineHeight:'22px'}}>{s.copy}</p>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <PrimaryButton onClick={()=>page<slides.length-1 ? setPage(page+1) : null}>
              <span style={{display:'inline-flex',alignItems:'center',gap:10}}>
                {page<slides.length-1 ? 'Continue' : 'Get started'}
                {I.arrow}
              </span>
            </PrimaryButton>
            <div style={{textAlign:'center', fontSize:14, color:'var(--text-2)', fontWeight:500}}>
              Already have an account? <span style={{color:'var(--primary)', fontWeight:600, cursor:'pointer'}}>Sign in</span>
            </div>
          </div>
        </div>
      </div>
      <HomeIndicator/>
    </div>
  );
}

function ArtMileage(){
  return (
    <div style={{position:'relative', width:280, height:280, display:'grid', placeItems:'center'}}>
      <svg width="280" height="280" viewBox="0 0 280 280">
        <defs>
          <linearGradient id="ring-w" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(58,134,255)"/>
            <stop offset="100%" stopColor="rgba(58,134,255,0)"/>
          </linearGradient>
        </defs>
        <circle cx="140" cy="140" r="118" stroke="rgba(176,182,195,0.10)" strokeWidth="1" fill="none"/>
        <circle cx="140" cy="140" r="92" stroke="rgba(176,182,195,0.10)" strokeWidth="1" fill="none"/>
        <circle cx="140" cy="140" r="118" stroke="url(#ring-w)" strokeWidth="6" fill="none"
          strokeDasharray="500 800" strokeLinecap="round" transform="rotate(-90 140 140)"/>
        {Array.from({length:32}).map((_,i)=>{
          const a = (i/32) * Math.PI*2;
          const r1 = 70, r2 = i%4===0 ? 82 : 78;
          const x1 = 140 + Math.cos(a)*r1, y1 = 140 + Math.sin(a)*r1;
          const x2 = 140 + Math.cos(a)*r2, y2 = 140 + Math.sin(a)*r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i<22?'rgb(58,134,255)':'rgba(176,182,195,0.25)'} strokeWidth={i%4===0?2:1}/>;
        })}
      </svg>
      <div style={{position:'absolute', textAlign:'center'}}>
        <div style={{fontSize:11, color:'var(--text-2)', letterSpacing:2, textTransform:'uppercase'}}>Mileage</div>
        <div style={{fontSize:38, fontWeight:700, letterSpacing:-0.6, marginTop:6}}>201,240</div>
        <div style={{fontSize:13, color:'var(--text-2)'}}>km · Renault Sandero</div>
      </div>
    </div>
  );
}
function ArtLog(){
  return (
    <div style={{position:'relative', width:300, height:280}}>
      {[
        {top:30,  left:30,  rot:-6, title:'Oil change', sub:'2 days ago',  color:'rgb(58,134,255)'},
        {top:90,  left:60,  rot:2,  title:'Tire rotation', sub:'1 week ago', color:'rgb(46,196,182)'},
        {top:158, left:38,  rot:-3, title:'Air filter',  sub:'Today',     color:'rgb(255,159,28)'},
      ].map((c,i)=>(
        <div key={i} style={{
          position:'absolute', top:c.top, left:c.left, width:230, height:74,
          background:'var(--surface)', borderRadius:16, padding:14,
          display:'flex', alignItems:'center', gap:12,
          transform:`rotate(${c.rot}deg)`,
          boxShadow:'0 18px 40px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(176,182,195,0.06)',
        }}>
          <div style={{width:40, height:40, borderRadius:'50%',
            background:`color-mix(in oklab, ${c.color} 24%, transparent)`,
            display:'grid', placeItems:'center', color:c.color}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{fontSize:15, fontWeight:500}}>{c.title}</div>
            <div style={{fontSize:12, color:'var(--text-2)', marginTop:2}}>{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
function ArtBell(){
  return (
    <div style={{position:'relative', width:280, height:280, display:'grid', placeItems:'center'}}>
      {[200,150,100].map((s,i)=>(
        <div key={i} style={{position:'absolute', width:s, height:s, borderRadius:'50%',
          border:'1px solid rgba(255,159,28,0.25)',
          boxShadow: i===2 ? '0 0 60px rgba(255,159,28,0.25)' : 'none'}}/>
      ))}
      <div style={{
        width:96, height:96, borderRadius:28,
        background:'linear-gradient(140deg, rgba(255,159,28,1) 0%, rgba(230,134,18,1) 100%)',
        display:'grid', placeItems:'center',
        boxShadow:'0 20px 60px -10px rgba(255,159,28,0.5)',
      }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path d="M6 16V11a6 6 0 1112 0v5l1.5 2.5h-15L6 16z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M10 20a2 2 0 004 0" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

/* ───────────────────────── 03 Sign In ───────────────────────── */

function Login(){
  const [email, setEmail] = useStateA('alex@drives.fast');
  const [pw, setPw] = useStateA('•••••••••');
  const [show, setShow] = useStateA(false);
  const [remember, setRemember] = useStateA(true);

  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'16px 24px 24px',
        display:'flex', flexDirection:'column'}}>

        <BackButton/>

        <div style={{marginTop:32, display:'flex', flexDirection:'column', gap:8}}>
          <h1 style={{margin:0, fontSize:32, fontWeight:700, letterSpacing:-0.6}}>Welcome back</h1>
          <p style={{margin:0, color:'var(--text-2)', fontSize:15, lineHeight:'22px'}}>
            Sign in to keep your garage in sync.
          </p>
        </div>

        <div style={{marginTop:32, display:'flex', flexDirection:'column', gap:18}}>
          <Field label="Email" value={email} onChange={setEmail} type="email" icon={I.mail} placeholder="you@domain.com"/>
          <Field
            label="Password" value={pw} onChange={setPw}
            type={show?'text':'password'} icon={I.lock} placeholder="••••••••"
            trailing={
              <button onClick={()=>setShow(!show)} style={{background:'transparent', border:'none', cursor:'pointer', color:'var(--text-2)', display:'flex'}}>{show? I.eyeOff : I.eye}</button>
            }
          />

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <label style={{display:'flex', gap:10, alignItems:'center', cursor:'pointer', userSelect:'none'}}>
              <CheckBox checked={remember} onChange={()=>setRemember(!remember)}/>
              <span style={{fontSize:14, color:'var(--text-2)', fontWeight:500}}>Remember me</span>
            </label>
            <span style={{fontSize:14, color:'var(--primary)', fontWeight:600, cursor:'pointer'}}>Forgot?</span>
          </div>
        </div>

        <div style={{flex:1}}/>

        <div style={{display:'flex', flexDirection:'column', gap:18}}>
          <PrimaryButton>
            <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Sign in {I.arrow}</span>
          </PrimaryButton>

          <div style={{display:'flex', alignItems:'center', gap:12, color:'var(--text-3)', fontSize:12, fontWeight:500, letterSpacing:1, textTransform:'uppercase'}}>
            <div style={{flex:1, height:1, background:'rgba(176,182,195,0.10)'}}/>
            or continue with
            <div style={{flex:1, height:1, background:'rgba(176,182,195,0.10)'}}/>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <SocialButton kind="google"/>
            <SocialButton kind="apple"/>
          </div>

          <div style={{textAlign:'center', fontSize:14, color:'var(--text-2)', fontWeight:500}}>
            New to AutoMate? <span style={{color:'var(--primary)', fontWeight:600, cursor:'pointer'}}>Create account</span>
          </div>
        </div>
      </div>
      <HomeIndicator/>
    </div>
  );
}

function SocialButton({ kind }){
  const map = {
    google: { label:'Google', icon:
      <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.6 9.2c0-.6-.1-1.2-.2-1.7H9v3.3h4.8c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.4z" fill="#4285F4"/><path d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3C2.4 15.9 5.5 18 9 18z" fill="#34A853"/><path d="M3.9 10.7c-.2-.6-.3-1.1-.3-1.7s.1-1.2.3-1.7V5H.9C.3 6.2 0 7.6 0 9s.3 2.8.9 4l3-2.3z" fill="#FBBC04"/><path d="M9 3.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6C13.4.9 11.4 0 9 0 5.5 0 2.4 2.1.9 5l3 2.3C4.6 5.1 6.6 3.6 9 3.6z" fill="#EA4335"/></svg>
    },
    apple: { label:'Apple', icon:
      <svg width="18" height="18" viewBox="0 0 18 18" fill="white"><path d="M14.3 9.5c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.4.7 1 1.6 2.1 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.2 0 1.9-1 2.6-2 .8-1.2 1.2-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.6zM12.3 3.6c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-1 2.6 1 .1 2.1-.5 2.7-1.2z"/></svg>
    },
  };
  const s = map[kind];
  return (
    <button style={{
      height:52, borderRadius:14, cursor:'pointer',
      background:'var(--surface)', border:'1px solid rgba(176,182,195,0.10)',
      color:'var(--text)', fontFamily:'inherit', fontSize:14, fontWeight:600,
      display:'flex', alignItems:'center', justifyContent:'center', gap:10,
    }}>{s.icon}<span>{s.label}</span></button>
  );
}

/* ───────────────────────── 04 Sign Up ───────────────────────── */

function Register(){
  const [name, setName] = useStateA('Alex Karim');
  const [email, setEmail] = useStateA('alex@drives.fast');
  const [pw, setPw] = useStateA('Quattro!88');
  const [show, setShow] = useStateA(false);
  const [agree, setAgree] = useStateA(true);

  const score = (() => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  })();
  const strengths = [
    {label:'Too weak', color:'var(--danger)'},
    {label:'Weak',     color:'var(--danger)'},
    {label:'Fair',     color:'var(--warn)'},
    {label:'Good',     color:'var(--teal)'},
    {label:'Strong',   color:'var(--teal)'},
  ];
  const sm = strengths[score];

  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'16px 24px 24px',
        display:'flex', flexDirection:'column'}}>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <BackButton/>
          <div style={{fontSize:13, color:'var(--text-2)', fontWeight:500}}>
            Step <span style={{color:'var(--text)'}}>1</span> / 2
          </div>
        </div>

        <div style={{marginTop:24, display:'flex', flexDirection:'column', gap:8}}>
          <h1 style={{margin:0, fontSize:30, fontWeight:700, letterSpacing:-0.6, lineHeight:'36px'}}>Create your<br/>garage</h1>
          <p style={{margin:0, color:'var(--text-2)', fontSize:15, lineHeight:'22px'}}>We'll add your first car right after this.</p>
        </div>

        <div style={{marginTop:24, display:'flex', flexDirection:'column', gap:14}}>
          <Field label="Full name" value={name} onChange={setName} icon={I.user} placeholder="Your name"/>
          <Field label="Email" value={email} onChange={setEmail} type="email" icon={I.mail} placeholder="you@domain.com"/>
          <Field
            label="Password" value={pw} onChange={setPw}
            type={show?'text':'password'} icon={I.lock}
            trailing={<button onClick={()=>setShow(!show)} style={{background:'transparent', border:'none', cursor:'pointer', color:'var(--text-2)', display:'flex'}}>{show? I.eyeOff : I.eye}</button>}
          />
          <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:-4}}>
            <div style={{display:'flex', gap:6}}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{flex:1, height:4, borderRadius:99,
                  background: i < score ? sm.color : 'rgba(176,182,195,0.12)',
                  transition:'background .2s'}}/>
              ))}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-2)', fontWeight:500}}>
              <span>Password strength</span>
              <span style={{color:sm.color, fontWeight:600}}>{sm.label}</span>
            </div>
          </div>
        </div>

        <div style={{marginTop:18, display:'flex', alignItems:'flex-start', gap:12}}>
          <CheckBox checked={agree} onChange={()=>setAgree(!agree)}/>
          <div style={{fontSize:13, color:'var(--text-2)', lineHeight:'18px'}}>
            I agree to the <span style={{color:'var(--text)', fontWeight:600}}>Terms</span> and acknowledge the <span style={{color:'var(--text)', fontWeight:600}}>Privacy Policy</span>.
          </div>
        </div>

        <div style={{flex:1}}/>

        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <PrimaryButton disabled={!agree}>
            <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Continue {I.arrow}</span>
          </PrimaryButton>
          <div style={{textAlign:'center', fontSize:14, color:'var(--text-2)', fontWeight:500}}>
            Already have an account? <span style={{color:'var(--primary)', fontWeight:600, cursor:'pointer'}}>Sign in</span>
          </div>
        </div>
      </div>
      <HomeIndicator/>
    </div>
  );
}

/* ───────────────────────── 05 Forgot Password ───────────────────────── */

function ForgotPassword(){
  const [email, setEmail] = useStateA('alex@drives.fast');
  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'16px 24px 24px',
        display:'flex', flexDirection:'column'}}>
        <BackButton/>

        <div style={{marginTop:32, display:'flex', alignItems:'center', justifyContent:'center', height:120}}>
          <div style={{position:'relative', width:120, height:120, display:'grid', placeItems:'center'}}>
            <div style={{position:'absolute', width:120, height:120, borderRadius:'50%',
              background:'radial-gradient(circle, rgba(58,134,255,0.25) 0%, rgba(58,134,255,0) 70%)'}}/>
            <div style={{width:72, height:72, borderRadius:24,
              background:'rgba(58,134,255,0.15)',
              border:'1px solid rgba(58,134,255,0.3)',
              display:'grid', placeItems:'center', color:'var(--primary)'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6"/>
                <circle cx="12" cy="15" r="1.4" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:10, textAlign:'center'}}>
          <h1 style={{margin:0, fontSize:28, fontWeight:700, letterSpacing:-0.6}}>Forgot password?</h1>
          <p style={{margin:'0 auto', color:'var(--text-2)', fontSize:15, lineHeight:'22px', maxWidth:300}}>
            Enter the email tied to your account and we'll send a 6-digit reset code.
          </p>
        </div>

        <div style={{marginTop:32}}>
          <Field label="Email" value={email} onChange={setEmail} type="email" icon={I.mail} placeholder="you@domain.com"/>
        </div>

        <div style={{flex:1}}/>

        <div style={{display:'flex', flexDirection:'column', gap:14}}>
          <PrimaryButton>
            <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Send reset code {I.arrow}</span>
          </PrimaryButton>
          <div style={{textAlign:'center', fontSize:14, color:'var(--text-2)', fontWeight:500}}>
            Remembered it? <span style={{color:'var(--primary)', fontWeight:600, cursor:'pointer'}}>Sign in</span>
          </div>
        </div>
      </div>
      <HomeIndicator/>
    </div>
  );
}

/* ───────────────────────── 06 Verify Email (OTP) ───────────────────────── */

function VerifyEmail(){
  const code = ['7','3','9','2','',''];
  const activeIdx = 4;
  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'16px 24px 24px',
        display:'flex', flexDirection:'column'}}>
        <BackButton/>

        <div style={{marginTop:24, display:'flex', alignItems:'center', justifyContent:'center', height:140}}>
          <div style={{position:'relative', width:140, height:140, display:'grid', placeItems:'center'}}>
            <div style={{position:'absolute', width:140, height:140, borderRadius:'50%',
              background:'radial-gradient(circle, rgba(58,134,255,0.25) 0%, rgba(58,134,255,0) 70%)'}}/>
            {/* envelope */}
            <div style={{width:96, height:72, borderRadius:14,
              background:'var(--surface-2)', position:'relative',
              border:'1px solid rgba(176,182,195,0.10)',
              boxShadow:'0 18px 40px -12px rgba(0,0,0,0.6)'}}>
              <svg width="96" height="72" viewBox="0 0 96 72" style={{position:'absolute',inset:0}}>
                <path d="M2 8 L48 42 L94 8" stroke="rgba(176,182,195,0.4)" strokeWidth="1.5" fill="none"/>
              </svg>
              {/* OTP badge */}
              <div style={{position:'absolute', top:-12, right:-14,
                background:'var(--primary)', borderRadius:10, padding:'4px 10px',
                fontSize:11, fontWeight:700, letterSpacing:1.5, color:'#fff',
                boxShadow:'0 8px 20px -6px rgba(58,134,255,0.6)'}}>OTP</div>
            </div>
          </div>
        </div>

        <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:10, textAlign:'center'}}>
          <h1 style={{margin:0, fontSize:28, fontWeight:700, letterSpacing:-0.6}}>Check your inbox</h1>
          <p style={{margin:'0 auto', color:'var(--text-2)', fontSize:15, lineHeight:'22px', maxWidth:320}}>
            We sent a 6-digit code to <span style={{color:'var(--text)', fontWeight:600}}>alex@drives.fast</span>.
          </p>
        </div>

        <div style={{marginTop:28, display:'flex', justifyContent:'space-between', gap:8}}>
          {code.map((d, i) => (
            <div key={i} style={{
              flex:1, height:60, borderRadius:14,
              background: 'var(--surface)',
              border:`1px solid ${i===activeIdx ? 'var(--primary)' : 'rgba(176,182,195,0.10)'}`,
              boxShadow: i===activeIdx ? '0 0 0 4px rgba(58,134,255,0.12)' : 'none',
              display:'grid', placeItems:'center',
              fontSize:24, fontWeight:600, letterSpacing:-0.5,
              color: d ? 'var(--text)' : 'var(--text-3)',
              position:'relative',
            }}>
              {d || (i===activeIdx && <span style={{
                width:2, height:24, background:'var(--primary)',
                animation:'cursor 1s ease infinite',
              }}/>)}
            </div>
          ))}
        </div>
        <style>{`@keyframes cursor{0%,100%{opacity:1}50%{opacity:0}}`}</style>

        <div style={{marginTop:18, textAlign:'center', fontSize:13, color:'var(--text-2)', fontWeight:500}}>
          Didn't get it? <span style={{color:'var(--primary)', fontWeight:600, cursor:'pointer'}}>Resend in 0:42</span>
        </div>

        <div style={{flex:1}}/>

        <PrimaryButton>
          <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Verify {I.arrow}</span>
        </PrimaryButton>
      </div>
      <HomeIndicator/>
    </div>
  );
}

Object.assign(window, { Splash, Welcome, Login, Register, ForgotPassword, VerifyEmail });
