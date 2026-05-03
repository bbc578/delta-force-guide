import type { SpawnPoint } from '../types';

interface Props {
  spawn: SpawnPoint;
  isHighlighted: boolean;
}

export default function SpawnMarker({ spawn, isHighlighted }: Props) {
  return (
    <div
      className="absolute transition-all duration-200"
      style={{
        left: `${spawn.x}%`,
        top: `${spawn.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHighlighted ? 15 : 5,
      }}
    >
      {/* Spawn marker - triangle pointing down */}
      <div className="relative group">
        <div
          className="w-0 h-0 transition-all duration-200"
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `12px solid ${isHighlighted ? '#22c55e' : '#22c55e88'}`,
            filter: isHighlighted ? 'drop-shadow(0 0 6px #22c55e)' : 'none',
          }}
        />
        {/* Label */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap bg-[#1a2a0a] border border-[#22c55e44] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="text-[10px] text-[#22c55e] font-medium">{spawn.name}</span>
        </div>
      </div>
    </div>
  );
}
