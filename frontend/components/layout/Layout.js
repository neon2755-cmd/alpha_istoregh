// frontend/components/layout/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar'; // Mobile navigation
import WhatsAppFloat from '../ui/WhatsAppFloat'; // Floating WhatsApp button

// This layout component can wrap pages that need Header, Footer, Navbar, and WhatsAppFloat.
// Pages that don't need these (like auth pages) can be wrapped differently or not at all.
const Layout = ({ children }) => {
  // You might want to conditionally render parts of the layout based on the route
  // For example, exclude Header/Footer/Navbar for auth pages.
  // This can be managed partially in _app.js and potentially here for more complex logic.

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header and Navbar are typically handled globally in _app.js for Next.js */}
      {/* So, this Layout might be simpler, focusing on content padding etc. */}
      <main className="flex-grow container mx-auto px-4 py-8"> {/* Add padding here */}
        {children}
      </main>
      {/* WhatsAppFloat is also rendered globally in _app.js */}
    </div>
  );
}

export default Layout;