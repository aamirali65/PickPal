import React, { useEffect, useRef } from 'react';

const AdComponent = ({ slot }) => {
  const adRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only proceed if not in development
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    // Only load ad if it hasn't been loaded yet
    if (adRef.current && !isLoaded.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }

    return () => {
      isLoaded.current = false;
    };
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-500">
        Ad Placeholder (Slot: {slot})
      </div>
    );
  }

  return (
    <div className="ad-container my-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8214884614326042"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdComponent; 