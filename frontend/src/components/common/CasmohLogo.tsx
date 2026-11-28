import React from 'react';

interface CasmohLogoProps {
  className?: string;
  clipId?: string;
}

export const CasmohLogo: React.FC<CasmohLogoProps> = ({
  className = 'w-full h-full',
  clipId = 'fr-clip-hdr',
}) => (
  <svg
    viewBox="0 0 220 175"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="CASMOH Logo"
  >
    {/* Left Deep Navy Wing (#001B5E) */}
    <path
      d="M98 92 C82 62, 42 54, 24 22 C23 42, 34 62, 56 74 C36 68, 20 56, 12 40 C13 60, 28 77, 52 86 C34 84, 20 76, 13 64 C16 82, 32 95, 56 99 C40 100, 28 95, 22 87 C27 102, 43 111, 66 111 L98 92 Z"
      fill="#001B5E"
    />
    {/* Eagle Head & Lower Navy Plumage */}
    <path
      d="M104 91 C92 89, 80 94, 72 103 C67 109, 64 116, 65 122 C69 116, 76 113, 84 114 C91 115, 96 121, 102 128 L105 126 C100 118, 95 111, 86 110 C79 109, 73 111, 69 115 C71 108, 76 101, 84 97 C91 93, 99 92, 106 94 L104 91 Z"
      fill="#001B5E"
    />
    {/* Eagle Eye */}
    <path
      d="M84 101 C87 99.5, 91 100, 92.5 101.8 C90.5 103.5, 86.5 103.5, 84 101 Z"
      stroke="#001B5E"
      strokeWidth="1.8"
      fill="#FFFFFF"
    />
    {/* Lower Left Neck Feathers */}
    <path
      d="M84 117 C78 121, 72 124, 66 125 C72 128, 79 127, 86 122 Z"
      fill="#001B5E"
    />
    <path
      d="M90 122 C85 127, 79 130, 73 131 C79 134, 86 132, 92 126 Z"
      fill="#001B5E"
    />
    <path
      d="M96 126 C92 131, 87 134, 82 135 C88 137, 94 135, 98 129 Z"
      fill="#001B5E"
    />

    {/* Right Crimson Red Wing (#D90429) */}
    <path
      d="M114 128 C120 112, 116 94, 117 82 C119 64, 158 56, 186 22 C187 42, 174 62, 152 74 C172 68, 188 56, 196 40 C195 60, 180 77, 156 86 C174 84, 188 76, 195 64 C192 82, 176 95, 152 99 C168 100, 180 95, 186 87 C181 102, 165 111, 142 111 C132 111, 123 118, 114 128 Z"
      fill="#D90429"
    />
    {/* Lower Right Wing Feathers */}
    <path
      d="M124 117 C130 121, 136 124, 142 125 C136 128, 129 127, 122 122 Z"
      fill="#D90429"
    />
    <path
      d="M119 122 C124 127, 130 130, 136 131 C130 134, 123 132, 117 126 Z"
      fill="#D90429"
    />
    <path
      d="M114 127 C118 131, 123 134, 128 135 C122 137, 116 135, 112 129 Z"
      fill="#D90429"
    />

    {/* Left Circular French Tricolor Badge */}
    <g transform="translate(36, 122)">
      <clipPath id={clipId}>
        <circle cx="0" cy="0" r="16" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect x="-16" y="-16" width="10.7" height="32" fill="#001B5E" />
        <rect x="-5.3" y="-16" width="10.6" height="32" fill="#FFFFFF" />
        <rect x="5.3" y="-16" width="10.7" height="32" fill="#D90429" />
      </g>
      <circle cx="0" cy="0" r="16" stroke="#E2E8F0" strokeWidth="1.2" />
    </g>

    {/* Right Circular Moroccan Flag Badge */}
    <g transform="translate(174, 122)">
      <circle cx="0" cy="0" r="16" fill="#D90429" />
      <polygon
        points="0,-9.5 2.3,-2.8 9.2,-2.8 3.6,1.4 5.7,8.1 0,4 -5.7,8.1 -3.6,1.4 -9.2,-2.8 -2.3,-2.8"
        fill="none"
        stroke="#007A3D"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="0" cy="0" r="16" stroke="#E2E8F0" strokeWidth="1.2" />
    </g>
  </svg>
);
