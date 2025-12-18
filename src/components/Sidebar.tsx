import React from 'react';
import { LayoutDashboard, LineChart, Newspaper, PieChart, Settings, LogOut, User } from 'lucide-react';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    notifications?: number;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, notifications, onClick }) => (
    <button
        onClick={onClick}
        className={`nav-item relative ${active ? 'active' : ''}`}
    >
        <Icon className="w-5 h-5" />
        <span className="flex-1">{label}</span>
        {notifications && notifications > 0 && (
            <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                {notifications}
            </span>
        )}
    </button>
);

export const Sidebar: React.FC = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: LineChart, label: 'Forecasting', notifications: 2 },
        { icon: Newspaper, label: 'News', notifications: 5 },
        { icon: PieChart, label: 'Portfolio' },
        { icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-full h-full flex flex-col p-4 bg-[rgba(255,255,255,0.02)]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full opacity-90" />
                </div>
                <div>
                    <span className="text-lg font-semibold text-white">Finance AI</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <NavItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        active={item.active}
                        notifications={item.notifications}
                    />
                ))}
            </nav>

            {/* User / Logout */}
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 mt-4 space-y-1">
                <NavItem icon={User} label="Account" />
                <NavItem icon={LogOut} label="Log Out" />
            </div>
        </div>
    );
};
