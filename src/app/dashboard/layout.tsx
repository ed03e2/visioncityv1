'use client';
import Link from "next/link";
import { LuTreePine } from "react-icons/lu";
import { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-[#efeff6] text-black p-4 shadow-md">
                <nav className="w-full mx-auto flex justify-between items-center text-base">
                    <div className="flex items-center gap-2">
                    <LuTreePine />
                    <div>VisionCity</div>
                    </div>
                    <ul className="flex gap-4">
                        <li>
                            <Link 
                                href="/dashboard" 
                                className="text-black no-underline transition-colors hover:text-blue-200"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/analytic" 
                                className="text-black no-underline transition-colors hover:text-blue-200"
                            >
                                Analytic
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/dashboard/setting" 
                                className="text-black no-underline transition-colors hover:text-blue-200"
                            >
                                Settings
                            </Link>
                        </li>
                        <li>
                            <p className="text-black no-underline transition-colors hover:text-blue-200 cursor-pointer m-0">
                                logout
                            </p>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow w-full mx-auto p-4">
                {children}
            </main>

            <footer className="bg-black text-white py-6 px-8 mt-auto">
                <div className="w-full mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-base font-bold mb-2">VisionCity</h3>
                            <p className="text-sm">Enhancing urban spaces through data-driven insights.</p>
                        </div>
                        <div>
                            <div className="flex gap-4 justify-end">
                                {["Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
                                    <a 
                                        key={item}
                                        href="#" 
                                        className="text-white no-underline transition-colors hover:text-blue-300"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
