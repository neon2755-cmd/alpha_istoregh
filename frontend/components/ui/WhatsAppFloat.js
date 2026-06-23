import React from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { useSettings } from '../../hooks/useSettings';
import siteConfig from '../../config';

export default function WhatsAppFloat() {
  const { settings } = useSettings();
  const phoneNumber = (settings?.contact?.whatsapp?.[0] || siteConfig.whatsappNumber || '').replace(/[^0-9]/g, '');
  const message = `Hello ${settings?.storeName || siteConfig.name} team!`;
  const waLink = phoneNumber ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}` : '#';

  if (!phoneNumber) return null;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-40 bottom-24 right-4 md:bottom-6 md:right-6 h-14 w-14 inline-flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:bg-[#128C7E] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:-translate-y-1 transition-all duration-300"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
