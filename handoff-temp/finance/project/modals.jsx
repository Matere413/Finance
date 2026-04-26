/* Modals: New transaction, New group, Invite */
(function() {
  const { useState } = React;
  const D = window.FinData;

  window.NewTxModal = function NewTxModal({ onClose, onSave, isGroup }) {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [cat, setCat] = useState('food');
    const [date, setDate] = useState('2026-04-22');
    const cats = D.categories.filter(c => type === 'income' ? c.income : !c.income);
    const catObj = D.catById(cat) || cats[0];

    return (
      <Modal title="New transaction" onClose={onClose} footer={
        <>
          <button className="btn btn--ghost btn--sm" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary btn--sm" onClick={() => onSave({ type, amount, desc, cat, date })}>
            <Icon name="check" size={12}/> Save entry
          </button>
        </>
      }>
        <div className="type-toggle" style={{width: '100%'}}>
          <button className={'type-toggle__btn' + (type === 'expense' ? ' is-on' : '')} style={{flex: 1}} onClick={() => { setType('expense'); setCat('food'); }}>− Expense</button>
          <button className={'type-toggle__btn type-toggle__btn--income' + (type === 'income' ? ' is-on' : '')} style={{flex: 1}} onClick={() => { setType('income'); setCat('salary'); }}>+ Income</button>
        </div>

        <div className="field">
          <div className="field__label">Amount (USD)</div>
          <div style={{display:'flex', alignItems:'center', gap: 10}}>
            <span style={{fontFamily:'Pixelify Sans', fontWeight: 700, fontSize: 28, color: type === 'income' ? 'var(--sage-500)' : 'var(--fg-muted)'}}>
              {type === 'income' ? '+$' : '−$'}
            </span>
            <input className="input input--money" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{flex: 1}}/>
          </div>
        </div>

        <div className="field">
          <div className="field__label">Description</div>
          <input className="input" placeholder="Corner market, coffee, rent..." value={desc} onChange={e => setDesc(e.target.value)}/>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14}}>
          <div className="field">
            <div className="field__label">Category</div>
            <select className="select" value={cat} onChange={e => setCat(e.target.value)}>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <div className="field__label">Date</div>
            <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)}/>
          </div>
        </div>

        <div style={{display:'flex', gap: 10, alignItems:'center', padding: 12, background:'var(--bg-2)', border:'2px dashed var(--border-1)'}}>
          <div style={{width: 32, height: 32, background: catObj.color, border:'2px solid var(--earth-950)', display:'grid', placeItems:'center'}}>
            <Icon name={catObj.icon} size={16} color="#f7e4c9"/>
          </div>
          <div style={{flex: 1, fontFamily:'VT323, monospace', fontSize: 15, color:'var(--fg-2)'}}>
            Preview: <b style={{color:'var(--fg-1)'}}>{desc || '—'}</b> · {catObj.name} · <span style={{color: type==='income'?'var(--sage-500)':'var(--accent)'}}>{type === 'income' ? '+' : '−'}${amount || '0.00'}</span>
          </div>
        </div>

        {isGroup && (
          <div className="field">
            <div className="field__label">Paid by</div>
            <select className="select">
              <option>David Kowalski (you)</option>
              <option>María Mendoza</option>
              <option>Lucas Kowalski</option>
            </select>
          </div>
        )}
      </Modal>
    );
  };

  window.NewGroupModal = function NewGroupModal({ onClose, onSave }) {
    const [name, setName] = useState('');
    const [emails, setEmails] = useState('');
    return (
      <Modal title="Create family group" onClose={onClose} footer={
        <>
          <button className="btn btn--ghost btn--sm" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary btn--sm" onClick={() => onSave(name)}>
            <Icon name="plus" size={12}/> Create group
          </button>
        </>
      }>
        <p style={{fontFamily:'Newsreader, serif', fontStyle:'italic', fontSize: 16, color:'var(--fg-2)', margin: 0}}>
          Groups let you track shared expenses with family or roommates. You own the group and can invite anyone by email.
        </p>
        <div className="field">
          <div className="field__label">Group name</div>
          <input className="input" placeholder="Casa Mendoza, Roma 2026, Depto..." value={name} onChange={e => setName(e.target.value)} autoFocus/>
        </div>
        <div className="field">
          <div className="field__label">Invite members (optional)</div>
          <textarea className="textarea input" rows="3" placeholder="one@email.com, two@email.com..." value={emails} onChange={e => setEmails(e.target.value)}/>
        </div>
        <div style={{display:'flex', gap: 10, fontFamily:'Silkscreen', fontSize: 10, letterSpacing:'0.1em', color:'var(--fg-muted)', textTransform:'uppercase'}}>
          <span>Pick a color —</span>
          {['#b8491f','#c79828','#7a9a4a','#9c3a1a','#6b6a3a','#e8703a'].map(c => (
            <span key={c} style={{width: 20, height: 20, background: c, border:'2px solid var(--earth-950)', cursor:'pointer'}}></span>
          ))}
        </div>
      </Modal>
    );
  };

  window.InviteModal = function InviteModal({ onClose, onSend }) {
    const [email, setEmail] = useState('');
    return (
      <Modal title="Invite to Casa Mendoza" onClose={onClose} footer={
        <>
          <button className="btn btn--ghost btn--sm" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary btn--sm" onClick={() => onSend(email)}>
            <Icon name="mail" size={12}/> Send invitation
          </button>
        </>
      }>
        <p style={{fontFamily:'Newsreader, serif', fontStyle:'italic', fontSize: 16, color:'var(--fg-2)', margin: 0}}>
          They'll get an email with a link to join. Invitation expires in 7 days.
        </p>
        <div className="field">
          <div className="field__label">Email</div>
          <input className="input" type="email" placeholder="name@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus/>
        </div>
        <div className="field">
          <div className="field__label">Role</div>
          <select className="select"><option>Member — can add and view</option><option>Viewer — read only (coming soon)</option></select>
        </div>
        <div className="term-card" style={{fontSize: 15}}>
          <span className="line"><span className="prompt">casa-mendoza ~$</span> preview-invite {email || '<email>'}</span>
          <span className="line"><span className="ok">→</span> Subject: "David invited you to Casa Mendoza"</span>
          <span className="line" style={{color:'var(--fg-muted)'}}>Expires · 2026-04-29 · 7 days</span>
        </div>
      </Modal>
    );
  };

})();
