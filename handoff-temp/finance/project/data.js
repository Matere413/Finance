/* Seed data & helpers for the Matere finance prototype */
window.FinData = (function() {
  const usd = (n) => {
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    return sign + '$' + abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const categories = [
    { id: 'food',     name: 'Food',          color: '#b8491f', icon: 'heart',   income: false, budget: 650 },
    { id: 'transit',  name: 'Transit',       color: '#c79828', icon: 'arrow_right', income: false, budget: 200 },
    { id: 'home',     name: 'Home',          color: '#7a9a4a', icon: 'home',    income: false, budget: 1400 },
    { id: 'fun',      name: 'Fun',           color: '#e8703a', icon: 'star',    income: false, budget: 300 },
    { id: 'health',   name: 'Health',        color: '#9c3a1a', icon: 'sparkle', income: false, budget: 150 },
    { id: 'shopping', name: 'Shopping',      color: '#6b6a3a', icon: 'folder',  income: false, budget: 250 },
    { id: 'utils',    name: 'Utilities',     color: '#5a2e15', icon: 'flame',   income: false, budget: 180 },
    { id: 'salary',   name: 'Salary',        color: '#7a9a4a', icon: 'check',   income: true,  budget: 0 },
    { id: 'freelance',name: 'Freelance',     color: '#c79828', icon: 'terminal',income: true,  budget: 0 },
    { id: 'gift',     name: 'Gift',          color: '#f2c75a', icon: 'star',    income: true,  budget: 0 },
  ];

  const personalTx = [
    { id: 1,  date: '2026-04-22', desc: 'Corner market — weekly groceries', cat: 'food',    amount: -78.40, who: 'me' },
    { id: 2,  date: '2026-04-22', desc: 'Coffee at Elba',                   cat: 'food',    amount: -4.80,  who: 'me' },
    { id: 3,  date: '2026-04-21', desc: 'Metro card reload',                cat: 'transit', amount: -40.00, who: 'me' },
    { id: 4,  date: '2026-04-21', desc: 'Vinyl — Broadcast "Haha Sound"',   cat: 'fun',     amount: -32.00, who: 'me' },
    { id: 5,  date: '2026-04-20', desc: 'Freelance — logo revisions',       cat: 'freelance', amount: 420.00, who: 'me' },
    { id: 6,  date: '2026-04-19', desc: 'Electricity bill',                 cat: 'utils',   amount: -58.20, who: 'me' },
    { id: 7,  date: '2026-04-18', desc: 'Pharmacy — prescription',          cat: 'health',  amount: -22.50, who: 'me' },
    { id: 8,  date: '2026-04-18', desc: 'Thrift — denim jacket',            cat: 'shopping',amount: -45.00, who: 'me' },
    { id: 9,  date: '2026-04-17', desc: 'Dinner at Luvi',                   cat: 'food',    amount: -68.90, who: 'me' },
    { id: 10, date: '2026-04-16', desc: 'Rent — April',                     cat: 'home',    amount: -1350.00, who: 'me' },
    { id: 11, date: '2026-04-15', desc: 'Salary — April',                   cat: 'salary',  amount: 3850.00, who: 'me' },
    { id: 12, date: '2026-04-14', desc: 'Cinema + snacks',                  cat: 'fun',     amount: -28.00, who: 'me' },
    { id: 13, date: '2026-04-13', desc: 'Internet bill',                    cat: 'utils',   amount: -52.00, who: 'me' },
    { id: 14, date: '2026-04-12', desc: 'Bookstore — two novels',           cat: 'shopping',amount: -38.40, who: 'me' },
    { id: 15, date: '2026-04-10', desc: 'Farmers market',                   cat: 'food',    amount: -42.60, who: 'me' },
  ];

  const groupTx = [
    { id: 101, date: '2026-04-22', desc: 'Supermarket — weekly run',         cat: 'food',     amount: -142.30, who: 'María' },
    { id: 102, date: '2026-04-21', desc: 'Kids school supplies',             cat: 'shopping', amount: -88.00,  who: 'David' },
    { id: 103, date: '2026-04-21', desc: 'Gas — Corolla',                    cat: 'transit',  amount: -60.20,  who: 'María' },
    { id: 104, date: '2026-04-20', desc: 'Pizza night',                      cat: 'food',     amount: -38.50,  who: 'David' },
    { id: 105, date: '2026-04-19', desc: 'Rent — April (family apt.)',       cat: 'home',     amount: -1800.00,who: 'María' },
    { id: 106, date: '2026-04-18', desc: 'Pediatrician visit',               cat: 'health',   amount: -75.00,  who: 'David' },
    { id: 107, date: '2026-04-17', desc: 'María — salary transfer',          cat: 'salary',   amount: 2900.00, who: 'María' },
    { id: 108, date: '2026-04-17', desc: 'David — salary transfer',          cat: 'salary',   amount: 3850.00, who: 'David' },
    { id: 109, date: '2026-04-16', desc: 'Water bill',                       cat: 'utils',    amount: -38.00,  who: 'David' },
    { id: 110, date: '2026-04-15', desc: 'Weekend trip — train tickets',     cat: 'fun',      amount: -124.00, who: 'María' },
    { id: 111, date: '2026-04-14', desc: 'Dinner with parents',              cat: 'food',     amount: -86.40,  who: 'David' },
    { id: 112, date: '2026-04-12', desc: 'Amazon — kids books',              cat: 'shopping', amount: -52.60,  who: 'María' },
  ];

  const groups = [
    { id: 'casa',   name: 'Casa Mendoza',   members: 3, color: '#b8491f', initial: 'C', role: 'Owner', monthSpent: 2518.30 },
    { id: 'viaje',  name: 'Roma 2026',      members: 4, color: '#c79828', initial: 'R', role: 'Member', monthSpent: 1240.00 },
  ];

  const members = [
    { id: 1, name: 'David Kowalski', email: 'david@kowalski.dev', initial: 'D', color: '#b8491f', role: 'Owner',  joined: '2024-02-12', thisMonth: 982.40 },
    { id: 2, name: 'María Mendoza',  email: 'maria@mendoza.cafe', initial: 'M', color: '#c79828', role: 'Member', joined: '2024-02-14', thisMonth: 1535.90 },
    { id: 3, name: 'Lucas Kowalski', email: 'lucas@km.family',    initial: 'L', color: '#7a9a4a', role: 'Member', joined: '2024-06-03', thisMonth: 0 },
  ];

  // Aggregations
  function aggregateByCat(txList) {
    const map = {};
    txList.forEach(t => {
      if (t.amount < 0) {
        map[t.cat] = (map[t.cat] || 0) + Math.abs(t.amount);
      }
    });
    return categories
      .filter(c => !c.income)
      .map(c => ({ ...c, spent: map[c.id] || 0 }))
      .sort((a, b) => b.spent - a.spent);
  }

  function totals(txList) {
    let income = 0, expense = 0;
    txList.forEach(t => {
      if (t.amount > 0) income += t.amount;
      else expense += Math.abs(t.amount);
    });
    return { income, expense, balance: income - expense };
  }

  function groupByDate(txList) {
    const map = {};
    txList.forEach(t => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return Object.entries(map)
      .sort(([a],[b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        date,
        items,
        dayTotal: items.reduce((s,t) => s + t.amount, 0),
      }));
  }

  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    const today = new Date('2026-04-22T00:00:00');
    const diff = Math.floor((today - d) / (1000*60*60*24));
    if (diff === 0) return 'Today · Apr 22';
    if (diff === 1) return 'Yesterday · Apr 21';
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate();
  }

  return {
    usd, categories, personalTx, groupTx, groups, members,
    aggregateByCat, totals, groupByDate, formatDate,
    catById: (id) => categories.find(c => c.id === id),
  };
})();
