import type { ExtractionPoint } from '../types';

interface Props {
  extraction: ExtractionPoint;
}

export default function ExtractionMarker({ extraction }: Props) {
  const isSpecial = extraction.type === 'special';

  return (
    <div
      className="absolute"
      style={{
        left: `${extraction.x}%`,
        top: `${extraction.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 4,
      }}
    >
      <div className="relative group">
        {/* Extraction marker - diamond shape */}
        <div
          className="w-4 h-4 rotate-45 transition-all"
          style={{
            backgroundColor: isSpecial ? '#f59e0b88' : '#ef444488',
            border: `2px solid ${isSpecial ? '#f59e0b' : '#ef4444'}`,
            boxShadow: `0 0 8px ${isSpecial ? '#f59e0b44' : '#ef444444'}`,
          }}
        />
        {/* Label */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap bg-[#2a1a1a] border border-[#ef444444] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-[#ef4444] font-medium">{extraction.name}</span>
        </div>
      </div>
    </div>
  );
}
