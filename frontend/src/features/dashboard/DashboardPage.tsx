import React, { useState, useEffect } from 'react';
import { Icon } from '@components/Icon';
import { Stat } from '@components/Stat';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { Input } from '@components/Input';
import { Chip } from '@components/Chip';
import { Transaction, CategorySpending, DashboardStats } from '@types';
import { api } from '@api/axios';
import { useAuthStore } from '@stores/authStore';
import { useThemeStore } from '@stores/themeStore';
import { useToastStore } from '@stores/toastStore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { addToast } = useToastStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<CategorySpending[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, categoriesRes, txRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/categories'),
        api.get('/transactions?limit=5'),
      ]);
      setStats(statsRes.data);
      setCategories(categoriesRes.data);
      setRecentTransactions(txRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getMaxSpent = () => {
    if (categories.length === 0) return 1;
    return Math.max(...categories.map((c) => c.spent), 1);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  const savingsRate = stats?.income && stats.income > 0
    ? Math.round(((parseFloat(stats.income.toString()) - parseFloat(stats.expenses.toString())) / parseFloat(stats.income.toString())) * 100)
    : 0;

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
            Personal · April 2026
          </div>
          <h1 className="font-display font-bold text-4xl text-fg-1 tracking-tight">
            Good morning, {user?.full_name?.split(' ')[0] || 'there'}.
          </h1>
          <p className="font-serif text-base text-fg-2 mt-2 italic">
            Here's how your month is tracking.
          </p>
        </div>
        <div className="flex gap-2.5 items-center flex-shrink-0">
          <Button variant="ghost" size="sm" icon="download">
            Export
          </Button>
          <Button icon="plus" onClick={() => setIsModalOpen(true)}>
            New transaction
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <Stat
          eyebrow={<><Icon name="pixel_diamond" size={10} /> Balance</>}
          value={formatCurrency(stats?.balance || 0)}
          variant={(stats?.balance || 0) >= 0 ? 'success' : 'danger'}
          delta="+12.4% vs March"
          deltaDir="up"
          hideMoney={privacy}
        />
        <Stat
          eyebrow={<><Icon name="arrow_right" size={10} /> Income</>}
          value={formatCurrency(stats?.income || 0)}
          variant="success"
          delta="2 sources"
          deltaDir="up"
          hideMoney={privacy}
        />
        <Stat
          eyebrow={<><Icon name="flame" size={10} /> Expenses</>}
          value={formatCurrency(stats?.expenses || 0)}
          variant="ember"
          delta="-4.1% vs March"
          deltaDir="down"
          hideMoney={privacy}
        />
        <Stat
          eyebrow={<><Icon name="star" size={10} /> Savings rate</>}
          value={`${savingsRate}%`}
          currency=""
          variant="success"
          delta={savingsRate > 20 ? 'on track' : 'tight month'}
          deltaDir={savingsRate > 20 ? 'up' : 'down'}
          hideMoney={privacy}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-5">
        {/* Spending by Category */}
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div>
              <div className="font-pixel text-2xs tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
                <Icon name="terminal" size={10} /> Spending by category
              </div>
              <div className="font-display font-bold text-xl tracking-tight">
                Where the month went
              </div>
            </div>
            <span className="font-pixel text-2xs tracking-wider uppercase px-2 py-1 border-2 border-earth-950 bg-wheat-500 text-earth-950">
              APR · 2026
            </span>
          </div>
          <div className="flex flex-col gap-3.5 mt-4">
            {categories.slice(0, 7).map((cat) => (
              <div key={cat.category_id} className="grid grid-cols-[140px_1fr_92px] gap-3.5 items-center">
                <div className="font-pixel text-2xs tracking-wider text-fg-2 uppercase flex items-center gap-2">
                  <span
                    className="w-3 h-3 border-[1.5px] border-earth-950 flex-shrink-0"
                    style={{ background: cat.color }}
                  />
                  {cat.category_name}
                </div>
                <div className="h-5 bg-bg-0 border-2 border-earth-950 relative overflow-hidden theme-paper:bg-[#e0c898] theme-paper:border-earth-700">
                  <div
                    className="h-full transition-all duration-slow"
                    style={{
                      width: `${(cat.spent / getMaxSpent()) * 100}%`,
                      background: `repeating-linear-gradient(90deg, ${cat.color} 0 6px, rgba(0,0,0,0.3) 6px 8px)`,
                    }}
                  />
                </div>
                <div className="font-display font-bold text-base text-fg-1 text-right">
                  {privacy ? '••••' : `$${formatCurrency(cat.spent)}`}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Top Category Card */}
          <Card variant="paper">
            <div className="font-pixel text-2xs tracking-wider text-ember-600 uppercase mb-2">
              Top category
            </div>
            <div className="font-serif italic text-2xl leading-tight text-ink mt-2 mb-2">
              {categories[0]?.category_name} took <b>${formatCurrency(categories[0]?.spent || 0)}</b> this month.
            </div>
            <div className="font-body text-sm text-earth-700">
              That's {categories[0]?.spent && stats?.expenses ? Math.round((categories[0].spent / parseFloat(stats.expenses.toString())) * 100) : 0}% of all expenses. Budget was ${formatCurrency(categories[0]?.budget || 0)}.
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="font-pixel text-2xs tracking-wider text-accent uppercase mb-2.5 flex items-center gap-2">
              <Icon name="book" size={10} /> Recent activity
            </div>
            <div className="flex flex-col mt-2.5">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-[10px_1fr_auto] gap-3 items-center py-2.5 border-b border-dashed border-border-1 last:border-b-0"
                >
                  <span
                    className="w-2.5 h-2.5 border-[1.5px] border-earth-950"
                    style={{ background: tx.category?.color || '#666' }}
                  />
                  <div>
                    <div className="font-body text-sm text-fg-1 font-medium">{tx.description}</div>
                    <div className="font-mono text-sm text-fg-muted">
                      {formatDate(tx.date)} · {tx.category?.name}
                    </div>
                  </div>
                  <div
                    className={`font-display font-bold text-base ${
                      parseFloat(tx.amount) > 0 ? 'text-sage-500' : 'text-fg-1'
                    }`}
                  >
                    {privacy
                      ? '•••'
                      : `${parseFloat(tx.amount) > 0 ? '+' : '-'}$${formatCurrency(Math.abs(parseFloat(tx.amount)))}`}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Terminal Card */}
      <div className="mt-5 bg-earth-950 text-earth-100 py-4 px-5 border-[3px] border-earth-950 shadow-ember font-mono text-base">
        <div className="block mb-1">
          <span className="text-accent font-bold mr-1.5">finance@matere ~$</span>
          month-summary --context personal
        </div>
        <div className="block mb-1">
          <span className="text-sage-300">→</span> Net position:{' '}
          <b style={{ color: (stats?.balance || 0) >= 0 ? '#a9c674' : '#d9551f' }}>
            ${formatCurrency(stats?.balance || 0)}
          </b>{' '}
          · {(stats?.balance || 0) >= 0 ? 'surplus' : 'deficit'}
        </div>
        <div className="block mb-1">
          <span className="text-wheat-300">!</span> {categories[0]?.category_name} is{' '}
          {categories[0]?.budget
            ? Math.round((categories[0].spent / categories[0].budget) * 100)
            : 0}% of budget
        </div>
        <div className="block">
          <span className="text-accent mr-1.5">_</span>
          <span className="w-[0.55em] h-4 bg-[#e8a76b] inline-block align-text-bottom animate-blink" />
        </div>
      </div>

      {/* New Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchDashboardData();
          addToast('Transaction created successfully');
        }}
      />
    </div>
  );
};

// Transaction Modal Component
interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<{ id: number; name: string; color: string }[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    is_income: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

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
          <Button type="submit" form="transaction-form" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-danger/10 border-2 border-danger p-3 text-danger font-mono text-sm">
            {error}
          </div>
        )}

        <div className="flex border-[2.5px] border-border-2 w-fit">
          <button
            type="button"
            className={`px-4 py-2 font-pixel text-xs tracking-widest uppercase ${
              !formData.is_income
                ? 'bg-accent text-paper'
                : 'bg-bg-1 text-fg-2'
            }`}
            onClick={() => setFormData({ ...formData, is_income: false })}
          >
            Expense
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-pixel text-xs tracking-widest uppercase ${
              formData.is_income
                ? 'bg-sage-500 text-paper'
                : 'bg-bg-1 text-fg-2'
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
