import { Button } from "@/components/ui/button";
import { FileText, Users, Handshake, Zap } from "lucide-react";
import Link from "next/link";

export function RfpHero() {
    return (
        <div className="text-center space-y-8 py-16">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                    RFP Contract Management
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Streamline your Request for Proposal process with our comprehensive,
                    AI-powered contract management system
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/login">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                        Sign In
                    </Button>
                </Link>
                <Link href="/auth/sign-up">
                    <Button size="lg" variant="outline" className="px-8 py-3">
                        Sign Up
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12">
                <div className="text-center space-y-3">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Smart RFP Creation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create comprehensive RFPs with AI-powered templates and guidance
                    </p>
                </div>

                <div className="text-center space-y-3">
                    <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Supplier Network
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Connect with qualified suppliers and manage responses efficiently
                    </p>
                </div>

                <div className="text-center space-y-3">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Handshake className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Contract Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Streamline contract workflows from proposal to final approval
                    </p>
                </div>
            </div>

            <div className="pt-8">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Zap className="h-4 w-4" />
                    <span>Built with Next.js, Supabase, and AI-powered productivity tools</span>
                </div>
            </div>
        </div>
    );
} 