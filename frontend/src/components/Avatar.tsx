interface AvatarProps {
  top?: string;
  bottom?: string;
  onePiece?: string;
}

export default function Avatar({ top, bottom, onePiece }: AvatarProps) {
  return (
    <div className="relative w-64 h-96 mx-auto">
      {/* Base Avatar */}
      <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
        <svg 
          className="w-full h-full text-gray-400" 
          viewBox="0 0 100 150" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base body outline */}
          <path 
            d="M50 15C60.5 15 69 23.5 69 34V40C69 50.5 60.5 59 50 59C39.5 59 31 50.5 31 40V34C31 23.5 39.5 15 50 15Z" 
            fill="#E5E7EB"
          />
          <path 
            d="M35 140V125C35 112.85 44.85 103 57 103H43C30.85 103 21 112.85 21 125V140" 
            stroke="#9CA3AF" 
            strokeWidth="2"
          />
          
          {/* One Piece Outfit */}
          {onePiece && (
            <image 
              href={onePiece} 
              x="15" 
              y="25" 
              width="70" 
              height="100"
              preserveAspectRatio="xMidYMid meet"
              className="z-10"
            />
          )}
          
          {/* Top */}
          {top && !onePiece && (
            <image 
              href={top} 
              x="15" 
              y="25" 
              width="70" 
              height="50"
              preserveAspectRatio="xMidYMid meet"
              className="z-10"
            />
          )}
          
          {/* Bottom */}
          {bottom && !onePiece && (
            <image 
              href={bottom} 
              x="15" 
              y="75" 
              width="70" 
              height="65"
              preserveAspectRatio="xMidYMid meet"
              className="z-10"
            />
          )}
          
          {/* Head */}
          <circle cx="50" cy="30" r="15" fill="#F3D2BD" />
        </svg>
      </div>
    </div>
  );
}
