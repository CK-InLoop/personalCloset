interface AvatarProps {
  top?: string;
  bottom?: string;
  onePiece?: string;
  className?: string;
}

export default function Avatar({ top, bottom, onePiece, className }: AvatarProps) {
  return (
    <div className={`relative ${className} bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center`}>
      {/* Model Image */}
      <img
        src="/model-removebg-preview.png"
        alt="Model"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {onePiece ? (
        <img src={onePiece} alt="One Piece" className="absolute inset-0 w-full h-full object-contain" />
      ) : (
        <>
          {top && <img src={top} alt="Top" className="absolute top-0 left-0 w-full h-1/2 object-contain" />}
          {bottom && <img src={bottom} alt="Bottom" className="absolute bottom-0 left-0 w-full h-1/2 object-contain" />}
        </>
      )}
    </div>
  );
}
