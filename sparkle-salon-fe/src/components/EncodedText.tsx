import React from 'react';
import DOMPurify from 'dompurify';

interface EncodedTextProps {
  html?: string;
  text?: string;
  className?: string;
}

/**
 * Component to safely display HTML content or plain text with proper encoding
 * If html is provided, it will be sanitized and displayed as HTML
 * If text is provided, it will be displayed as plain text
 */
const EncodedText: React.FC<EncodedTextProps> = ({ html, text, className = '' }) => {
  // If html is provided, sanitize and display it
  if (html) {
    const sanitizedHtml = DOMPurify.sanitize(html);
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      />
    );
  }
  
  // If only text is provided, display it as plain text
  return <div className={className}>{text || ''}</div>;
};

export default EncodedText; 