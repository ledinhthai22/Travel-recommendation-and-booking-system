import React from 'react';

export default function SectionTitle({ title, description, action }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 px-0">
      <div className="text-left">
        {title && (
          <h2 
            style={{ fontFamily: "'Poppins', sans-serif" }}
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            {title}
          </h2>
        )}
        
        {description && (
          <p 
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="mt-1.5 text-xs text-slate-500 sm:text-sm"
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}