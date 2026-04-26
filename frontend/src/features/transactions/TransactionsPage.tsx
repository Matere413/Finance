import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@components/Icon';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { Chip } from '@components/Chip';
import { Modal } from '@components/Modal';
import { Input } from '@components/Input';
import { Transaction, Category } from '@types';
import { api } from '@api/axios';
import { useToastStore } from '@stores/toastStore';
import { Avatar } from '@components/Avatar';

interface GroupedTransactions {
  date: string;
  items: Transaction[];
  dayTotal: number;
}

export const TransactionsPage: React.FC = () => {
  const { addToast } = useToastStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, catRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/categories'),
      ]);
      setTransactions(txRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filter === 'income') {
      result = result.filter((t) => parseFloat(t.amount) > 0);
    } else if (filter === 'expense') {
      result = result.filter((t) => parseFloat(t.amount) < 0);
    }
    if (search) {
      result = result.filter((t) =>
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [transactions, filter, search]);

  const groupedByDate = useMemo(() => {
    const map: Record<string, Transaction[]> = {};
    filteredTransactions.forEach((t) => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({
        date,
        items,
        dayTotal: items.reduce((sum, t) => sum + parseFloat(t.amount), 0),
      }));
  }, [filteredTransactions]);

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  const getCategoryColor = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || '#666';
  };

  const getCategoryName = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="font-pixel text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-7 gap-6">
        <div>
          <div className="font-pixel text-xs tracking-widest text-accent uppercase mb-2.5">
            {isGroup ? 'Group · Transactions' : 'Personal · Transactions'}
          </div>
          <h1 className="font-display font-bold text-4xl text-fg-1 tracking-tight">
            {filteredTransactions.length} entries this month.
          </h1>
          <p className="font-serif text-base text-fg-2 mt-2 italic">
            All in one ledger. Chunky, crisp, unlost.
          </p>
        </div>
        <div className="flex gap-2.5 items-center flex-shrink-0">
          <Button variant="ghost" size="sm" icon="download">
            CSV
          </Button>
          <Button icon="plus" onClick={() => setIsModalOpen(true)}>
            Add entry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2.5 flex-wrap py-3.5 mb-4">
        <div className="flex-1 min-w-60 flex items-center gap-2.5 bg-bg-1 border-[2.5px] border-border-2 py-2 px-3">
          <Icon name="search" size={14} color="var(--fg-muted)" />
          <input
            type="text"
            placeholder="Search descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-fg-1 font-mono text-base placeholder:text-fg-muted"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="bg-none border-none cursor-pointer text-fg-muted hover:text-accent p-1"
            >
              <Icon name="close" size={10} />
            </button>
          )}
        </div>
        {(['all', 'income', 'expense'] as const).map((k) => (
          <Chip
            key={k}
            isActive={filter === k}
            onClick={() => setFilter(k)}
          >
            {k.toUpperCase()}
          </Chip>
        ))}
        <Chip icon="folder">Category</Chip>
        <Chip icon="book">Date range</Chip>
      </div>

      {/* Transactions List */}
      <Card padding="sm">
        <div className="grid grid-cols-[20px_1.2fr_1fr_110px_120px_32px] gap-4 px-4 py-2.5 font-pixel text-2xs tracking-widest text-fg-muted uppercase border-b-2 border-border-1">
          <span></span>
          <span>Description</span>
          <span>Category</span>
          {isGroup ? <span>Member</span> : <span>Date</span>}
          <span className="text-right">Amount</span>
          <span></span>
        </div>

        {groupedByDate.length === 0 && (
          <div className="p-10 text-center text-fg-muted font-mono text-lg">
            No entries match. Try clearing filters.
          </div>
        )}

        {groupedByDate.map((group) => (
          <div key={group.date}>
            <div className="px-4 py-4 pb-2 font-pixel text-xs tracking-widest text-accent uppercase border-b-2 border-dashed border-border-1 bg-bg-1 flex justify-between">
              <span>{formatDate(group.date)}</span>
              <span className="text-fg-muted font-mono text-sm">
                {group.items.length} entries · {privacy ? '•••' : `$${formatCurrency(group.dayTotal)}`}
              </span>
            </div>
            {group.items.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[20px_1.2fr_1fr_110px_120px_32px] gap-4 px-4 py-3.5 items-center border-b border-border-1 cursor-pointer hover:bg-bg-2 transition-colors duration-fast last:border-b-0"
              >
                <span
                  className="w-2.5 h-2.5 border-[1.5px] border-earth-950"
                  style={{ background: getCategoryColor(t.category_id) }}
                />
                <span className="font-body text-sm text-fg-1 font-medium truncate">{t.description}</span>
                <span
                  className="font-pixel text-2xs tracking-wider text-fg-2 uppercase"
                  style={{ color: getCategoryColor(t.category_id) }}
                >
                  ▸ {getCategoryName(t.category_id)}
                </span>
                {isGroup ? (
                  <span className="flex items-center gap-2 font-mono text-sm text-fg-muted">
                    <Avatar initial={t.user?.full_name?.charAt(0) || 'U'} color="#c79828" size={20} />
                    {t.user?.full_name?.split(' ')[0] || 'Unknown'}
                  </span>
                ) : (
                  <span className="font-mono text-sm text-fg-muted">{formatDate(t.date)}</span>
                )}
                <span
                  className={`font-display font-bold text-lg text-right ${
                    parseFloat(t.amount) > 0 ? 'text-sage-500' : 'text-fg-1'
                  }`}
                >
                  {privacy
                    ? '••••••'
                    : `${parseFloat(t.amount) > 0 ? '+' : '−'}$${formatCurrency(Math.abs(parseFloat(t.amount)))}`}
                </span>
                <button className="bg-none border-none text-fg-muted cursor-pointer p-1 hover:text-accent">
                  <Icon name="menu" size={12} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </Card>

      {/* New Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchData();
          addToast('Transaction created successfully');
        }}
        categories={categories}
      />
    </div>
  );
};

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categories,
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    is_income: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/transactions', {
        description: formData.description,
        amount: formData.is_income ? formData.amount : `-${formData.amount}`,
        date: formData.date,
        category_id: parseInt(formData.category_id),
      });
      onSuccess();
    } catch (err) {
      setError('Failed to create transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="New Transaction"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="tx-form" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="tx-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-danger/10 border-2 border-danger p-3 text-danger font-mono text-sm">
            {error}
          </div>
        )}

        <div className="flex border-[2.5px] border-border-2 w-fit">
          <button
            type="button"
            className={`px-4 py-2 font-pixel text-xs tracking-widest uppercase ${
              !formData.is_income ? 'bg-accent text-paper' : 'bg-bg-1 text-fg-2'
            }`}
            onClick={() => setFormData({ ...formData, is_income: false })}
          >
            Expense
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-pixel text-xs tracking-widest uppercase ${
              formData.is_income ? 'bg-sage-500 text-paper' : 'bg-bg-1 text-fg-2'
            }`}
            onClick={() => setFormData({ ...formData, is_income: true })}
          >
            Income
          </button>
        </div>

        <Input
          label="Description"
          placeholder="What was this for?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="font-pixel text-2xs tracking-wide text-fg-2 uppercase">
            Category
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            required
            className="bg-bg-0 border-[2.5px] border-border-2 text-fg-1 py-2.5 px-3.5 font-body text-base outline-none transition-colors duration-fast focus:border-accent w-full cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16' shape-rendering='crispEdges' fill='%23b8491f'><path d='M3 6 L8 11 L13 6 L12 5 L8 9 L4 5 Z'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: '36px',
            }}
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};
