import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import Closet from '../components/Closet';
import ClothingScroller from '../components/ClothingScroller';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTop, setSelectedTop] = useState<string>('');
  const [selectedBottom, setSelectedBottom] = useState<string>('');
  const [selectedOnePiece, setSelectedOnePiece] = useState<string>('');
  const [clothingItems, setClothingItems] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSelectItem = (item: any) => {
    if (item.category === 'top') {
      setSelectedTop(item.imageUrl);
      setSelectedOnePiece('');
    } else if (item.category === 'bottom') {
      setSelectedBottom(item.imageUrl);
      setSelectedOnePiece('');
    } else if (item.category === 'one-piece') {
      setSelectedOnePiece(item.imageUrl);
      setSelectedTop('');
      setSelectedBottom('');
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Your Personal Closet</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-gray-700">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10 flex-grow overflow-y-auto">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            {/* Outfit Preview Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-xs h-96">
                  <Avatar 
                    top={selectedTop}
                    bottom={selectedBottom}
                    onePiece={selectedOnePiece}
                    className="w-full h-full"
                  />
                </div>
                
                <ClothingScroller items={clothingItems} onSelectItem={handleSelectItem} category="top" />
                <ClothingScroller items={clothingItems} onSelectItem={handleSelectItem} category="bottom" />

              </div>
            </div>

            {/* Closet Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Closet</h2>
              <Closet onSelectItem={handleSelectItem} clothingItems={clothingItems} setClothingItems={setClothingItems} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
