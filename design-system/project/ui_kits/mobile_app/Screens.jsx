// Screen components — Home, Maintenance (Upcoming/History), LogMaintenance, SwitchCarSheet
const { useState: useS } = React;

function CarHeader({ car, onSwitch }) {
  return (
    <button onClick={onSwitch} style={{
      background:'none', border:0, padding:0, display:'flex', alignItems:'center',
      gap:8, color:AM.c.fg1, fontFamily:AM.font, cursor:'pointer',
    }}>
      <div style={{ textAlign:'left' }}>
        <div style={{ fontSize:20, fontWeight:500, lineHeight:'30px' }}>{car.name}</div>
        <div style={{ fontSize:14, fontWeight:500, color:AM.c.fg2, lineHeight:'20px' }}>{car.plate}</div>
      </div>
      <Icon name="chevron-down" size={20} color={AM.c.fg3}/>
    </button>
  );
}

function MileageCard({ km, onUpdate }) {
  return (
    <div style={{
      background:AM.c.s4, borderRadius:16, padding:16,
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      <div>
        <div style={{ fontSize:12, color:AM.c.fg2, lineHeight:'16px' }}>Current Mileage</div>
        <div style={{ fontSize:16, color:AM.c.fg1, lineHeight:'24px', fontFeatureSettings:'"tnum" 1' }}>{km.toLocaleString()} km</div>
      </div>
      <button onClick={onUpdate} style={{
        width:32, height:32, borderRadius:9999, background:AM.c.brand,
        border:0, display:'grid', placeItems:'center', cursor:'pointer', color:'#fff',
      }}><Icon name="plus" size={16} color="#fff"/></button>
    </div>
  );
}

function NextDueCard({ service, kmLeft }) {
  return (
    <Card tone="alert">
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <Backplate tone="warn" size={48}><Icon name="alert-triangle" size={24} color={AM.c.warn}/></Backplate>
        <div>
          <div style={{ fontSize:14, color:AM.c.fg2, lineHeight:'20px' }}>Next Due</div>
          <div style={{ fontSize:18, fontWeight:500, color:AM.c.fg1, lineHeight:'27px' }}>{service}</div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:16 }}>
        <Icon name="route" size={20} color={AM.c.warn}/>
        <span style={{ fontSize:16, color:AM.c.warn, fontFeatureSettings:'"tnum" 1' }}>{kmLeft} km</span>
        <span style={{ fontSize:16, color:AM.c.fg2 }}>left</span>
      </div>
    </Card>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex:1, background:AM.c.s2, border:0, borderRadius:16, padding:16,
      display:'flex', flexDirection:'column', alignItems:'center', gap:8,
      cursor:'pointer', color:AM.c.fg1, fontFamily:AM.font,
    }}>
      <Backplate tone="brand" size={48}><Icon name={icon} size={20} color={AM.c.brand}/></Backplate>
      <span style={{ fontSize:14, fontWeight:500, textAlign:'center', lineHeight:'16px', whiteSpace:'pre-line' }}>{label}</span>
    </button>
  );
}

function ActivityRow({ icon, tone='neutral', title, time }) {
  return (
    <Card>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <Backplate tone={tone} size={36}><Icon name={icon} size={20}/></Backplate>
        <div>
          <div style={{ fontSize:16, color:AM.c.fg1, lineHeight:'24px' }}>{title}</div>
          <div style={{ fontSize:14, color:AM.c.fg2, lineHeight:'20px' }}>{time}</div>
        </div>
      </div>
    </Card>
  );
}

function SpendRow({ label, value }) {
  return (
    <div style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'12px 0', borderBottom:`1px solid ${AM.c.s4}`,
    }}>
      <span style={{ fontSize:16, color:AM.c.fg1 }}>{label}</span>
      <span style={{ fontSize:16, color:AM.c.fg1, fontFeatureSettings:'"tnum" 1' }}>{value}</span>
    </div>
  );
}

function HomeScreen({ car, onSwitchCar, onLog, onUpdateMileage, onViewAll }) {
  return (
    <div style={{ padding:'24px 16px 110px' }}>
      <CarHeader car={car} onSwitch={onSwitchCar}/>
      <div style={{ height:16 }}/>
      <MileageCard km={car.km} onUpdate={onUpdateMileage}/>
      <div style={{ height:16 }}/>
      <NextDueCard service="Oil Change" kmLeft="500"/>
      <div style={{ height:16 }}/>
      <div style={{ display:'flex', gap:16 }}>
        <QuickAction icon="gauge" label={"Update\nMileage"} onClick={onUpdateMileage}/>
        <QuickAction icon="wrench" label={"Log\nMaintenance"} onClick={onLog}/>
        <QuickAction icon="list" label={"View\nAll"} onClick={onViewAll}/>
      </div>
      <div style={{ height:24 }}/>
      <h2 style={{ fontSize:18, fontWeight:500, color:AM.c.fg1, margin:'0 0 8px' }}>Recent Activity</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <ActivityRow icon="check" tone="neutral" title="Oil change completed" time="2 days ago"/>
        <ActivityRow icon="gauge" tone="neutral" title="Mileage updated to 210,240 km" time="5 days ago"/>
        <ActivityRow icon="wrench" tone="neutral" title="Tire rotation completed" time="1 week ago"/>
      </div>
      <div style={{ height:24 }}/>
      <h2 style={{ fontSize:18, fontWeight:500, color:AM.c.fg1, margin:'0 0 8px' }}>Monthly Spend Summary</h2>
      <div style={{ background:AM.c.s2, borderRadius:16, padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <Backplate tone="brand" size={48}><Icon name="pound-sterling" size={24} color={AM.c.brand}/></Backplate>
          <div>
            <div style={{ fontSize:14, color:AM.c.fg2, lineHeight:'20px' }}>Total This Month</div>
            <div style={{ fontSize:24, color:AM.c.fg1, lineHeight:'32px', fontFeatureSettings:'"tnum" 1' }}>342.50 LE</div>
          </div>
        </div>
        <SpendRow label="Oil Change" value="75.00 LE"/>
        <SpendRow label="Tire Rotation" value="45.00 LE"/>
        <SpendRow label="Air Filter" value="35.50 LE"/>
        <SpendRow label="Fuel" value="187.00 LE"/>
      </div>
    </div>
  );
}

function TabSwitcher({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:12 }}>
      {tabs.map(t => (
        <button key={t} onClick={()=>onChange(t)} style={{
          height:40, borderRadius:9999, padding:'8px 19px', border:0, cursor:'pointer',
          background: t===active ? AM.c.brand : AM.c.s2,
          color: t===active ? AM.c.fg1 : AM.c.fg2,
          fontFamily:AM.font, fontSize:16, fontWeight:500,
        }}>{t}</button>
      ))}
    </div>
  );
}

function UpcomingCard({ service, status, due, miles }) {
  const tone = status==='Overdue' ? 'danger' : status==='Urgent' ? 'warn' : 'brand';
  return (
    <Card>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div style={{ fontSize:16, fontWeight:500, color:AM.c.fg1 }}>{service}</div>
        <Pill tone={tone}>{status}</Pill>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', color:AM.c.fg2, fontSize:14, fontFeatureSettings:'"tnum" 1' }}>
        <span>{due}</span><span>{miles}</span>
      </div>
    </Card>
  );
}

function MaintenanceScreen({ initialTab='Upcoming', onLog }) {
  const [tab, setTab] = useS(initialTab);
  return (
    <div style={{ padding:'24px 16px 110px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h1 style={{ fontSize:20, fontWeight:500, color:AM.c.fg1, margin:0 }}>Maintenance</h1>
        <button onClick={onLog} style={{
          width:40, height:40, borderRadius:9999, border:0, background:AM.c.s2,
          display:'grid', placeItems:'center', cursor:'pointer', color:AM.c.fg3,
        }}><Icon name="plus" size={20} color={AM.c.fg3}/></button>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <TabSwitcher tabs={['Upcoming','History']} active={tab} onChange={setTab}/>
        <button style={{
          width:40, height:40, borderRadius:9999, border:0, background:AM.c.s2,
          display:'grid', placeItems:'center', cursor:'pointer', color:AM.c.fg3,
        }}><Icon name="sliders-horizontal" size={20} color={AM.c.fg3}/></button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {tab==='Upcoming' ? (
          <>
            <UpcomingCard service="Oil Change" status="Urgent" due="Due: May 8, 2026" miles="201,740 km"/>
            <UpcomingCard service="Battery Check" status="Upcoming" due="Due: May 15, 2026" miles="220,000 km"/>
            <UpcomingCard service="Tire Rotation" status="Upcoming" due="Due: Jun 1, 2026" miles="250,000 km"/>
          </>
        ) : (
          <>
            <UpcomingCard service="Tire Rotation" status="Completed" due="Mar 28, 2026" miles="45.00 LE"/>
            <UpcomingCard service="Oil Change" status="Completed" due="Feb 10, 2026" miles="75.00 LE"/>
            <UpcomingCard service="Brake Pad Replacement" status="Completed" due="Jan 5, 2026" miles="250.00 LE"/>
            <UpcomingCard service="Battery Replacement" status="Completed" due="Dec 1, 2025" miles="180.00 LE"/>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <span style={{ fontSize:14, fontWeight:500, color:AM.c.fg2, lineHeight:'20px' }}>{label}</span>
      {children}
    </div>
  );
}

function InputBase({ icon, value, placeholder, right, onChange, type='text' }) {
  return (
    <div style={{
      height:56, borderRadius:16, background:AM.c.s1, padding:'0 16px',
      display:'flex', alignItems:'center', gap:12,
    }}>
      {icon && <Icon name={icon} size={20} color={AM.c.fg3}/>}
      <input value={value??''} placeholder={placeholder} onChange={onChange} type={type} style={{
        flex:1, background:'none', border:0, outline:'none', color:AM.c.fg1,
        fontFamily:AM.font, fontSize:16,
      }}/>
      {right}
    </div>
  );
}

function LogMaintenanceScreen({ onBack, onSave }) {
  const [type, setType] = useS('');
  const [date, setDate] = useS('5/5/2026');
  const [mileage, setMileage] = useS('');
  return (
    <div style={{ padding:'0 0 32px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'24px 16px 16px' }}>
        <button onClick={onBack} style={{ background:'none', border:0, color:AM.c.fg3, cursor:'pointer', padding:4 }}>
          <Icon name="arrow-left" size={24} color={AM.c.fg3}/>
        </button>
        <h1 style={{ fontSize:20, fontWeight:500, color:AM.c.fg1, margin:0 }}>Log Maintenance</h1>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:16 }}>
        <Field label="Maintenance Type *">
          <button onClick={()=>setType('Oil Change')} style={{
            height:56, borderRadius:16, background:AM.c.s1, padding:'0 16px',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            border:0, cursor:'pointer', fontFamily:AM.font, fontSize:16, fontWeight:500,
            color: type ? AM.c.fg1 : AM.c.fg2,
          }}>
            <span>{type || 'Select type'}</span>
            <Icon name="chevron-right" size={20} color={AM.c.fg2}/>
          </button>
        </Field>
        <Field label="Date *">
          <InputBase icon="calendar" value={date} onChange={e=>setDate(e.target.value)}/>
        </Field>
        <Field label="Mileage at Service *">
          <InputBase icon="gauge" value={mileage} placeholder="45230" onChange={e=>setMileage(e.target.value)} type="number"/>
        </Field>
        <Field label="Cost (optional)">
          <InputBase icon="pound-sterling" placeholder="75.00"/>
        </Field>
        <Field label="Provider/Shop (optional)">
          <InputBase icon="map-pin" placeholder="Quick Lube Center"/>
        </Field>
        <Field label="Notes (optional)">
          <div style={{ borderRadius:16, background:AM.c.s1, padding:16, display:'flex', gap:12 }}>
            <Icon name="align-left" size={20} color={AM.c.fg3}/>
            <textarea placeholder="Additional details..." style={{
              flex:1, background:'none', border:0, outline:'none', color:AM.c.fg1,
              fontFamily:AM.font, fontSize:16, resize:'none', height:56,
            }}/>
          </div>
        </Field>
        <Field label="Photo (optional)">
          <button style={{
            borderRadius:16, background:AM.c.s1, border:`1px dashed ${AM.c.s4}`,
            padding:'32px 0', display:'flex', justifyContent:'center', alignItems:'center', gap:12,
            cursor:'pointer', fontFamily:AM.font, fontSize:16, fontWeight:500, color:AM.c.fg2,
          }}>
            <Icon name="camera" size={20} color={AM.c.fg2}/> Add Photo
          </button>
        </Field>
        <div style={{ marginTop:8, textAlign:'center' }}>
          <span style={{ fontSize:16, fontWeight:500, color:AM.c.success }}>Next service 5/5/2026</span>
        </div>
        <button onClick={onSave} style={{
          height:56, borderRadius:16, background:AM.c.brand, border:0, color:'#fff',
          fontFamily:AM.font, fontSize:16, fontWeight:500, cursor:'pointer',
        }}>Save Maintenance</button>
      </div>
    </div>
  );
}

function SwitchCarSheet({ cars, activeId, onPick, onAdd, onClose }) {
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', zIndex:50,
      display:'flex', alignItems:'flex-end',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background:AM.c.s3, borderRadius:'24px 24px 0 0',
        padding:'16px 16px 32px', display:'flex', flexDirection:'column', gap:12,
      }}>
        <h2 style={{ fontSize:18, fontWeight:500, color:AM.c.fg1, margin:0 }}>Switch Car</h2>
        {cars.map(c => {
          const on = c.id === activeId;
          return (
            <Card key={c.id} tone={on?'selected':'basic'} onClick={()=>onPick(c.id)}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <Backplate tone={on?'brand-solid':'neutral'} size={44}>
                  <Icon name="car" size={20} color={on?'#fff':AM.c.fg3}/>
                </Backplate>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:500, color:AM.c.fg1 }}>{c.name}</div>
                  <div style={{ fontSize:14, fontWeight:500, color:AM.c.fg2 }}>{c.plate}</div>
                </div>
                {on && <Icon name="check" size={20} color={AM.c.brand}/>}
              </div>
            </Card>
          );
        })}
        <button onClick={onAdd} style={{
          height:56, borderRadius:16, background:AM.c.brand, border:0, color:'#fff',
          fontFamily:AM.font, fontSize:16, fontWeight:500, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginTop:4,
        }}>
          <Icon name="plus" size={20} color="#fff"/> Add New Car
        </button>
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
window.MaintenanceScreen = MaintenanceScreen;
window.LogMaintenanceScreen = LogMaintenanceScreen;
window.SwitchCarSheet = SwitchCarSheet;
