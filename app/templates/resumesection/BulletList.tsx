"use client"

import React from "react";

interface BulletListProps {
    items: string[];
    textColor?: string;
    bulletColor?: string;
    fontSize?: string; // e.g., "text-xs", "text-sm"
}

const BulletList: React.FC<BulletListProps> = ({ items, textColor, bulletColor, fontSize = "text-xs" }) => {
    if (!items || items.length === 0) return null;

    return (
        <ul className="list-none space-y-1">
            {items.map((item, index) => (
                <li key={index} className={`flex items-start gap-2 ${fontSize}`} style={{ color: textColor }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: bulletColor }}></span>
                    {item}
                </li>
            ))}
        </ul>
    );
};

export default BulletList;