'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-black h-4 rounded-full transition-all duration-100"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">로딩중... {percent}%</p>
      </div>
    </div>
  );
}