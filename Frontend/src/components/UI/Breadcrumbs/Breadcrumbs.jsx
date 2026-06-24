import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
    return (
        <nav className="flex items-center flex-wrap gap-2 text-xs md:text-sm" aria-label="Breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center gap-2">
                        {index > 0 && (
                            <ChevronRight size={14} className="text-slate-300 shrink-0" />
                        )}

                        {item.href && !isLast ? (
                            <Link
                                to={item.href}  
                                className="flex items-center gap-1.5 text-slate-400 hover:text-sky-500 font-medium transition-colors duration-150"
                            >
                                {item.icon && <span className="shrink-0 text-slate-400 group-hover:text-sky-500">{item.icon}</span>}
                                <span>{item.label}</span>
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1.5 text-slate-600 font-semibold line-clamp-1 max-w-[220px] md:max-w-[400px]">
                                {item.icon && <span className="shrink-0 text-slate-500">{item.icon}</span>}
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;