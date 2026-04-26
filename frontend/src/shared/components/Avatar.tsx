import React from 'react';

interface AvatarProps {
  initial: string;
  color?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  initial,
  color = '#b8491f',
  size = 32
}) => {
  const fontSize = Math.round(size * 0.42);

  return (
    <div
      className="grid place-items-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: color,
        border: '2px solid #1a0f08',
        fontFamily: 'Silkscreen, monospace',
        fontSize,
        color: '#f7e4c9',
        imageRendering: 'pixelated',
      }}
    >
      {initial}
    </div>
  );
};
