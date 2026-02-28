"use client";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SideBar from './SideBar';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className="flex items-center justify-between p-4 bg-white border-b md:hidden">
                <div className="flex items-center gap-3">

                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 outline-none"
                    >
                        <Menu className="w-6 h-6 text-[#004d2c]" />
                    </button>
                    <h1 className="text-lg font-black italic text-[#004d2c]">Cooperativa</h1>
                </div>
            </header>


            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">

                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsOpen(false)}
                    />


                    <div className="relative w-72 h-full">
                        <SideBar />

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-[-40px] text-white"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
export default Header;