import type React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true
}) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for gradients */}
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#1d4ed8', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="magnifyingGlassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#059669', stopOpacity: 1}} />
            </linearGradient>
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Shield Background */}
          <path
            d="M20 15 L20 45 Q20 65, 35 75 L50 85 Q55 88, 60 85 L75 75 Q90 65, 90 45 L90 15 Q90 10, 85 10 L25 10 Q20 10, 20 15 Z"
            fill="url(#shieldGradient)"
            filter="url(#dropShadow)"
          />

          {/* Shield Border Highlight */}
          <path
            d="M20 15 L20 45 Q20 65, 35 75 L50 85 Q55 88, 60 85 L75 75 Q90 65, 90 45 L90 15 Q90 10, 85 10 L25 10 Q20 10, 20 15 Z"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Worry Free Text on Shield */}
          <text x="55" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
            Worry
          </text>
          <text x="55" y="48" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
            Free
          </text>

          {/* Green Smile on Shield */}
          <path
            d="M35 55 Q55 65, 75 55"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Magnifying Glass Circle */}
          <circle
            cx="140"
            cy="40"
            r="25"
            fill="none"
            stroke="url(#magnifyingGlassGradient)"
            strokeWidth="6"
            filter="url(#dropShadow)"
          />

          {/* Magnifying Glass Handle */}
          <line
            x1="158"
            y1="58"
            x2="175"
            y2="75"
            stroke="url(#magnifyingGlassGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#dropShadow)"
          />

          {/* Car Inside Magnifying Glass */}
          <g transform="translate(125, 28)">
            {/* Car Body */}
            <path
              d="M5 8 C5 6, 7 5, 9 5 L21 5 C23 5, 25 6, 25 8 L25 18 C25 20, 23 21, 21 21 L9 21 C7 21, 5 20, 5 18 Z"
              fill="#10b981"
            />

            {/* Car Windows */}
            <rect
              x="7"
              y="7"
              width="16"
              height="6"
              rx="1"
              fill="#34d399"
            />

            {/* Car Wheels */}
            <circle cx="10" cy="20" r="2.5" fill="#374151" />
            <circle cx="20" cy="20" r="2.5" fill="#374151" />

            {/* Happy Car Face */}
            <circle cx="11" cy="12" r="1" fill="#064e3b" />
            <circle cx="19" cy="12" r="1" fill="#064e3b" />
            <path
              d="M13 15 Q15 17, 17 15"
              fill="none"
              stroke="#064e3b"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-blue-600 leading-tight ${textSizes[size]}`}>
            Worry Free
          </span>
          <span className={`font-bold text-gray-600 leading-tight ${textSizes[size]}`}>
            Car Finder
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
