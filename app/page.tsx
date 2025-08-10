import { RfpHero } from "@/components/rfp-hero";
import { DashboardStats } from "@/components/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard-charts";
import { RecentActivity } from "@/components/recent-activity";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { EmailConfirmationHandler } from "@/components/email-confirmation-handler";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Email Confirmation Handler - This will process confirmation codes */}
      <EmailConfirmationHandler />

      {/* Navigation */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"} className="text-xl font-bold text-blue-600">
              RFP Manager
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign Up
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <RfpHero />

      {/* Dashboard Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              System Overview
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get real-time insights into your RFP ecosystem with comprehensive analytics and metrics
            </p>
          </div>
          <DashboardStats />
        </div>
      </section>

      {/* Dashboard Analytics Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analytics & Trends
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Track performance metrics and identify opportunities for improvement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts Section */}
            <div className="lg:col-span-2">
              <DashboardCharts stats={{
                recentRfps: 0,
                recentResponses: 0,
                totalRfps: 0,
                totalResponses: 0
              }} />
            </div>

            {/* Recent Activity Section */}
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of RFP management with cutting-edge technology and intuitive design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                <svg className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">Optimized performance for quick RFP creation and response management</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400">Enterprise-grade security with role-based access control</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                <svg className="h-10 w-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">User Friendly</h3>
              <p className="text-gray-600 dark:text-gray-400">Intuitive interface designed for both buyers and suppliers</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                <svg className="h-10 w-10 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive insights and reporting for better decision making</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center px-5">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your RFP Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of organizations already using our platform to streamline their contract management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md font-semibold transition-colors">
                Get Started Free
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-md font-semibold transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t border-t-foreground/10 py-8">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 RFP Contract Management System. All rights reserved.</p>
          <p className="mt-2">
            Built with modern technologies for maximum efficiency and security
          </p>
        </div>
      </footer>
    </main>
  );
}
