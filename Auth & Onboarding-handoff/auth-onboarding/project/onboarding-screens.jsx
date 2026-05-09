/* AutoMate — onboarding (post-auth) screens.
   GarageWelcome → AddCar (Vehicle, Plate/Mileage, Tracking, Baseline) → AllSet
*/

const { useState: useStateO } = React;

/* ───────── 07 You're in / Garage Welcome ───────── */

function GarageWelcome(){
  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 50% 28%, rgba(46,196,182,0.18) 0%, rgba(46,196,182,0) 55%)'}}/>

      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'24px 28px 28px',
        display:'flex', flexDirection:'column'}}>

        <div style={{flex:'0 0 320px', display:'grid', placeItems:'center', position:'relative'}}>
          <div style={{position:'relative', width:200, height:200, display:'grid', placeItems:'center'}}>
            {[200,160,120].map((s,i)=>(
              <div key={i} style={{position:'absolute', width:s, height:s, borderRadius:'50%',
                border:`1px solid rgba(46,196,182,${0.10 + i*0.06})`}}/>
            ))}
            <div style={{width:108, height:108, borderRadius:32,
              background:'linear-gradient(140deg, rgb(46,196,182) 0%, rgb(34,166,156) 100%)',
              display:'grid', placeItems:'center',
              boxShadow:'0 22px 60px -12px rgba(46,196,182,0.55), inset 0 1px 0 rgba(255,255,255,0.18)'}}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path d="M5 13.5l4 4L19 7.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <h1 style={{margin:0, fontSize:32, fontWeight:700, letterSpacing:-0.6, lineHeight:'38px', textWrap:'balance', textAlign:'center'}}>
            You're in, Alex.
          </h1>
          <p style={{margin:'0 auto', color:'var(--text-2)', fontSize:15, lineHeight:'22px', maxWidth:320, textAlign:'center'}}>
            Let's add your first car. It takes 90 seconds, and we'll seed your service history so you start with reminders ready.
          </p>
        </div>

        <div style={{marginTop:28, display:'flex', flexDirection:'column', gap:10}}>
          {[
            {icon:I.car, title:'Vehicle details', sub:'Make, model, plate'},
            {icon:I.gauge, title:'Tracking mode', sub:'Time, mileage, or both'},
            {icon:I.bell, title:'Baseline service', sub:'When was your last oil change?'},
          ].map((row,i)=>(
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:14,
              padding:'12px 14px', borderRadius:14,
              background:'rgba(26,29,36,0.6)',
              border:'1px solid rgba(176,182,195,0.06)',
            }}>
              <div style={{width:36, height:36, borderRadius:'50%',
                background:'rgba(58,134,255,0.18)', display:'grid', placeItems:'center', color:'var(--primary)'}}>{row.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14, fontWeight:600}}>{row.title}</div>
                <div style={{fontSize:12, color:'var(--text-2)', marginTop:2}}>{row.sub}</div>
              </div>
              <div style={{width:28, height:28, borderRadius:'50%',
                background:'rgba(176,182,195,0.08)', display:'grid', placeItems:'center',
                color:'var(--text-2)', fontSize:12, fontWeight:600}}>{i+1}</div>
            </div>
          ))}
        </div>

        <div style={{flex:1}}/>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <PrimaryButton>
            <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Add my first car {I.arrow}</span>
          </PrimaryButton>
          <button style={{background:'transparent', border:'none', cursor:'pointer',
            color:'var(--text-2)', fontFamily:'inherit', fontSize:14, fontWeight:500}}>
            I'll do this later
          </button>
        </div>
      </div>
      <HomeIndicator/>
    </div>
  );
}

/* ───────── 08 Add Car · Vehicle details ───────── */

function AddCarVehicle(){
  const [make, setMake] = useStateO('Renault');
  const [model, setModel] = useStateO('Sandero');
  const [year, setYear] = useStateO('2019');
  const [plate, setPlate] = useStateO('ج ٤٧٢٨ س');

  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'16px 24px 24px',
        display:'flex', flexDirection:'column'}}>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <BackButton/>
          <Stepper step={0} total={3}/>
          <div style={{width:44}}/>
        </div>

        <div style={{marginTop:24, display:'flex', flexDirection:'column', gap:6}}>
          <div style={{fontSize:12, color:'var(--primary)', fontWeight:600, letterSpacing:1.5, textTransform:'uppercase'}}>Step 1 of 3</div>
          <h1 style={{margin:0, fontSize:28, fontWeight:700, letterSpacing:-0.6, lineHeight:'34px'}}>What are you driving?</h1>
          <p style={{margin:0, color:'var(--text-2)', fontSize:14, lineHeight:'20px'}}>
            We use this to suggest service intervals and find recalls.
          </p>
        </div>

        {/* car preview card */}
        <div style={{marginTop:20, padding:'16px 18px', borderRadius:18,
          background:'linear-gradient(135deg, rgba(58,134,255,0.18) 0%, rgba(58,134,255,0.04) 100%)',
          border:'1px solid rgba(58,134,255,0.25)',
          display:'flex', alignItems:'center', gap:14}}>
          <div style={{width:56, height:56, borderRadius:14,
            background:'rgba(58,134,255,0.30)', display:'grid', placeItems:'center', color:'var(--primary)'}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 16h18M5 16l1.6-5.5a2 2 0 012-1.5h6.8a2 2 0 011.9 1.5L19 16M5 16v3M19 16v3M7 13h2M15 13h2"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:17, fontWeight:600, letterSpacing:-0.2}}>{make} {model}</div>
            <div style={{fontSize:13, color:'var(--text-2)', marginTop:2}}>{year} · {plate}</div>
          </div>
          <div style={{padding:'4px 10px', borderRadius:99, background:'rgba(58,134,255,0.25)',
            fontSize:11, fontWeight:600, color:'var(--primary)', letterSpacing:0.5}}>Primary</div>
        </div>

        <div style={{marginTop:18, display:'flex', flexDirection:'column', gap:14}}>
          <Field label="Make *" value={make} onChange={setMake} icon={I.car} placeholder="e.g. Toyota"/>
          <div style={{display:'grid', gridTemplateColumns:'1fr 110px', gap:12}}>
            <Field label="Model *" value={model} onChange={setModel} placeholder="e.g. Corolla"/>
            <Field label="Year *" value={year} onChange={setYear} type="text" placeholder="2024"/>
          </div>
          <Field label="License plate *" value={plate} onChange={setPlate} icon={I.hash} placeholder="ABC 1234" hint="Used on receipts and reminders."/>
        </div>

        <div style={{flex:1}}/>

        <PrimaryButton>
          <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Continue {I.arrow}</span>
        </PrimaryButton>
      </div>
      <HomeIndicator/>
    </div>
  );
}

/* ───────── 09 Add Car · Tracking mode + odometer ───────── */

function AddCarTracking(){
  const [mode, setMode] = useStateO('both');
  const [odo, setOdo] = useStateO('201,240');

  const opts = [
    {id:'time',    title:'By time',    sub:'Calendar-based reminders. Best for daily drivers.', icon:I.cal},
    {id:'mileage', title:'By mileage', sub:'Triggers on km. Best if your driving varies.',     icon:I.gauge},
    {id:'both',    title:'Both',       sub:'Whichever comes first. Recommended.',                icon:I.spark, badge:'Recommended'},
  ];

  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'16px 24px 24px',
        display:'flex', flexDirection:'column'}}>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <BackButton/>
          <Stepper step={1} total={3}/>
          <div style={{width:44}}/>
        </div>

        <div style={{marginTop:24, display:'flex', flexDirection:'column', gap:6}}>
          <div style={{fontSize:12, color:'var(--primary)', fontWeight:600, letterSpacing:1.5, textTransform:'uppercase'}}>Step 2 of 3</div>
          <h1 style={{margin:0, fontSize:28, fontWeight:700, letterSpacing:-0.6, lineHeight:'34px'}}>How should we<br/>track service?</h1>
        </div>

        <div style={{marginTop:18, display:'flex', flexDirection:'column', gap:10}}>
          {opts.map(o => {
            const sel = mode === o.id;
            return (
              <div key={o.id} onClick={()=>setMode(o.id)} style={{
                cursor:'pointer', position:'relative',
                padding:'14px 16px', borderRadius:16,
                background: sel ? 'rgba(58,134,255,0.10)' : 'var(--surface)',
                border: `1px solid ${sel ? 'var(--primary)' : 'rgba(176,182,195,0.08)'}`,
                display:'flex', alignItems:'center', gap:14,
                transition:'all .15s ease',
              }}>
                <div style={{width:40, height:40, borderRadius:'50%',
                  background: sel ? 'rgba(58,134,255,0.30)' : 'rgba(176,182,195,0.10)',
                  display:'grid', placeItems:'center',
                  color: sel ? 'var(--primary)' : 'var(--text-2)'}}>{o.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <span style={{fontSize:15, fontWeight:600}}>{o.title}</span>
                    {o.badge && (
                      <span style={{padding:'2px 8px', borderRadius:99, fontSize:10, fontWeight:600,
                        background:'rgba(46,196,182,0.20)', color:'var(--teal)', letterSpacing:0.5, textTransform:'uppercase'}}>
                        {o.badge}
                      </span>
                    )}
                  </div>
                  <div style={{fontSize:12, color:'var(--text-2)', marginTop:3, lineHeight:'17px'}}>{o.sub}</div>
                </div>
                <Radio checked={sel} onChange={()=>setMode(o.id)}/>
              </div>
            );
          })}
        </div>

        {/* current mileage */}
        {mode !== 'time' && (
          <div style={{marginTop:18}}>
            <Field label="Current mileage *" value={odo} onChange={setOdo} icon={I.gauge}
              placeholder="0" hint="We'll use this as your baseline odometer."
              trailing={
                <span style={{fontSize:13, color:'var(--text-2)', fontWeight:600, padding:'0 4px'}}>km</span>
              }
            />
          </div>
        )}

        <div style={{flex:1}}/>

        <PrimaryButton>
          <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Continue {I.arrow}</span>
        </PrimaryButton>
      </div>
      <HomeIndicator/>
    </div>
  );
}

/* ───────── 10 Add Car · Baseline maintenance ───────── */

function AddCarBaseline(){
  const [items, setItems] = useStateO({
    oil:    { checked:true,  date:'Mar 12, 2026', miles:'195,400' },
    tire:   { checked:true,  date:'Jan 04, 2026', miles:'188,200' },
    brake:  { checked:false, date:'',             miles:''        },
    filter: { checked:false, date:'',             miles:''        },
    bat:    { checked:true,  date:'Aug 22, 2025', miles:'170,000' },
  });
  const services = [
    {id:'oil',    name:'Oil change',       icon:I.drop,    color:'rgb(58,134,255)'},
    {id:'tire',   name:'Tire rotation',    icon:I.tire,    color:'rgb(46,196,182)'},
    {id:'brake',  name:'Brake inspection', icon:I.brake,   color:'rgb(255,159,28)'},
    {id:'filter', name:'Air filter',       icon:I.filter,  color:'rgb(186,124,255)'},
    {id:'bat',    name:'Battery check',    icon:I.battery, color:'rgb(230,57,70)'},
  ];
  const checkedCount = Object.values(items).filter(v=>v.checked).length;

  const toggle = (id) => setItems(p=>({...p, [id]:{...p[id], checked:!p[id].checked}}));

  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'16px 24px 16px',
        display:'flex', flexDirection:'column'}}>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <BackButton/>
          <Stepper step={2} total={3}/>
          <div style={{width:44}}/>
        </div>

        <div style={{marginTop:20, display:'flex', flexDirection:'column', gap:6}}>
          <div style={{fontSize:12, color:'var(--primary)', fontWeight:600, letterSpacing:1.5, textTransform:'uppercase'}}>Step 3 of 3</div>
          <h1 style={{margin:0, fontSize:26, fontWeight:700, letterSpacing:-0.6, lineHeight:'32px'}}>What's already<br/>been done?</h1>
          <p style={{margin:0, color:'var(--text-2)', fontSize:14, lineHeight:'20px'}}>
            Tap any service you remember. We'll seed the history so reminders fire from the right date — not from today.
          </p>
        </div>

        <div style={{marginTop:18, flex:1, overflow:'auto', display:'flex', flexDirection:'column', gap:8,
          paddingRight:4, marginRight:-4}}>
          {services.map(s => {
            const v = items[s.id];
            const sel = v.checked;
            return (
              <div key={s.id} onClick={()=>toggle(s.id)} style={{
                cursor:'pointer',
                padding:'12px 14px', borderRadius:14,
                background: sel ? 'rgba(58,134,255,0.08)' : 'var(--surface)',
                border:`1px solid ${sel ? 'rgba(58,134,255,0.45)' : 'rgba(176,182,195,0.08)'}`,
                transition:'all .15s ease',
              }}>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <div style={{width:36, height:36, borderRadius:'50%',
                    background:`color-mix(in oklab, ${s.color} 22%, transparent)`,
                    display:'grid', placeItems:'center', color:s.color, flex:'none'}}>{s.icon}</div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:15, fontWeight:600}}>{s.name}</div>
                    {sel ? (
                      <div style={{fontSize:12, color:'var(--text-2)', marginTop:3, display:'flex', gap:10}}>
                        <span>{v.date || 'Add date'}</span>
                        <span style={{color:'var(--text-3)'}}>·</span>
                        <span>{v.miles ? `${v.miles} km` : 'Add mileage'}</span>
                      </div>
                    ) : (
                      <div style={{fontSize:12, color:'var(--text-3)', marginTop:3}}>Tap if recently completed</div>
                    )}
                  </div>
                  <CheckBox checked={sel} onChange={()=>toggle(s.id)}/>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{margin:'12px 0 8px', padding:'12px 14px', borderRadius:12,
          background:'rgba(46,196,182,0.10)', border:'1px solid rgba(46,196,182,0.25)',
          display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:28, height:28, borderRadius:'50%',
            background:'rgba(46,196,182,0.25)', display:'grid', placeItems:'center', color:'var(--teal)'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{flex:1, fontSize:13, lineHeight:'18px', color:'var(--text)'}}>
            <span style={{fontWeight:600}}>{checkedCount} services seeded</span>
            <span style={{color:'var(--text-2)'}}> · we'll auto-fill the rest from factory intervals.</span>
          </div>
        </div>

        <PrimaryButton>
          <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Save and finish {I.arrow}</span>
        </PrimaryButton>
      </div>
      <HomeIndicator/>
    </div>
  );
}

/* ───────── 11 All Set ───────── */

function AllSet(){
  return (
    <div style={screenStyle}>
      <StatusBar/>
      <div style={{position:'absolute', inset:0,
        background:'radial-gradient(ellipse at 50% 35%, rgba(46,196,182,0.22) 0%, rgba(46,196,182,0) 55%)'}}/>

      {/* confetti dots */}
      <svg style={{position:'absolute', inset:0, pointerEvents:'none'}} width="100%" height="100%">
        {[
          [40,160,'rgb(58,134,255)'],[88,108,'rgb(46,196,182)'],[140,72,'rgb(255,159,28)'],[220,90,'rgb(46,196,182)'],
          [302,140,'rgb(58,134,255)'],[348,210,'rgb(186,124,255)'],[60,260,'rgb(255,159,28)'],[330,300,'rgb(58,134,255)'],
          [54,460,'rgb(46,196,182)'],[336,460,'rgb(255,159,28)'],
        ].map(([x,y,c],i)=>(
          <circle key={i} cx={x} cy={y} r={i%3===0?4:2.5} fill={c} opacity="0.9"/>
        ))}
        {[
          [110,180,18,'rgb(58,134,255)'],[280,250,-22,'rgb(46,196,182)'],[78,360,12,'rgb(255,159,28)'],
        ].map(([x,y,r,c],i)=>(
          <rect key={'r'+i} x={x} y={y} width="6" height="14" rx="2" fill={c} transform={`rotate(${r} ${x+3} ${y+7})`} opacity="0.8"/>
        ))}
      </svg>

      <div style={{position:'absolute', inset:'54px 0 21px 0', padding:'24px 28px 28px',
        display:'flex', flexDirection:'column'}}>

        <div style={{flex:'0 0 320px', display:'grid', placeItems:'center'}}>
          <div style={{position:'relative', width:200, height:200, display:'grid', placeItems:'center'}}>
            {[200,160,120].map((s,i)=>(
              <div key={i} style={{position:'absolute', width:s, height:s, borderRadius:'50%',
                border:`1px solid rgba(46,196,182,${0.10 + i*0.06})`}}/>
            ))}
            <div style={{width:120, height:120, borderRadius:'50%',
              background:'linear-gradient(140deg, rgb(46,196,182) 0%, rgb(34,166,156) 100%)',
              display:'grid', placeItems:'center',
              boxShadow:'0 24px 70px -12px rgba(46,196,182,0.6), inset 0 1px 0 rgba(255,255,255,0.18)'}}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:12, textAlign:'center'}}>
          <h1 style={{margin:0, fontSize:32, fontWeight:700, letterSpacing:-0.6, lineHeight:'38px'}}>You're all set.</h1>
          <p style={{margin:'0 auto', color:'var(--text-2)', fontSize:15, lineHeight:'22px', maxWidth:320}}>
            Renault Sandero is in your garage with 3 services seeded. Next up: <span style={{color:'var(--text)', fontWeight:600}}>Oil change in 2,400 km</span>.
          </p>
        </div>

        <div style={{marginTop:24, padding:'16px 18px', borderRadius:18,
          background:'var(--surface)', border:'1px solid rgba(176,182,195,0.08)',
          display:'flex', flexDirection:'column', gap:14}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:44, height:44, borderRadius:14,
              background:'rgba(255,159,28,0.20)', display:'grid', placeItems:'center', color:'var(--warn)'}}>{I.drop}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11, color:'var(--warn)', fontWeight:600, letterSpacing:1, textTransform:'uppercase'}}>Next due</div>
              <div style={{fontSize:16, fontWeight:600, marginTop:2}}>Oil change</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:18, fontWeight:600, letterSpacing:-0.4, fontFeatureSettings:'"tnum" 1'}}>2,400 km</div>
              <div style={{fontSize:12, color:'var(--text-2)'}}>or May 18</div>
            </div>
          </div>
          <div style={{height:1, background:'rgba(176,182,195,0.08)'}}/>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:12}}>
            <div>
              <div style={{color:'var(--text-2)'}}>Garage</div>
              <div style={{fontWeight:600, marginTop:3}}>1 car</div>
            </div>
            <div>
              <div style={{color:'var(--text-2)'}}>Seeded</div>
              <div style={{fontWeight:600, marginTop:3}}>3 services</div>
            </div>
            <div>
              <div style={{color:'var(--text-2)'}}>Reminders</div>
              <div style={{fontWeight:600, marginTop:3, color:'var(--teal)'}}>Active</div>
            </div>
          </div>
        </div>

        <div style={{flex:1}}/>

        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <PrimaryButton>
            <span style={{display:'inline-flex',alignItems:'center',gap:10}}>Take me to my garage {I.arrow}</span>
          </PrimaryButton>
          <button style={{background:'transparent', border:'none', cursor:'pointer',
            color:'var(--text-2)', fontFamily:'inherit', fontSize:14, fontWeight:500}}>
            Add another car
          </button>
        </div>
      </div>
      <HomeIndicator/>
    </div>
  );
}

Object.assign(window, { GarageWelcome, AddCarVehicle, AddCarTracking, AddCarBaseline, AllSet });
