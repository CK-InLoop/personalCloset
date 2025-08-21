import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import Closet from '../components/Closet';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedTop, setSelectedTop] = useState<string>('');
  const [selectedBottom, setSelectedBottom] = useState<string>('');
  const [selectedOnePiece, setSelectedOnePiece] = useState<string>('');

  const handleLogout = () => {
    logout();
  };

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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Closet Organizer</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user?.username}!</span>
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

      <div className="py-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Virtual Closet</h1>
            
            {/* Avatar Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Outfit</h2>
              <div className="flex justify-center">
                <Avatar 
                  top={selectedTop}
                  bottom={selectedBottom}
                  onePiece={selectedOnePiece}
                />
              </div>
            </div>

            {/* Closet Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Closet</h2>
              <Closet onSelectItem={handleSelectItem} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
