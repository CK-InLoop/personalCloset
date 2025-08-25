import React, { useRef } from 'react';

interface ClothingItem {
  id: string;
  imageUrl: string;
  category: 'top' | 'bottom' | 'one-piece';
  name: string;
}

interface ClothingScrollerProps {
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
  category: 'top' | 'bottom';
}

const ClothingScroller: React.FC<ClothingScrollerProps> = ({ items, onSelectItem, category }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filteredItems = items.filter(item => item.category === category);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-4 w-full max-w-2xl mx-auto">
            <div className="relative group">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="flex-shrink-0 w-32 h-32 border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button 
          onClick={() => scroll('left')}
          className="absolute top-1/2 -translate-y-1/2 left-0 w-8 h-8 bg-white bg-opacity-75 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 disabled:opacity-0"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll('right')}
          className="absolute top-1/2 -translate-y-1/2 right-0 w-8 h-8 bg-white bg-opacity-75 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 disabled:opacity-0"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ClothingScroller;
