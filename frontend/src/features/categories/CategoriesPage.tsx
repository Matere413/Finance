import React, { useState, useEffect } from 'react';
import { Icon } from '@components/Icon';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { Input } from '@components/Input';
import { Category } from '@types';
import { api } from '@api/axios';
import { useToastStore } from '@stores/toastStore';

export const CategoriesPage: React.FC = () => {
  const { addToast } = useToastStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const expenseCategories = categories.filter((c) => !c.is_income);
  const incomeCategories = categories.filter((c) => c.is_income);

  const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined) return '0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
            Personal · Categories
          </div>
          <h1 className="font-display font-bold text-4xl text-fg-1 tracking-tight">
            How you label your money.
          </h1>
          <p className="font-serif text-base text-fg-2 mt-2 italic">
            System categories ship warm. Add your own any time.
          </p>
        </div>
        <div className="flex gap-2.5 items-center flex-shrink-0">
          <Button icon="plus" onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}>
            New category
          </Button>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="flex items-center gap-3.5 mb-4">
        <span className="font-pixel text-xs tracking-widest text-accent uppercase">— Expenses</span>
        <span className="flex-1 h-0.5 bg-border-1" />
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {expenseCategories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 bg-bg-1 border-[2.5px] border-border-2 cursor-pointer flex flex-col gap-2.5 transition-all duration-fast hover:border-earth-950 hover:shadow-2 hover:-translate-x-0.5 hover:-translate-y-0.5"
            onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
          >
            <div
              className="w-10 h-10 border-2 border-earth-950 grid place-items-center text-paper"
              style={{ background: cat.color }}
            >
              <Icon name={cat.icon || 'folder'} size={20} color="#f7e4c9" />
            </div>
            <div className="font-display font-bold text-lg text-fg-1">{cat.name}</div>
            <div className="font-mono text-sm text-fg-muted flex justify-between">
              <span>$0.00</span>
              <span>/ ${formatCurrency(cat.budget)}</span>
            </div>
            <div className="h-5 bg-bg-0 border-2 border-earth-950 relative overflow-hidden">
              <div
                className="h-full transition-all duration-slow"
                style={{
                  width: `${Math.min(100, (0 / (parseFloat(cat.budget?.toString() || '1') || 1)) * 100)}%`,
                  background: `repeating-linear-gradient(90deg, ${cat.color} 0 6px, rgba(0,0,0,0.3) 6px 8px)`,
                }}
              />
            </div>
          </div>
        ))}
        <div
          className="p-5 border-[2.5px] border-dashed border-border-2 grid place-items-center gap-2.5 text-fg-muted cursor-pointer min-h-[140px] hover:text-accent hover:border-accent"
          onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
        >
          <Icon name="plus" size={24} />
          <span className="font-pixel text-xs tracking-widest uppercase">Add category</span>
        </div>
      </div>

      {/* Income Section */}
      <div className="flex items-center gap-3.5 my-8 mb-4">
        <span className="font-pixel text-xs tracking-widest text-accent uppercase">— Income</span>
        <span className="flex-1 h-0.5 bg-border-1" />
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {incomeCategories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 bg-bg-1 border-[2.5px] border-border-2 cursor-pointer flex flex-col gap-2.5 transition-all duration-fast hover:border-earth-950 hover:shadow-2 hover:-translate-x-0.5 hover:-translate-y-0.5"
            onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
          >
            <div
              className="w-10 h-10 border-2 border-earth-950 grid place-items-center text-paper"
              style={{ background: cat.color }}
            >
              <Icon name={cat.icon || 'folder'} size={20} color="#f7e4c9" />
            </div>
            <div className="font-display font-bold text-lg text-fg-1">{cat.name}</div>
            <div className="font-mono text-sm text-fg-muted flex justify-between">
              <span>Income</span>
              <span className="text-sage-500">✓ Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCategories();
          addToast(editingCategory ? 'Category updated' : 'Category created');
        }}
        category={editingCategory}
      />
    </div>
  );
};

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#b8491f',
    icon: 'folder',
    is_income: false,
    budget: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
        icon: category.icon || 'folder',
        is_income: category.is_income,
        budget: category.budget?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        color: '#b8491f',
        icon: 'folder',
        is_income: false,
        budget: '',
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        budget: formData.is_income ? undefined : (formData.budget ? parseFloat(formData.budget) : undefined),
      };

      if (category) {
        await api.put(`/categories/${category.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }
      onSuccess();
    } catch (err) {
      setError('Failed to save category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = ['#b8491f', '#c79828', '#7a9a4a', '#e8703a', '#9c3a1a', '#6b6a3a', '#5a2e15', '#f2c75a'];
  const icons = ['folder', 'heart', 'star', 'home', 'book', 'flame', 'arrow_right', 'sparkle'];

  return (
    <Modal
      title={category ? 'Edit Category' : 'New Category'}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="cat-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : category ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="cat-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-danger/10 border-2 border-danger p-3 text-danger font-mono text-sm">
            {error}
          </div>
        )}

        <Input
          label="Name"
          placeholder="e.g., Groceries"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="flex gap-2 border-[2.5px] border-border-2 w-fit">
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

        {!formData.is_income && (
          <Input
            label="Budget (optional)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
        )}

        <div className="flex flex-col gap-2">
          <label className="font-pixel text-2xs tracking-wide text-fg-2 uppercase">
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 border-2 ${
                  formData.color === color ? 'border-earth-950 shadow-1' : 'border-border-2'
                }`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-pixel text-2xs tracking-wide text-fg-2 uppercase">
            Icon
          </label>
          <div className="flex gap-2 flex-wrap">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`w-10 h-10 border-2 grid place-items-center ${
                  formData.icon === icon ? 'border-earth-950 shadow-1 bg-bg-2' : 'border-border-2'
                }`}
              >
                <Icon name={icon} size={16} />
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
