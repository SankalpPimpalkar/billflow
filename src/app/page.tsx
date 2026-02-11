import GoogleSignInButton from "@/components/ui/buttons/GoogleSignInButton";
import Link from "next/link";
import { ArrowRight, BarChart3, Bell, ShieldCheck, Upload, TrendingUp, Zap, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-base-300">
      {/* Navbar */}
      <header className="navbar bg-base-200/80 sticky top-0 z-50 border-b border-base-100">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl font-bold tracking-tight">
              BillFlow
            </Link>
          </div>
          <div className="flex-none">
            <GoogleSignInButton />
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-base-100">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Smart Bill Management</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-base-content">
                Master Your Bills <br />
                <span className="text-primary">Simplify Your Life</span>
              </h1>

              <p className="text-lg lg:text-xl text-base-content/70 max-w-2xl mx-auto">
                Track expenses, organize invoices, and never miss a payment again.
                The smartest way to manage your financial obligations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <GoogleSignInButton />
                <Link href="#features" className="btn btn-ghost group">
                  Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Stats Preview */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-base-content/60">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">10K+</div>
                  <div className="text-sm text-base-content/60">Bills Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">99%</div>
                  <div className="text-sm text-base-content/60">On-Time Payments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-base-300 border-y border-neutral-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything you need to stay on top</h2>
              <p className="text-base-content/60 text-lg">Powerful features to help you manage your finances effortlessly.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Feature 1 - Stats Card Style */}
              <div className="card bg-base-200 border border-base-100 p-6 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
                <span className="flex items-center justify-between w-full">
                  <p className="text-neutral-500 text-sm font-medium">
                    Easy Upload
                  </p>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="w-5 h-5" />
                  </div>
                </span>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Drag & Drop</h3>
                  <p className="text-sm text-base-content/70">
                    Simply upload your bills. We handle the storage and organization for you.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">Fast & Secure</span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card bg-base-200 border border-base-100 p-6 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
                <span className="flex items-center justify-between w-full">
                  <p className="text-neutral-500 text-sm font-medium">
                    Expense Tracking
                  </p>
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </span>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Visual Insights</h3>
                  <p className="text-sm text-base-content/70">
                    Beautiful dashboards to see where your money goes every month.
                  </p>
                </div>

                <div className="pt-2">
                  <progress className="progress progress-secondary w-full h-1" value="70" max="100"></progress>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card bg-base-200 border border-base-100 p-6 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
                <span className="flex items-center justify-between w-full">
                  <p className="text-neutral-500 text-sm font-medium">
                    Smart Notifications
                  </p>
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Bell className="w-5 h-5" />
                  </div>
                </span>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Never Miss</h3>
                  <p className="text-sm text-base-content/70">
                    Get timely reminders before due dates. No more late fees.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-warning font-medium">24h Intervals</span>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="card bg-base-200 border border-base-100 p-6 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1">
                <span className="flex items-center justify-between w-full">
                  <p className="text-neutral-500 text-sm font-medium">
                    Secure & Private
                  </p>
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </span>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Bank-Level</h3>
                  <p className="text-sm text-base-content/70">
                    Your financial data is encrypted and stored securely. Privacy first.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="badge badge-success badge-sm">Encrypted</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-base-100 border-b border-neutral-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold">
                Ready to take control?
              </h2>
              <p className="text-lg text-base-content/70">
                Join hundreds of users who are already managing their bills smarter.
              </p>
              <div className="pt-4">
                <GoogleSignInButton />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content border-t border-base-100">
        <aside>
          <p className="font-bold text-lg">
            BillFlow <br />
            <span className="text-sm font-normal opacity-70">Simplifying personal finance since 2026</span>
          </p>
          <p className="text-sm opacity-60">Copyright © {new Date().getFullYear()} - All rights reserved</p>
        </aside>
      </footer>
    </div>
  );
}
