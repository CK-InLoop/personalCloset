import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ClothingItem {
  id: string;
  imageUrl: string;
  category: 'top' | 'bottom' | 'one-piece';
  name: string;
}

interface ClosetProps {
  clothingItems: ClothingItem[];
  setClothingItems: React.Dispatch<React.SetStateAction<ClothingItem[]>>;
}

export default function Closet({ clothingItems, setClothingItems }: ClosetProps) {
  const [activeCategory, setActiveCategory] = useState<'top' | 'bottom' | 'one-piece'>('top');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png']
    },
    onDrop: (acceptedFiles) => {
      // Handle file upload
      const newItems = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: URL.createObjectURL(file),
        category: activeCategory,
        name: file.name.replace(/\.[^/.]+$/, '')
      }));
      setClothingItems([...clothingItems, ...newItems]);
    }
  });

  const filteredItems = clothingItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['top', 'bottom', 'one-piece'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as any)}
              className={`${
                activeCategory === category
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Clothing Items */}
      <div className="relative
        before:absolute before:left-0 before:top-0 before:bottom-0 before:w-8 before:bg-gradient-to-r before:from-gray-100 before:to-transparent before:z-10
        after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-gray-100 after:to-transparent after:z-10
      ">
        <div 
          className="flex space-x-4 overflow-x-auto py-4 px-2 scrollbar-hide"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }}
        >
          {/* Add New Item */}
          <div 
            {...getRootProps()} 
            className="flex-shrink-0 w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
          >
            <input {...getInputProps()} />
            <div className="text-center p-2">
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-xs text-gray-500">Add {activeCategory}</span>
            </div>
          </div>

          {/* Clothing Items */}
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
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
      </div>
    </div>
  );
}
