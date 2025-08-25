import React, { useState } from 'react';

const VirtualTryOn: React.FC = () => {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUserImage(e.target.files[0]);
    }
  };

  const handleClothingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setClothingImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userImage || !clothingImage) {
      setError('Please select both a user image and a clothing image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    const formData = new FormData();
    formData.append('user_image', userImage);
    formData.append('clothing_image', clothingImage);

    try {
      const response = await fetch('/api/virtual_try_on', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setResultImage(data.result_url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Virtual Try-On</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user-image" className="block text-sm font-medium text-gray-700">
            Your Photo
          </label>
          <input
            id="user-image"
            type="file"
            accept="image/png"
            onChange={handleUserImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <div>
          <label htmlFor="clothing-image" className="block text-sm font-medium text-gray-700">
            Clothing Item
          </label>
          <input
            id="clothing-image"
            type="file"
            accept="image/png"
            onChange={handleClothingImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !userImage || !clothingImage}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : 'Try It On'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      {isLoading && (
        <div className="mt-4 text-center">
          <p>Processing... this may take a minute.</p>
        </div>
      )}

      {resultImage && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Result</h3>
          <img src={resultImage} alt="Virtual try-on result" className="w-full rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;