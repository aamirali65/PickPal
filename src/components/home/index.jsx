import React, { useState, useEffect } from "react";
import { FaGithub, FaCopy, FaHistory, FaSave, FaTrash, FaInfoCircle, FaCoffee, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import AdComponent from '../AdComponent';
import ErrorBoundary from '../ErrorBoundary';

const ColorPicker = () => {
  const [color, setColor] = useState(() => 
    localStorage.getItem('currentColor') || "#ffffff"
  );
  
  const [isDark, setIsDark] = useState(() => 
    JSON.parse(localStorage.getItem('isDarkMode')) || false
  );
  
  const [colorFormat, setColorFormat] = useState(() => 
    localStorage.getItem('colorFormat') || 'hex'
  );
  
  const [savedColors, setSavedColors] = useState(() => 
    JSON.parse(localStorage.getItem('savedColors')) || []
  );
  
  const [colorHistory, setColorHistory] = useState(() => 
    JSON.parse(localStorage.getItem('colorHistory')) || []
  );
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [cookieConsent, setCookieConsent] = useState(() => 
    localStorage.getItem('cookieConsent') === 'true'
  );

  const navigate = useNavigate();

  // Enhanced color suggestions with more categories
  const colorSuggestions = {
    trending: [
      { hex: "#FF6B6B", name: "Coral Red" },
      { hex: "#4ECDC4", name: "Caribbean Green" },
      { hex: "#45B7D1", name: "Sky Blue" },
      { hex: "#96CEB4", name: "Sage" },
      { hex: "#FFBE0B", name: "Marigold" },
      { hex: "#FF006E", name: "Pink Punch" },
      { hex: "#8338EC", name: "Purple Beam" },
      { hex: "#3A86FF", name: "Blue Ribbon" }
    ],
    social: [
      { hex: "#1DA1F2", name: "Twitter Blue" },
      { hex: "#4267B2", name: "Facebook Blue" },
      { hex: "#E1306C", name: "Instagram Pink" },
      { hex: "#FF0000", name: "YouTube Red" },
      { hex: "#25D366", name: "WhatsApp Green" },
      { hex: "#0088CC", name: "Telegram Blue" },
      { hex: "#BD081C", name: "Pinterest Red" },
      { hex: "#6441A5", name: "Twitch Purple" }
    ],
    brands: [
      { hex: "#EA4335", name: "Google Red" },
      { hex: "#4285F4", name: "Google Blue" },
      { hex: "#FBBC05", name: "Google Yellow" },
      { hex: "#34A853", name: "Google Green" },
      { hex: "#FF9900", name: "Amazon Orange" },
      { hex: "#00B2FF", name: "PayPal Blue" },
      { hex: "#7AB800", name: "Android Green" },
      { hex: "#FF3366", name: "Airbnb Pink" }
    ],
    tech: [
      { hex: "#000000", name: "Apple Black" },
      { hex: "#0078D7", name: "Microsoft Blue" },
      { hex: "#FF4500", name: "Reddit Orange" },
      { hex: "#5865F2", name: "Discord Blue" },
      { hex: "#00AF87", name: "Spotify Green" },
      { hex: "#FF6900", name: "Firefox Orange" },
      { hex: "#7289DA", name: "Slack Purple" },
      { hex: "#FF0033", name: "Netflix Red" }
    ],
    material: [
      { hex: "#F44336", name: "Material Red" },
      { hex: "#2196F3", name: "Material Blue" },
      { hex: "#4CAF50", name: "Material Green" },
      { hex: "#FFC107", name: "Material Amber" },
      { hex: "#9C27B0", name: "Material Purple" },
      { hex: "#FF5722", name: "Material Deep Orange" },
      { hex: "#607D8B", name: "Material Blue Grey" },
      { hex: "#795548", name: "Material Brown" }
    ],
    pastels: [
      { hex: "#FFB5B5", name: "Pastel Pink" },
      { hex: "#B5DEFF", name: "Pastel Blue" },
      { hex: "#D7FFB5", name: "Pastel Green" },
      { hex: "#FFE5B5", name: "Pastel Orange" },
      { hex: "#E0B5FF", name: "Pastel Purple" },
      { hex: "#B5FFE9", name: "Pastel Mint" },
      { hex: "#FFB5E8", name: "Pastel Rose" },
      { hex: "#B5F4FF", name: "Pastel Sky" }
    ],
    nature: [
      { hex: "#8B4513", name: "Saddle Brown" },
      { hex: "#228B22", name: "Forest Green" },
      { hex: "#87CEEB", name: "Sky Blue" },
      { hex: "#DEB887", name: "Burly Wood" },
      { hex: "#20B2AA", name: "Light Sea Green" },
      { hex: "#FFD700", name: "Golden" },
      { hex: "#FF7F50", name: "Coral" },
      { hex: "#98FF98", name: "Mint Green" }
    ],
    gradients: [
      { hex: "#FF416C", name: "Sunset Pink" },
      { hex: "#FF4B2B", name: "Sunset Orange" },
      { hex: "#4158D0", name: "Ocean Blue" },
      { hex: "#50C878", name: "Emerald" },
      { hex: "#8E2DE2", name: "Purple Love" },
      { hex: "#FF0099", name: "Magenta" },
      { hex: "#00C6FF", name: "Clear Blue" },
      { hex: "#FFA07A", name: "Light Salmon" }
    ],
    monochrome: [
      { hex: "#000000", name: "Black" },
      { hex: "#333333", name: "Dark Gray" },
      { hex: "#666666", name: "Medium Gray" },
      { hex: "#999999", name: "Light Gray" },
      { hex: "#CCCCCC", name: "Silver" },
      { hex: "#FFFFFF", name: "White" },
      { hex: "#F5F5F5", name: "Smoke White" },
      { hex: "#1A1A1A", name: "Soft Black" }
    ],
    ecommerce: [
      { hex: "#FF9900", name: "Amazon" },
      { hex: "#00457C", name: "Walmart" },
      { hex: "#0F4B8F", name: "Best Buy" },
      { hex: "#E31837", name: "Target" },
      { hex: "#F47373", name: "Etsy" },
      { hex: "#00B484", name: "Shopify" },
      { hex: "#FF5A00", name: "Alibaba" },
      { hex: "#EB6E4B", name: "Magento" }
    ]
  };

  // Color conversion utilities
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex) => {
    // Add HSL conversion logic here
    return "hsl(0, 0%, 100%)"; // Placeholder
  };

  // Toast notification
  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle color changes
  const handleColorChange = (newColor) => {
    setColor(newColor);
    setColorHistory(prev => {
      const newHistory = [
        {
          color: newColor,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 19)
      ];
      return newHistory;
    });
  };

  // Enhanced copy function with SweetAlert
  const handleCopy = (colorValue, colorName = '') => {
    navigator.clipboard.writeText(colorValue)
      .then(() => {
        Swal.fire({
          title: 'Copied!',
          text: `${colorValue} ${colorName ? `(${colorName})` : ''} has been copied to clipboard`,
          icon: 'success',
          timer: 2000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          background: isDark ? '#1F2937' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#000000'
        });
      })
      .catch(() => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to copy to clipboard',
          icon: 'error',
          timer: 2000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
      });
  };

  // Save color to favorites
  const handleSaveColor = () => {
    if (!savedColors.includes(color)) {
      setSavedColors(prev => [...prev, color]);
      showNotification('Color saved to favorites!');
    }
  };

  // Use useEffect to save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('currentColor', color);
  }, [color]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('colorFormat', colorFormat);
  }, [colorFormat]);

  useEffect(() => {
    localStorage.setItem('savedColors', JSON.stringify(savedColors));
  }, [savedColors]);

  useEffect(() => {
    localStorage.setItem('colorHistory', JSON.stringify(colorHistory));
  }, [colorHistory]);

  // Clear functions with localStorage cleanup
  const clearHistory = () => {
    setColorHistory([]);
    localStorage.removeItem('colorHistory');
  };

  const clearSavedColors = () => {
    setSavedColors([]);
    localStorage.removeItem('savedColors');
  };

  const handleBuyMeACoffee = () => {
    window.open('https://buymeacoffee.com/aamirali65', '_blank');
  };

  // Cookie consent handler
  const handleCookieConsent = () => {
    setCookieConsent(true);
    localStorage.setItem('cookieConsent', 'true');
  };

  // Handler for privacy policy navigation
  const handlePrivacyClick = () => {
    navigate('/privacy-policy');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
      {/* Navigation Bar */}
      <nav className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                🎨 PickPal
              </h1>
              <a href="https://github.com/aamirali65" target="_blank" rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700">
                <FaGithub size={24} />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBuyMeACoffee}
                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors flex items-center gap-2"
              >
                <FaCoffee /> Buy Me a Coffee
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Find Your Perfect Color
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Professional color picker with advanced features for designers and developers
          </p>
        </div>

        {/* Single Ad Component */}
        {cookieConsent && (
          <ErrorBoundary>
            <AdComponent slot="5478306008" />
          </ErrorBoundary>
        )}

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Color Picker Card */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex flex-col items-center space-y-6">
              <input 
                type="color" 
                value={color} 
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-40 h-40 cursor-pointer rounded-lg border-4 border-gray-200"
              />
              
              <div className="flex flex-wrap gap-2 justify-center">
                <select 
                  value={colorFormat}
                  onChange={(e) => setColorFormat(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="hex">HEX</option>
                  <option value="rgb">RGB</option>
                  <option value="hsl">HSL</option>
                </select>
                <p className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {colorFormat === 'hex' ? color : 
                   colorFormat === 'rgb' ? hexToRgb(color) : 
                   hexToHsl(color)}
                </p>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaCopy /> Copy
                </button>
                <button
                  onClick={handleSaveColor}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaSave /> Save
                </button>
              </div>
            </div>
          </div>

          {/* Color Information Card */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Color Information
            </h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Color Values</h3>
                <div className={`grid grid-cols-2 gap-2 mt-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                  <div>HEX: {color}</div>
                  <div>RGB: {hexToRgb(color)}</div>
                  <div>HSL: {hexToHsl(color)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Color Suggestions Section */}
        <div className="space-y-8 mb-12">
          {Object.entries(colorSuggestions).map(([category, colors]) => (
            <div key={category} className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-4 capitalize ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {category.replace(/([A-Z])/g, ' $1').trim()} Colors
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {colors.map((color, index) => (
                  <div key={index} className="space-y-2">
                    <button
                      style={{ backgroundColor: color.hex }}
                      className="group relative w-full h-20 rounded-lg shadow-md hover:scale-105 transition-transform"
                      onClick={() => {
                        handleColorChange(color.hex);
                        handleCopy(color.hex, color.name);
                      }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 text-white rounded-lg transition-opacity text-sm">
                        {color.name}
                      </span>
                    </button>
                    <div 
                      className={`text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} cursor-pointer`}
                      onClick={() => handleCopy(color.hex, color.name)}
                    >
                      {color.hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* History and Saved Colors */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Color History */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <FaHistory className="inline mr-2" /> History
              </h2>
              <button
                onClick={clearHistory}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {colorHistory.map((item, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: item.color }}
                  className="w-full h-10 rounded-md hover:scale-105 transition-transform relative group"
                  onClick={() => handleColorChange(item.color)}
                >
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                                 bg-black text-white text-xs rounded p-1 opacity-0 
                                 group-hover:opacity-100 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Colors */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <FaSave className="inline mr-2" /> Saved Colors
              </h2>
              <button
                onClick={clearSavedColors}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {savedColors.map((savedColor, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: savedColor }}
                  className="w-full h-10 rounded-md hover:scale-105 transition-transform"
                  onClick={() => handleColorChange(savedColor)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Cookie Consent Banner */}
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                We use cookies to enhance your experience and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies. 
                <button 
                  onClick={handlePrivacyClick}
                  className="underline ml-2 hover:text-blue-300"
                >
                  Learn more
                </button>
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCookieConsent}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Accept All
              </button>
              <button
                onClick={handlePrivacyClick}
                className="border border-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Link in Footer */}
      <footer className={`${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} mt-12 py-8`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>© 2024 ColorPick Pro. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a 
                href="https://www.instagram.com/aamir.develop" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-pink-500 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/aamirali65" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-600 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
              <a 
                href="https://www.facebook.com/aamir.almani.65" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-500 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ColorPicker;
