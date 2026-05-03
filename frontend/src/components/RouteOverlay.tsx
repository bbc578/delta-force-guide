import type { RouteDetail } from '../types';
import { RISK_COLORS, RISK_LABELS, DIFFICULTY_LABELS } from '../types';

interface Props {
  route: RouteDetail;
  isActive: boolean;
  onClick: () => void;
}

export default function RouteOverlay({ route, isActive, onClick }: Props) {
  if (!route.waypoints || route.waypoints.length < 2) return null;

  const riskColor = RISK_COLORS[route.risk_level] || '#9ca3af';
  const riskLabel = RISK_LABELS[route.risk_level] || route.risk_level;
  const diffLabel = DIFFICULTY_LABELS[route.difficulty] || '未知';

  // Create SVG path from waypoints
  const points = route.waypoints.map((wp) => `${wp.x},${wp.y}`).join(' ');

  return (
    <g onClick={onClick} className="cursor-pointer">
      {/* Route line */}
      <polyline
        points={points}
        fill="none"
        stroke={isActive ? riskColor : `${riskColor}66`}
        strokeWidth={isActive ? 3 : 2}
        strokeDasharray={isActive ? 'none' : '8,4'}
        style={{ transition: 'all 0.3s' }}
      />

      {/* Waypoint dots */}
      {route.waypoints.map((wp, i) => (
        <g key={wp.id}>
          <circle
            cx={wp.x}
            cy={wp.y}
            r={i === 0 ? 6 : i === route.waypoints.length - 1 ? 6 : 4}
            fill={i === 0 ? '#22c55e' : i === route.waypoints.length - 1 ? '#ef4444' : riskColor}
            stroke={isActive ? '#fff' : 'none'}
            strokeWidth={isActive ? 2 : 0}
            opacity={isActive ? 1 : 0.7}
          />
          {/* Labels for start/end points */}
          {isActive && (i === 0 || i === route.waypoints.length - 1) && (
            <text
              x={wp.x}
              y={wp.y - 10}
              textAnchor="middle"
              fill="#fff"
              fontSize="8"
              fontWeight="bold"
              style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
            >
              {wp.label}
            </text>
          )}
        </g>
      ))}

      {/* Route info tooltip (shown when active) */}
      {isActive && (
        <g>
          <rect
            x={route.waypoints[0].x + 8}
            y={route.waypoints[0].y - 30}
            width={120}
            height={45}
            rx={4}
            fill="#242424"
            stroke={riskColor}
            strokeWidth={1}
            opacity={0.95}
          />
          <text
            x={route.waypoints[0].x + 14}
            y={route.waypoints[0].y - 18}
            fill="#fff"
            fontSize="9"
            fontWeight="bold"
          >
            {route.name}
          </text>
          <text
            x={route.waypoints[0].x + 14}
            y={route.waypoints[0].y - 6}
            fill={riskColor}
            fontSize="7"
          >
            {diffLabel} · {riskLabel}
          </text>
          <text
            x={route.waypoints[0].x + 14}
            y={route.waypoints[0].y + 6}
            fill="#d4a017"
            fontSize="7"
          >
            💰 {route.estimated_value?.toLocaleString()}
          </text>
        </g>
      )}
    </g>
  );
}
