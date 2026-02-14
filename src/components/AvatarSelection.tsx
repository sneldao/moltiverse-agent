'use client';

import { useState } from 'react';
import { AvatarConfig, AvatarType, AvatarColor, AVATAR_TYPES, AVATAR_COLORS, DEFAULT_AVATAR } from '../world/avatar';

interface AvatarSelectionProps {
  onComplete: (avatar: AvatarConfig) => void;
}

export function AvatarSelection({ onComplete }: AvatarSelectionProps) {
  const [selectedType, setSelectedType] = useState<AvatarType>(DEFAULT_AVATAR.type);
  const [selectedColor, setSelectedColor] = useState<AvatarColor>(DEFAULT_AVATAR.color);
  const [avatarName, setAvatarName] = useState(DEFAULT_AVATAR.name);

  const handleComplete = () => {
    onComplete({
      type: selectedType,
      color: selectedColor,
      name: avatarName || DEFAULT_AVATAR.name,
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Create Your Avatar</h1>
          <p className="text-gray-400">Choose your form and enter the moltTOK</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Avatar Preview */}
          <div className="glass card p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-6xl mb-4">
              {AVATAR_TYPES[selectedType].icon}
            </div>
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
              style={{ 
                background: `linear-gradient(135deg, ${AVATAR_COLORS[selectedColor]}20, ${AVATAR_COLORS[selectedColor]}40)`,
                border: `3px solid ${AVATAR_COLORS[selectedColor]}`,
                boxShadow: `0 0 30px ${AVATAR_COLORS[selectedColor]}40`
              }}
            >
              {AVATAR_TYPES[selectedType].icon}
            </div>
            <p className="mt-4 text-lg font-semibold text-white">{avatarName || DEFAULT_AVATAR.name}</p>
            <p className="text-sm text-gray-400">{AVATAR_TYPES[selectedType].description}</p>
          </div>

          {/* Avatar Options */}
          <div className="space-y-6">
            {/* Avatar Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Avatar Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(AVATAR_TYPES) as AvatarType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedType === type
                        ? `border-${AVATAR_COLORS[selectedColor]} bg-${AVATAR_COLORS[selectedColor]}/10`
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{AVATAR_TYPES[type].icon}</div>
                    <div className="font-semibold text-white capitalize">{type}</div>
                    <div className="text-xs text-gray-400">{AVATAR_TYPES[type].description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Color</label>
              <div className="flex gap-3">
                {(Object.keys(AVATAR_COLORS) as AvatarColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-xl border-2 transition-all ${
                      selectedColor === color
                        ? 'border-white scale-110'
                        : 'border-transparent hover:border-gray-500'
                    }`}
                    style={{
                      backgroundColor: AVATAR_COLORS[color],
                      boxShadow: `0 0 15px ${AVATAR_COLORS[color]}40`
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Avatar Name</label>
              <input
                type="text"
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
              />
            </div>

            {/* Enter Button */}
            <button
              onClick={handleComplete}
              className="w-full btn-primary py-4 text-lg font-semibold"
              style={{
                background: `linear-gradient(135deg, ${AVATAR_COLORS[selectedColor]}, ${AVATAR_COLORS[selectedColor]}88)`
              }}
            >
              Enter moltTOK 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
