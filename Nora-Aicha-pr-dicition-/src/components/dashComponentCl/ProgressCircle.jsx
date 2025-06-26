import React from 'react';

const ProgressCircle = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  color = '#e7d5ac',
  bgColor = '#2D3250'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <svg width={size} height={size} className="transform -rotate-360">
      {/* Cercle d’arrière-plan */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Cercle de progression */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="none"
      />
      {/* Texte centré */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={color}
        fontSize="14"
        fontWeight="600"
      >
        {percentage?.toFixed(1).replace('.', ',')}<tspan fontSize="11">%</tspan>
      </text>
    </svg>
  );
};

export default ProgressCircle;
