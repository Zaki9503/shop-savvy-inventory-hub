
import React from 'react';
import Image from 'next/image';

interface QRCodeDisplayProps {
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ size = 200 }) => {
  return (
    <div className="flex items-center justify-center">
      <Image 
        src="/lovable-uploads/7bbff1ec-f211-496e-8306-12c271fe1162.png" 
        alt="Payment QR Code" 
        width={size} 
        height={size} 
        className="rounded-lg"
      />
    </div>
  );
};

export default QRCodeDisplay;
