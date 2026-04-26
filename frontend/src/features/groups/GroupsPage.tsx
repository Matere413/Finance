import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@components/Icon';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { Input } from '@components/Input';
import { Avatar } from '@components/Avatar';
import { Group, GroupMember } from '@types';
import { api } from '@api/axios';
import { useToastStore } from '@stores/toastStore';

export const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [groupsRes] = await Promise.all([
        api.get('/groups'),
      ]);
      setGroups(groupsRes.data);

      // Fetch members for each group
      const membersPromises = groupsRes.data.map((g: Group) =>
        api.get(`/groups/${g.id}/members`).catch(() => ({ data: [] }))
      );
      const membersResults = await Promise.all(membersPromises);
      const allMembers = membersResults.flatMap((r) => r.data);
      setMembers(allMembers);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getGroupMembers = (groupId: number) => {
    return members.filter((m) => m.group_id === groupId).slice(0, 4);
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
            Shared · Family groups
          </div>
          <h1 className="font-display font-bold text-4xl text-fg-1 tracking-tight">
            Shared ledgers.
          </h1>
          <p className="font-serif text-base text-fg-2 mt-2 italic">
            Split rent, trips, weekly groceries — all warm, all on paper.
          </p>
        </div>
        <div className="flex gap-2.5 items-center flex-shrink-0">
          <Button icon="plus" onClick={() => setIsModalOpen(true)}>
            New group
          </Button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-5 bg-bg-1 border-[3px] border-earth-950 shadow-2 cursor-pointer transition-all duration-fast hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_#1a0f08] theme-paper:bg-paper-2 theme-paper:border-earth-700 theme-paper:shadow-[4px_4px_0_#5a2e15]"
            onClick={() => navigate('/')}
          >
            <div className="flex justify-between items-start gap-3 mb-3.5">
              <div
                className="w-12 h-12 border-[3px] border-earth-950 pixelated grid place-items-center font-pixel text-base text-paper"
                style={{ background: group.color }}
              >
                {group.initial}
              </div>
              <span className="font-pixel text-2xs tracking-widest uppercase px-2 py-1 border-2 border-earth-950 bg-wheat-500 text-earth-950">
                {group.role || 'Member'}
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl tracking-tight text-fg-1 mb-3">
              {group.name}
            </h3>
            <div className="flex items-center gap-1 mb-3">
              <span className="font-mono text-md text-fg-muted">
                {group.member_count} members
              </span>
              <span className="inline-flex ml-1">
                {getGroupMembers(group.id).map((m, i) => (
                  <span key={i} className="-ml-1 border-2 border-earth-950 first:ml-0">
                    <Avatar
                      initial={m.user?.full_name?.charAt(0) || 'U'}
                      color={i === 0 ? '#c79828' : '#b8491f'}
                      size={22}
                    />
                  </span>
                ))}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3.5 border-t border-dashed border-border-1 font-mono text-sm text-fg-muted">
              <span>Spent this month</span>
              <span className="text-fg-1 font-display font-bold text-xl">
                ${formatCurrency(0)}
              </span>
            </div>
          </div>
        ))}
        <div
          className="border-[3px] border-dashed border-border-2 grid place-items-center gap-2.5 text-fg-muted min-h-56 cursor-pointer shadow-none hover:text-accent hover:border-accent"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="text-center">
            <Icon name="plus" size={32} />
            <div className="font-pixel text-xs tracking-widest uppercase mt-2.5">
              Create new group
            </div>
          </div>
        </div>
      </div>

      {/* Pending Invitations Card */}
      <Card className="mt-7">
        <div className="font-pixel text-2xs tracking-wider text-accent uppercase mb-2 flex items-center gap-2">
          <Icon name="mail" size={10} /> Pending invitations
        </div>
        <div className="py-4 font-mono text-base text-fg-muted">
          <span className="text-accent mr-1">→</span> No pending invitations
        </div>
      </Card>

      {/* New Group Modal */}
      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchData();
          addToast('Group created successfully');
        }}
      />
    </div>
  );
};

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#b8491f',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/groups', formData);
      onSuccess();
    } catch (err) {
      setError('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = ['#b8491f', '#c79828', '#7a9a4a', '#e8703a', '#9c3a1a', '#6b6a3a', '#5a2e15', '#f2c75a'];

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <Modal
      title="New Group"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="group-form" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="group-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-danger/10 border-2 border-danger p-3 text-danger font-mono text-sm">
            {error}
          </div>
        )}

        <Input
          label="Name"
          placeholder="e.g., Casa Mendoza"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Description"
          placeholder="What is this group for?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

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

        {formData.name && (
          <div className="mt-4">
            <label className="font-pixel text-2xs tracking-wide text-fg-2 uppercase mb-2 block">
              Preview
            </label>
            <div className="flex items-center gap-3 p-3 bg-bg-1 border-2 border-border-2">
              <div
                className="w-10 h-10 border-2 border-earth-950 grid place-items-center font-pixel text-sm text-paper"
                style={{ background: formData.color }}
              >
                {getInitial(formData.name)}
              </div>
              <div>
                <div className="font-display font-bold text-lg text-fg-1">{formData.name}</div>
                {formData.description && (
                  <div className="font-mono text-sm text-fg-muted">{formData.description}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
