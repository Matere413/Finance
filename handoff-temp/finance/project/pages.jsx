/* Pages */
(function() {
  const { useState, useMemo } = React;
  const D = window.FinData;

  // ============ DASHBOARD ============
  window.PageDashboard = function PageDashboard({ txList, privacy, onNewTx, ctxLabel, isGroup }) {
    const totals = D.totals(txList);
    const byCat = D.aggregateByCat(txList);
    const maxSpent = Math.max(...byCat.map(c => c.spent), 1);
    const recent = [...txList].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 5);
    const savings = totals.income ? Math.round((totals.balance / totals.income) * 100) : 0;

    return (
      <div className="page">
        <div className="page__head">
          <div className="page__title-wrap">
            <div className="page__eyebrow">{ctxLabel} · April 2026</div>
            <h1 className="page__title">Good morning, David.</h1>
            <p className="page__sub">Here's how {isGroup ? 'your family' : 'your month'} is tracking.</p>
          </div>
          <div className="page__actions">
            <button className="btn btn--ghost btn--sm"><Icon name="download" size={12}/> Export</button>
            <button className="btn btn--primary" onClick={onNewTx}>
              <Icon name="plus" size={12}/> New transaction
            </button>
          </div>
        </div>

        <div className="dash-grid">
          <Stat eyebrow={<><Icon name="pixel_diamond" size={10}/> Balance</>}
                value={D.usd(totals.balance).replace('$','')}
                variant={totals.balance >= 0 ? 'success' : 'danger'}
                delta="+12.4% vs March" deltaDir="up" hideMoney={privacy}/>
          <Stat eyebrow={<><Icon name="arrow_right" size={10}/> Income</>}
                value={D.usd(totals.income).replace('$','')}
                variant="success" delta={isGroup ? '2 members' : '2 sources'} deltaDir="up" hideMoney={privacy}/>
          <Stat eyebrow={<><Icon name="flame" size={10}/> Expenses</>}
                value={D.usd(totals.expense).replace('$','')}
                variant="ember" delta="-4.1% vs March" deltaDir="down" hideMoney={privacy}/>
          <Stat eyebrow={<><Icon name="star" size={10}/> Savings rate</>}
                value={savings + '%'} currency=""
                variant="success" delta={savings > 20 ? 'on track' : 'tight month'} deltaDir={savings > 20 ? 'up':'down'} hideMoney={privacy}/>
        </div>

        <div className="dash-main">
          <div className="card">
            <div className="row row--between" style={{marginBottom: 4}}>
              <div>
                <div className="card__eyebrow"><Icon name="terminal" size={10}/> Spending by category</div>
                <div className="card__title">Where the month went</div>
              </div>
              <span className="chip chip--status chip--featured">APR · 2026</span>
            </div>
            <div className="bars">
              {byCat.slice(0, 7).map(c => (
                <div key={c.id} className="bar">
                  <span className="bar__label">
                    <span className="bar__swatch" style={{background: c.color}}></span>
                    {c.name}
                  </span>
                  <div className="bar__track">
                    <div className="bar__fill" style={{width: (c.spent / maxSpent * 100) + '%', '--bar-color': c.color}}></div>
                  </div>
                  <span className="bar__val">{privacy ? '••••' : D.usd(c.spent).replace('$','$')}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap: 16}}>
            <div className="card card--paper-surface">
              <div className="card__eyebrow">Top category</div>
              <div style={{fontFamily:'Newsreader, serif', fontStyle:'italic', fontSize: 28, lineHeight: 1.15, color:'var(--earth-900)', margin:'10px 0 8px'}}>
                {byCat[0].name} took <b>{D.usd(byCat[0].spent)}</b> this month.
              </div>
              <div style={{fontFamily:'Geist, sans-serif', fontSize: 14, color:'var(--earth-800)'}}>
                That's {Math.round(byCat[0].spent / totals.expense * 100)}% of all expenses. Budget was {D.usd(D.catById(byCat[0].id).budget)}.
              </div>
            </div>

            <div className="card">
              <div className="card__eyebrow"><Icon name="book" size={10}/> Recent activity</div>
              <div style={{marginTop: 10, display:'flex', flexDirection:'column'}}>
                {recent.map(t => {
                  const cat = D.catById(t.cat);
                  return (
                    <div key={t.id} style={{display:'grid', gridTemplateColumns: '10px 1fr auto', gap: 12, alignItems:'center', padding: '10px 0', borderBottom:'1px dashed var(--border-1)'}}>
                      <span className="pip" style={{background: cat.color, animation:'none'}}></span>
                      <div>
                        <div style={{fontFamily:'Geist, sans-serif', fontSize: 14, color:'var(--fg-1)', fontWeight:500}}>{t.desc}</div>
                        <div style={{fontFamily:'VT323, monospace', fontSize: 14, color:'var(--fg-muted)'}}>{D.formatDate(t.date)} · {cat.name}</div>
                      </div>
                      <div style={{fontFamily:'Pixelify Sans', fontWeight:700, fontSize: 16, color: t.amount > 0 ? 'var(--sage-500)' : 'var(--fg-1)'}}>
                        {privacy ? '•••' : (t.amount > 0 ? '+' : '') + D.usd(t.amount).replace('-','−')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="term-card" style={{marginTop: 20}}>
          <span className="line"><span className="prompt">finance@matere ~$</span> month-summary --context {isGroup ? 'group' : 'personal'}</span>
          <span className="line"><span className="ok">→</span> Net position: <b style={{color: totals.balance >= 0 ? '#a9c674' : '#d9551f'}}>{D.usd(totals.balance)}</b> · {totals.balance >= 0 ? 'surplus' : 'deficit'}</span>
          <span className="line"><span className="warn">!</span> {byCat[0].name} is {Math.round(byCat[0].spent / (D.catById(byCat[0].id).budget||1) * 100)}% of budget</span>
          <span className="line"><span className="prompt">_</span><span className="cursor" style={{background:'#e8a76b'}}></span></span>
        </div>
      </div>
    );
  };

  // ============ TRANSACTIONS ============
  window.PageTransactions = function PageTransactions({ txList, privacy, onNewTx, isGroup }) {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
      let r = txList;
      if (filter === 'income') r = r.filter(t => t.amount > 0);
      if (filter === 'expense') r = r.filter(t => t.amount < 0);
      if (search) r = r.filter(t => t.desc.toLowerCase().includes(search.toLowerCase()));
      return r;
    }, [txList, filter, search]);

    const grouped = D.groupByDate(filtered);

    return (
      <div className="page">
        <div className="page__head">
          <div className="page__title-wrap">
            <div className="page__eyebrow">{isGroup ? 'Group · Transactions' : 'Personal · Transactions'}</div>
            <h1 className="page__title">{filtered.length} entries this month.</h1>
            <p className="page__sub">All in one ledger. Chunky, crisp, unlost.</p>
          </div>
          <div className="page__actions">
            <button className="btn btn--ghost btn--sm"><Icon name="download" size={12}/> CSV</button>
            <button className="btn btn--primary" onClick={onNewTx}><Icon name="plus" size={12}/> Add entry</button>
          </div>
        </div>

        <div className="filters">
          <div className="filters__search">
            <Icon name="search" size={14} color="var(--fg-muted)"/>
            <input placeholder="Search descriptions..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button style={{background:'none', border:'none', cursor:'pointer', color:'var(--fg-muted)'}} onClick={() => setSearch('')}><Icon name="close" size={10}/></button>}
          </div>
          {['all','income','expense'].map(k => (
            <button key={k} className={'chip' + (filter === k ? ' is-on' : '')} onClick={() => setFilter(k)}>
              {k.toUpperCase()}
            </button>
          ))}
          <button className="chip"><Icon name="folder" size={10}/> Category</button>
          <button className="chip"><Icon name="book" size={10}/> Date range</button>
        </div>

        <div className="card" style={{padding: 0}}>
          <div className="tx-head">
            <span></span>
            <span>Description</span>
            <span>Category</span>
            {isGroup ? <span>Member</span> : <span>Date</span>}
            <span style={{textAlign:'right'}}>Amount</span>
            <span></span>
          </div>
          {grouped.length === 0 && (
            <div style={{padding: 40, textAlign: 'center', color: 'var(--fg-muted)', fontFamily: 'VT323, monospace', fontSize: 18}}>
              No entries match. Try clearing filters.
            </div>
          )}
          {grouped.map(g => (
            <div key={g.date}>
              <div className="tx-divider">
                <span>{D.formatDate(g.date)}</span>
                <span className="tx-divider__total">{g.items.length} entries · {privacy ? '•••' : D.usd(g.dayTotal)}</span>
              </div>
              {g.items.map(t => {
                const cat = D.catById(t.cat);
                return (
                  <div key={t.id} className="tx-row">
                    <span className="tx-row__dot" style={{background: cat.color}}></span>
                    <span className="tx-row__desc">{t.desc}</span>
                    <span className="tx-row__cat" style={{color: cat.color}}>▸ {cat.name}</span>
                    {isGroup ?
                      <span className="tx-row__who row" style={{gap: 8}}>
                        <Avatar initial={t.who[0]} color={t.who === 'María' ? '#c79828' : '#b8491f'} size={20}/>
                        {t.who}
                      </span>
                      :
                      <span className="tx-row__date">{D.formatDate(t.date)}</span>
                    }
                    <span className={'tx-row__amt tx-row__amt--' + (t.amount > 0 ? 'income' : 'expense')}>
                      {privacy ? '••••••' : (t.amount > 0 ? '+' : '−') + '$' + Math.abs(t.amount).toFixed(2)}
                    </span>
                    <button className="tx-row__menu"><Icon name="menu" size={12}/></button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============ CATEGORIES ============
  window.PageCategories = function PageCategories({ onAdd }) {
    const byCat = D.aggregateByCat(D.personalTx);
    const income = D.categories.filter(c => c.income);

    return (
      <div className="page">
        <div className="page__head">
          <div className="page__title-wrap">
            <div className="page__eyebrow">Personal · Categories</div>
            <h1 className="page__title">How you label your money.</h1>
            <p className="page__sub">System categories ship warm. Add your own any time.</p>
          </div>
          <div className="page__actions">
            <button className="btn btn--primary" onClick={onAdd}><Icon name="plus" size={12}/> New category</button>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap: 14, marginBottom: 18}}>
          <span className="eyebrow" style={{color:'var(--accent)'}}>— Expenses</span>
          <span style={{flex: 1, height: 2, background:'var(--border-1)'}}></span>
        </div>
        <div className="cat-grid">
          {byCat.map(c => (
            <div key={c.id} className="cat-card">
              <div className="cat-card__icon" style={{'--cat-color': c.color, background: c.color}}>
                <Icon name={c.icon} size={20} color="#f7e4c9"/>
              </div>
              <div className="cat-card__name">{c.name}</div>
              <div className="cat-card__meta">
                <span>{D.usd(c.spent)}</span>
                <span>/ {D.usd(c.budget)}</span>
              </div>
              <div className="bar__track">
                <div className="bar__fill" style={{width: Math.min(100, c.spent/c.budget*100) + '%', '--bar-color': c.color}}></div>
              </div>
            </div>
          ))}
          <div className="cat-card cat-card--add" onClick={onAdd}>
            <Icon name="plus" size={24}/>
            <span style={{fontFamily:'Silkscreen', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase'}}>Add category</span>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap: 14, margin: '32px 0 18px'}}>
          <span className="eyebrow" style={{color:'var(--accent)'}}>— Income</span>
          <span style={{flex: 1, height: 2, background:'var(--border-1)'}}></span>
        </div>
        <div className="cat-grid">
          {income.map(c => (
            <div key={c.id} className="cat-card">
              <div className="cat-card__icon" style={{background: c.color}}>
                <Icon name={c.icon} size={20} color="#f7e4c9"/>
              </div>
              <div className="cat-card__name">{c.name}</div>
              <div className="cat-card__meta">
                <span>Income</span>
                <span style={{color:'var(--sage-500)'}}>✓ Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============ GROUPS ============
  window.PageGroups = function PageGroups({ onCreate, setCtx, setPage }) {
    return (
      <div className="page">
        <div className="page__head">
          <div className="page__title-wrap">
            <div className="page__eyebrow">Shared · Family groups</div>
            <h1 className="page__title">Shared ledgers.</h1>
            <p className="page__sub">Split rent, trips, weekly groceries — all warm, all on paper.</p>
          </div>
          <div className="page__actions">
            <button className="btn btn--primary" onClick={onCreate}><Icon name="plus" size={12}/> New group</button>
          </div>
        </div>

        <div className="group-grid">
          {D.groups.map(g => (
            <div key={g.id} className="group-card" onClick={() => { setCtx(g.id); setPage('group-dashboard'); }}>
              <div className="group-card__top">
                <div className="group-card__badge" style={{background: g.color}}>{g.initial}</div>
                <span className="chip chip--status chip--featured">{g.role}</span>
              </div>
              <h3 className="group-card__title">{g.name}</h3>
              <div className="group-card__members-row">
                <span style={{fontFamily:'VT323, monospace', fontSize: 15, color:'var(--fg-muted)'}}>{g.members} members</span>
                <span className="group-card__avatar-stack">
                  {D.members.slice(0, g.members).map((m, i) => <Avatar key={i} initial={m.initial} color={m.color} size={22}/>)}
                </span>
              </div>
              <div className="group-card__footer">
                <span>Spent this month</span>
                <span className="group-card__total">{D.usd(g.monthSpent)}</span>
              </div>
            </div>
          ))}
          <div className="group-card" style={{borderStyle:'dashed', display:'grid', placeItems:'center', boxShadow:'none', cursor:'pointer', color:'var(--fg-muted)', minHeight: 220}} onClick={onCreate}>
            <div style={{textAlign:'center'}}>
              <Icon name="plus" size={32}/>
              <div style={{fontFamily:'Silkscreen', fontSize: 11, letterSpacing:'0.1em', marginTop: 10, textTransform:'uppercase'}}>Create new group</div>
            </div>
          </div>
        </div>

        <div className="card" style={{marginTop: 28}}>
          <div className="card__eyebrow"><Icon name="mail" size={10}/> Pending invitations</div>
          <div style={{padding: '16px 0', fontFamily:'VT323, monospace', color:'var(--fg-muted)', fontSize: 17}}>
            <span style={{color:'var(--accent)'}}>→</span> Abuela (abuela@familia.es) — invited to "Roma 2026" · 2 days ago
            <button className="btn btn--ghost btn--sm" style={{marginLeft: 12}}>Resend</button>
          </div>
        </div>
      </div>
    );
  };

  // ============ GROUP MEMBERS ============
  window.PageMembers = function PageMembers({ onInvite }) {
    return (
      <div className="page">
        <div className="page__head">
          <div className="page__title-wrap">
            <div className="page__eyebrow">Casa Mendoza · Members</div>
            <h1 className="page__title">Who's on the ledger.</h1>
            <p className="page__sub">Three so far. Room for more.</p>
          </div>
          <div className="page__actions">
            <button className="btn btn--primary" onClick={onInvite}><Icon name="mail" size={12}/> Invite member</button>
          </div>
        </div>

        <div className="card" style={{padding: 0}}>
          {D.members.map(m => (
            <div key={m.id} className="member-row">
              <Avatar initial={m.initial} color={m.color} size={40}/>
              <div>
                <div className="member-name">{m.name}</div>
                <div className="member-email">{m.email}</div>
              </div>
              <div style={{fontFamily:'VT323, monospace', fontSize: 15, color:'var(--fg-muted)', textAlign:'right'}}>
                <div>Joined {m.joined}</div>
                <div>Spent {D.usd(m.thisMonth)}</div>
              </div>
              <div style={{display:'flex', gap: 8, alignItems:'center'}}>
                <span className="member-role">{m.role}</span>
                <button className="iconbtn" style={{width: 30, height: 30}}><Icon name="settings" size={12}/></button>
              </div>
            </div>
          ))}
        </div>

        <div className="term-card" style={{marginTop: 20}}>
          <span className="line"><span className="prompt">casa-mendoza ~$</span> invite --email mom@mendoza.cafe</span>
          <span className="line"><span className="ok">→</span> Invitation sent. Expires in 7 days.</span>
          <span className="line"><span className="prompt">_</span><span className="cursor" style={{background:'#e8a76b'}}></span></span>
        </div>
      </div>
    );
  };

  // ============ PROFILE ============
  window.PageProfile = function PageProfile({ theme, setTheme }) {
    return (
      <div className="page">
        <div className="page__head">
          <div className="page__title-wrap">
            <div className="page__eyebrow">Account</div>
            <h1 className="page__title">Your settings.</h1>
            <p className="page__sub">Simple, warm, yours.</p>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 20}}>
          <div className="card card--paper-surface">
            <div style={{display:'flex', gap: 18, alignItems:'center', marginBottom: 20}}>
              <div style={{width: 72, height: 72, background:'var(--ember-500)', border:'3px solid var(--earth-950)', display:'grid', placeItems:'center', fontFamily:'Silkscreen', fontSize: 32, color:'var(--paper)'}}>D</div>
              <div>
                <div style={{fontFamily:'Newsreader, serif', fontStyle:'italic', fontWeight: 600, fontSize: 32, color:'var(--earth-900)'}}>David Kowalski</div>
                <div style={{fontFamily:'VT323, monospace', fontSize: 17, color:'var(--earth-700)'}}>david@kowalski.dev</div>
              </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 14}}>
              <div className="field">
                <div className="field__label">Display name</div>
                <input className="input" defaultValue="David Kowalski" style={{background:'var(--paper-2)', color:'var(--ink)'}}/>
              </div>
              <div className="field">
                <div className="field__label">Email</div>
                <input className="input" defaultValue="david@kowalski.dev" style={{background:'var(--paper-2)', color:'var(--ink)'}}/>
              </div>
              <button className="btn btn--primary" style={{alignSelf:'flex-start', marginTop: 6}}>Save changes</button>
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap: 20}}>
            <div className="card">
              <div className="card__eyebrow"><Icon name="sun" size={10}/> Appearance</div>
              <div className="card__title">Theme</div>
              <div className="type-toggle" style={{marginTop: 14}}>
                <button className={'type-toggle__btn' + (theme === 'dark' ? ' is-on' : '')} onClick={() => setTheme('dark')}>● Dark</button>
                <button className={'type-toggle__btn' + (theme === 'paper' ? ' is-on' : '')} onClick={() => setTheme('paper')}>○ Paper</button>
              </div>
              <p style={{fontFamily:'Newsreader, serif', fontStyle:'italic', fontSize: 15, color:'var(--fg-2)', marginTop: 16}}>
                Dark is the hero direction. Paper is warm cream — for long ledger reading.
              </p>
            </div>

            <div className="card">
              <div className="card__eyebrow"><Icon name="settings" size={10}/> Preferences</div>
              <div style={{display:'flex', flexDirection:'column', gap: 10, marginTop: 14, fontFamily:'Geist, sans-serif', fontSize: 14, color:'var(--fg-2)'}}>
                <label style={{display:'flex', justifyContent:'space-between', padding: '8px 0', borderBottom:'1px dashed var(--border-1)'}}>
                  <span>Default currency</span>
                  <b style={{color:'var(--accent)'}}>USD</b>
                </label>
                <label style={{display:'flex', justifyContent:'space-between', padding: '8px 0', borderBottom:'1px dashed var(--border-1)'}}>
                  <span>First day of month</span>
                  <b style={{color:'var(--fg-1)'}}>1st</b>
                </label>
                <label style={{display:'flex', justifyContent:'space-between', padding: '8px 0', borderBottom:'1px dashed var(--border-1)'}}>
                  <span>Notifications</span>
                  <b style={{color:'var(--sage-500)'}}>Email only</b>
                </label>
                <label style={{display:'flex', justifyContent:'space-between', padding: '8px 0'}}>
                  <span>Data export</span>
                  <a style={{color:'var(--accent)'}}>Download all (CSV)</a>
                </label>
              </div>
            </div>

            <button className="btn btn--ghost" style={{color:'var(--danger)', borderColor:'var(--danger)', alignSelf:'flex-start'}}>
              <Icon name="close" size={12}/> Delete account
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============ LOGIN ============
  window.PageLogin = function PageLogin({ onEnter }) {
    const [mode, setMode] = useState('login');
    return (
      <div className="auth">
        <div className="auth__poster crt grain">
          <div>
            <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 40}}>
              <img src="assets/matere-mark.svg" style={{width: 40, height: 40, imageRendering:'pixelated', filter:'brightness(0) invert(1)'}} />
              <span style={{fontFamily:'Silkscreen', fontSize: 15, letterSpacing:'0.14em', color:'var(--paper)'}}>MATERE · FIN</span>
            </div>
            <div style={{fontFamily:'Silkscreen', fontSize: 11, letterSpacing:'0.16em', color:'var(--paper)', opacity: 0.8, marginBottom: 24}}>— V 0.1 · APRIL 2026</div>
            <h1 className="auth__poster-title">Dinero<br/>con alma<br/>retro.</h1>
            <p className="auth__poster-sub">
              Registra gastos personales y presupuestos familiares. Hecho un píxel a la vez, con cuidado por el detalle.
            </p>
          </div>
          <div style={{display:'flex', alignItems:'center', gap: 10, fontFamily:'VT323, monospace', fontSize: 17, color:'var(--paper)'}}>
            <span className="pip pip--live"></span>
            <span>Secure · JWT · Self-hosted</span>
          </div>
          <svg className="auth__big-pixel" viewBox="0 0 16 16" shapeRendering="crispEdges" fill="#1a0f08">
            <path d="M7 2 H9 V3 H11 V4 H12 V5 H13 V7 H14 V9 H13 V11 H12 V12 H11 V13 H9 V14 H7 V13 H5 V12 H4 V11 H3 V9 H2 V7 H3 V5 H4 V4 H5 V3 H7 Z M7 4 V5 H5 V7 H4 V9 H5 V11 H7 V12 H9 V11 H11 V9 H12 V7 H11 V5 H9 V4 Z" />
          </svg>
        </div>

        <div className="auth__form-wrap">
          <form className="auth__form" onSubmit={e => { e.preventDefault(); onEnter(); }}>
            <h2 className="auth__form-title">{mode === 'login' ? 'Welcome back.' : 'Create account.'}</h2>
            <p className="auth__form-sub">{mode === 'login' ? 'Sign in to pick up where you left off.' : 'Start tracking in under a minute.'}</p>

            <div className="auth__tabs">
              <button type="button" className={'auth__tab' + (mode === 'login' ? ' is-on' : '')} onClick={() => setMode('login')}>Log in</button>
              <button type="button" className={'auth__tab' + (mode === 'signup' ? ' is-on' : '')} onClick={() => setMode('signup')}>Sign up</button>
            </div>

            {mode === 'signup' && (
              <div className="field">
                <div className="field__label">Name</div>
                <input className="input" placeholder="Your name" defaultValue="David Kowalski"/>
              </div>
            )}
            <div className="field">
              <div className="field__label">Email</div>
              <input className="input" type="email" placeholder="you@email.com" defaultValue="david@kowalski.dev"/>
            </div>
            <div className="field">
              <div className="field__label">Password</div>
              <input className="input" type="password" placeholder="••••••••" defaultValue="password1234"/>
            </div>

            {mode === 'login' && (
              <div style={{display:'flex', justifyContent:'space-between', fontFamily:'VT323, monospace', fontSize: 15, color:'var(--fg-muted)'}}>
                <label style={{cursor:'pointer'}}>
                  <input type="checkbox" defaultChecked style={{accentColor:'var(--accent)'}}/> Remember me
                </label>
                <a style={{color:'var(--accent)'}}>Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn btn--primary" style={{width: '100%', justifyContent:'center', marginTop: 8}}>
              {mode === 'login' ? 'Sign in' : 'Create account'} <Icon name="arrow_right" size={12}/>
            </button>

            <div style={{textAlign:'center', fontFamily:'Silkscreen', fontSize: 9, letterSpacing: '0.14em', color:'var(--fg-muted)', marginTop: 8}}>
              — OR —
            </div>
            <button type="button" className="btn btn--ghost" style={{width:'100%', justifyContent:'center'}}>
              <Icon name="github" size={12}/> Continue with GitHub
            </button>
          </form>
        </div>
      </div>
    );
  };

})();
