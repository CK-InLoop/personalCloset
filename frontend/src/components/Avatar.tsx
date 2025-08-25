interface AvatarProps {
  top?: string;
  bottom?: string;
  onePiece?: string;
  className?: string;
}

export default function Avatar({ top, bottom, onePiece, className = '' }: AvatarProps) {
  return (
    <div className={`relative w-64 h-96 mx-auto ${className}`}>
      <div className="absolute inset-0 bg-white rounded-lg shadow-md flex items-center justify-center p-4">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 200 300" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Body Outline - More proportional */}
          <g id="body">
            {/* Head */}
            <circle cx="100" cy="60" r="30" fill="#F3D2BD" />
            
            {/* Neck */}
            <rect x="95" y="90" width="10" height="10" fill="#F3D2BD" />
            
            {/* Torso */}
            <path 
              d="M80 100H120V180H80V100Z" 
              fill="#F3D2BD"
              stroke="#D1A58C"
              strokeWidth="2"
            />
            
            {/* Arms */}
            <path 
              d="M120 110L160 90" 
              stroke="#F3D2BD" 
              strokeWidth="16" 
              strokeLinecap="round"
            />
            <path 
              d="M80 110L40 90" 
              stroke="#F3D2BD" 
              strokeWidth="16" 
              strokeLinecap="round"
            />
            
            {/* Legs */}
            <path 
              d="M80 180L70 260" 
              stroke="#F3D2BD" 
              strokeWidth="16" 
              strokeLinecap="round"
            />
            <path 
              d="M120 180L130 260" 
              stroke="#F3D2BD" 
              strokeWidth="16" 
              strokeLinecap="round"
            />
          </g>

          {/* One Piece Outfit */}
          {onePiece && (
            <g id="one-piece">
              <image 
                href={onePiece} 
                x="40" 
                y="90" 
                width="120" 
                height="180"
                preserveAspectRatio="xMidYMid meet"
                clipPath="url(#bodyClip)"
              />
            </g>
          )}
          
          {/* Top */}
          {top && !onePiece && (
            <g id="top">
              <image 
                href={top} 
                x="40" 
                y="90" 
                width="120" 
                height="90"
                preserveAspectRatio="xMidYMid meet"
                clipPath="url(#torsoClip)"
              />
            </g>
          )}
          
          {/* Bottom */}
          {bottom && !onePiece && (
            <g id="bottom">
              <image 
                href={bottom} 
                x="50" 
                y="150" 
                width="100" 
                height="120"
                preserveAspectRatio="xMidYMid meet"
                clipPath="url(#legsClip)"
              />
            </g>
          )}
          
          {/* Clip paths for better image masking */}
          <defs>
            <clipPath id="bodyClip">
              <rect x="40" y="90" width="120" height="180" rx="10" />
            </clipPath>
            <clipPath id="torsoClip">
              <rect x="40" y="90" width="120" height="90" rx="5" />
            </clipPath>
            <clipPath id="legsClip">
              <path d="M50 150H150V270H50V150Z" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}
