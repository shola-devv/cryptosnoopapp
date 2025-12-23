import React, { useEffect, useState } from 'react';
import { Settings, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const avatarOptions = [
  { id: 1, emoji: '👤', color: '#c750f7', label: 'Degen' },
  { id: 2, emoji: '🎨', color: '#ff6b6b', label: 'Artist' },
  { id: 3, emoji: '🚀', color: '#4ecdc4', label: 'Explorer' },
  { id: 4, emoji: '⚡', color: '#ffd93d', label: 'Energy' },
  { id: 5, emoji: '🌟', color: '#a8e6cf', label: 'Star' }
];

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string | null;
  currentAvatar?: number | null;
  currentUserId?: string | null;
  onSave: (newName: string | null, newAvatarIndex: number | null) => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  currentName,
  currentAvatar,
  currentUserId,
  onSave
}: ProfileModalProps) {
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync props when modal opens - currentAvatar is just the index (0-4)
  useEffect(() => {
    if (isOpen) {
      setNewName(currentName ?? '');
      setSelectedAvatarIndex(currentAvatar ?? 2);
    }
  }, [isOpen, currentName, currentAvatar]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSave = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);

    try {
      // Optimistically update the parent component UI immediately
      onSave(newName.trim(), selectedAvatarIndex);

      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          newUsername: newName.trim(),
          newImage: selectedAvatarIndex
        }),
      });

      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        alert(data.message || 'Failed to update profile.');
        // Revert by calling onSave with original values
        onSave(currentName ?? null, currentAvatar ?? null);
        return;
      }

      // Success - close modal
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Something went wrong while saving your changes.');
      // Revert on error
      onSave(currentName ?? null, currentAvatar ?? null);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
        style={{ boxShadow: '0 20px 60px -10px rgba(199, 80, 247, 0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#c750f7] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Customize Profile
          </h2>
        </div>

        {/* Avatar Selection */}
      <div className="mb-6">
  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
    Choose Avatar
  </Label>
  <div className="grid grid-cols-5 gap-3">
    {avatarOptions.map((avatar, index) => {
      const isSelected = selectedAvatarIndex === index;
      const bgColor = avatar.color + '20';
      return (
        <button
          key={avatar.id}
          onClick={() => setSelectedAvatarIndex(index)}
          className="relative w-full aspect-square rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none overflow-hidden"
          style={{
            backgroundColor: bgColor,
            border: isSelected ? `3px solid ${avatar.color}` : '2px solid transparent',
            boxShadow: isSelected ? `0 0 20px ${avatar.color}40` : 'none'
          }}
          title={avatar.label}
          aria-pressed={isSelected}
        >
          <img
            src={`/profile${index}.png`}
            alt={avatar.label}
            className="w-full h-full object-cover"
          />
          {isSelected && (
            <div
              className="absolute -top-1 -right-1 rounded-full p-0.5 z-10"
              style={{ backgroundColor: avatar.color }}
            >
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </button>
      );
    })}
  </div>
</div>
      

       {/* Preview */}
<div className="mb-6 p-4 rounded-lg bg-purple-50 dark:bg-slate-700">
  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Preview</p>
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
      <img
        src={`/profile${selectedAvatarIndex}.png`}
        alt={avatarOptions[selectedAvatarIndex].label}
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <p className="font-semibold text-slate-800 dark:text-white">
        {newName || 'Your Name'}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {avatarOptions[selectedAvatarIndex].label}
      </p>
    </div>
  </div>
</div>
        {/* Username Input */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
            Username
          </Label>
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border-slate-300 dark:border-slate-600 focus:border-[#c750f7] focus:ring-[#c750f7]"
            placeholder="Enter your name"
            maxLength={30}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {newName.length}/30 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!newName.trim() || isSaving}
            className="flex-1 text-white font-bold border-4 border-[#d575fc] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#c750f7' }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}