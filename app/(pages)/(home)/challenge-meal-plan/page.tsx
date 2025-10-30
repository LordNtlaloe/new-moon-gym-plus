import MealPlanDownload from "@/components/general/weight-loss-challenge";

export default function ChallengePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Header */}
                <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        7-Day Fitness Challenge
                    </h1>
                    <p className="text-gray-600">
                        Download your personalized meal plan to get started!
                    </p>
                </div>

                {/* Download Button */}
                <MealPlanDownload />
            </div>
        </div>
    );
}