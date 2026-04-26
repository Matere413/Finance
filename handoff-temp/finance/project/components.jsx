/* Shared components */
(function() {
  const { useState, useEffect } = React;

  // Pixel icon renderer
  window.Icon = function Icon({ name, size = 16, color = 'currentColor' }) {
    const body = window.MatereIcons[name];
    if (!body) return null;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width={size} height={size}
           shapeRendering="crispEdges" fill={color} style={{display:'inline-block', flexShrink: 0}}
           dangerouslySetInnerHTML={{ __html: body }} />
    );
  };

  window.Avatar = function Avatar({ initial, color = '#b8491f', size = 32 }) {
    const fontSize = Math.round(size * 0.42);
    return (
      <div style={{
        width: size, height: size, background: color,
        border: '2px solid #1a0f08',
        display: 'grid', placeItems: 'center',
        fontFamily: 'Silkscreen, monospace',
        fontSize, color: '#f7e4c9',
        imageRendering: 'pixelated',
        flexShrink: 0,
      }}>{initial}</div>
    );
  };

  window.Stat = function Stat({ eyebrow, value, currency = '$', delta, deltaDir, variant, hideMoney }) {
    return (
      <div className="card">
        <div className="stat__eyebrow">{eyebrow}</div>
        <div className={'stat__value' + (variant ? ' stat__value--' + variant : '')}>
          <span className="stat__currency">{currency}</span>
          <span className={hideMoney ? 'money-hidden' : ''}>{value}</span>
        </div>
        {delta && (
          <div className="stat__delta">
            <span className={deltaDir}>{deltaDir === 'up' ? '▲' : '▼'} {delta}</span>
          </div>
        )}
      </div>
    );
  };

  window.Sidebar = function Sidebar({ ctx, setCtx, page, setPage, groups }) {
    const personalItems = [
      { id: 'dashboard',    label: 'Dashboard',    icon: 'home' },
      { id: 'transactions', label: 'Transactions', icon: 'book', count: FinData.personalTx.length },
      { id: 'categories',   label: 'Categories',   icon: 'folder' },
    ];
    const groupItems = [
      { id: 'group-dashboard',    label: 'Group dash',    icon: 'home' },
      { id: 'group-transactions', label: 'Transactions', icon: 'book', count: FinData.groupTx.length },
      { id: 'group-members',      label: 'Members',      icon: 'user', count: FinData.members.length },
    ];
    const sharedItems = [
      { id: 'groups',  label: 'All groups', icon: 'folder' },
      { id: 'profile', label: 'Profile',    icon: 'user' },
    ];
    const currentGroup = FinData.groups.find(g => g.id === ctx);

    return (
      <aside className="side">
        <div className="side__brand">
          <img src="assets/matere-mark.svg" className="side__mark" alt="Matere" />
          <span className="side__word">MATERE · FIN</span>
          <span className="side__tag">V0.1</span>
        </div>

        <div className="ctx">
          <div className="ctx__label">Context</div>
          <div className="ctx__switch">
            <button className={'ctx__item' + (ctx === 'personal' ? ' is-active' : '')}
                    onClick={() => { setCtx('personal'); setPage('dashboard'); }}>
              <span className="ctx__avatar" style={{background:'#b8491f'}}></span>
              Personal
            </button>
            {FinData.groups.map(g => (
              <button key={g.id}
                      className={'ctx__item' + (ctx === g.id ? ' is-active' : '')}
                      onClick={() => { setCtx(g.id); setPage('group-dashboard'); }}>
                <span className="ctx__avatar" style={{background: g.color}}></span>
                {g.name}
                <span className="ctx__members">{g.members}</span>
              </button>
            ))}
          </div>
        </div>

        <nav className="nav">
          {ctx === 'personal' ? (
            <>
              <div className="nav__group-label">Personal</div>
              {personalItems.map(it => (
                <button key={it.id} className={'nav__link' + (page === it.id ? ' is-active' : '')} onClick={() => setPage(it.id)}>
                  <Icon name={it.icon} size={16} /> {it.label}
                  {it.count != null && <span className="nav__count">{it.count}</span>}
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="nav__group-label">{currentGroup?.name}</div>
              {groupItems.map(it => (
                <button key={it.id} className={'nav__link' + (page === it.id ? ' is-active' : '')} onClick={() => setPage(it.id)}>
                  <Icon name={it.icon} size={16} /> {it.label}
                  {it.count != null && <span className="nav__count">{it.count}</span>}
                </button>
              ))}
            </>
          )}

          <div className="nav__group-label" style={{marginTop: 12}}>General</div>
          {sharedItems.map(it => (
            <button key={it.id} className={'nav__link' + (page === it.id ? ' is-active' : '')} onClick={() => setPage(it.id)}>
              <Icon name={it.icon} size={16} /> {it.label}
            </button>
          ))}
        </nav>

        <div className="side__user" onClick={() => setPage('profile')}>
          <div className="side__user-avatar">D</div>
          <div className="side__user-info">
            <div className="side__user-name">David K.</div>
            <div className="side__user-email">david@kowalski.dev</div>
          </div>
          <Icon name="settings" size={14} color="#8a6a4a" />
        </div>
      </aside>
    );
  };

  window.Topbar = function Topbar({ crumbs, theme, setTheme, privacy, setPrivacy, onLogout }) {
    return (
      <div className="topbar">
        <div className="topbar__left">
          <div className="topbar__crumb">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep">/</span>}
                <span className={i === crumbs.length - 1 ? 'cur' : ''}>{c}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="topbar__right">
          <div className="row" style={{gap: 8, fontFamily: 'VT323, monospace', fontSize: 15, color: 'var(--fg-muted)'}}>
            <span className="pip pip--live"></span> APR · 2026
          </div>
          <button className={'iconbtn' + (privacy ? ' is-on' : '')} title="Privacy mode" onClick={() => setPrivacy(!privacy)}>
            <Icon name={privacy ? 'moon' : 'sun'} size={16} />
          </button>
          <button className="iconbtn" title="Theme" onClick={() => setTheme(theme === 'dark' ? 'paper' : 'dark')}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
          </button>
          <button className="iconbtn" title="Sign out" onClick={onLogout}>
            <Icon name="external" size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Tweaks panel
  window.TweaksPanel = function TweaksPanel({ tweaks, setTweak, onClose }) {
    const rows = [
      { key: 'density',  label: 'Density',   opts: [['cozy','Cozy'],['compact','Compact']] },
      { key: 'numbers',  label: 'Numbers font', opts: [['pixel','Pixelify'],['mono','VT323'],['geist','Geist']] },
      { key: 'crt',      label: 'CRT scanlines', opts: [['on','On'],['off','Off']] },
      { key: 'privacy',  label: 'Hide balances', opts: [['off','Off'],['on','On']] },
      { key: 'lang',     label: 'Language',  opts: [['es','ES'],['en','EN']] },
    ];
    return (
      <div className="tweaks-panel">
        <div className="tweaks-panel__head">
          <span>▸ TWEAKS</span>
          <button onClick={onClose} style={{background:'none', border:'none', color:'inherit', cursor:'pointer'}}>
            <Icon name="close" size={10} />
          </button>
        </div>
        <div className="tweaks-panel__body">
          {rows.map(r => (
            <div key={r.key} className="tweak-row">
              <div className="tweak-row__label">{r.label}</div>
              <div className="tweak-row__opts">
                {r.opts.map(([v, lbl]) => (
                  <button key={v} className={'tweak-row__opt' + (tweaks[r.key] === v ? ' is-on' : '')}
                          onClick={() => setTweak(r.key, v)}>{lbl}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Toast
  window.Toast = function Toast({ message, onDone }) {
    useEffect(() => {
      const t = setTimeout(onDone, 2400);
      return () => clearTimeout(t);
    }, []);
    return <div className="toast"><span className="ok">✓</span> {message}</div>;
  };

  // Modal
  window.Modal = function Modal({ title, onClose, children, footer }) {
    useEffect(() => {
      const h = (e) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', h);
      return () => window.removeEventListener('keydown', h);
    }, []);
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal__head">
            <h3 className="modal__title">{title}</h3>
            <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', color:'var(--fg-muted)'}}>
              <Icon name="close" size={14} />
            </button>
          </div>
          <div className="modal__body">{children}</div>
          {footer && <div className="modal__foot">{footer}</div>}
        </div>
      </div>
    );
  };

})();
