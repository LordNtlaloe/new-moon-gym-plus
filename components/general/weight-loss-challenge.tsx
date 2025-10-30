'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function MealPlanDownload(): JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    // Email validation regex
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isFormValid =
        name.trim() !== '' &&
        isValidEmail(email.trim()) &&
        phone.trim() !== '';

    const handleDownload = async (): Promise<void> => {
        if (!isFormValid) return;

        setIsDownloading(true);

        try {
            // Send query params to API
            const query = new URLSearchParams({ name, email, phone });
            const response = await fetch(`/api/pdf?${query.toString()}`);

            if (!response.ok) {
                toast.error("Download failed. Please try again.");
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = '7-day-fitness-meal-plan.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast.success("✅ Meal plan downloaded successfully!");
        } catch (error) {
            console.error('Download error:', error);
            toast.error("❌ Something went wrong. Try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-4 p-4">
            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {email && !isValidEmail(email) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
            )}

            <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={handleDownload}
                disabled={!isFormValid || isDownloading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isDownloading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <svg
                            className="w-5 h-5 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span>Downloading...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-2">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <span>Download Meal Plan</span>
                    </div>
                )}
            </button>
        </div>
    );
}
