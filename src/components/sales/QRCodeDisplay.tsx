
import React from 'react';
import { QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 200 }) => {
  // This is a simplified placeholder for a real QR code implementation
  // In a production app, you'd use a library like qrcode.react
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="bg-white p-4 rounded-lg border flex items-center justify-center" 
        style={{ width: size, height: size }}
      >
        <QrCode className="w-full h-full" />
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">Payment number: {value}</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
