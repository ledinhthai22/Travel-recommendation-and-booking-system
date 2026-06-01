import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
    return (
        <nav className="flex items-center gap-1.5 text-sm">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && (
                        <span className="text-slate-300 select-none text-base leading-none">›</span>
                    )}

                    {item.href ? (
                        <Link
                            to={item.href}  
                            className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors duration-200"
                        >
                            {item.icon && (
                                <span className="material-symbols-outlined text-[5px] leading-none">
                                    {item.icon}
                                </span>
                            )}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ) : (
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                            {item.icon && (
                                <span className="material-symbols-outlined text-[16px] leading-none">
                                    {item.icon}
                                </span>
                            )}
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;