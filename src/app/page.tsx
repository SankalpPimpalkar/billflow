import GoogleSignInButton from "@/components/ui/buttons/GoogleSignInButton";
import Link from "next/link";
import { ArrowRight, BarChart3, Bell, ShieldCheck, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Navbar */}
      <header className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-100">
        <div className="container mx-auto px-4">
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
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
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
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 opacity-50" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-base-200/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to stay on top</h2>
              <p className="text-base-content/60"> Powerful features to help you manage your finances effortlessly.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="card bg-base-100 shadow-xl border border-base-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="card-body items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="card-title">Easy Upload</h3>
                  <p className="text-sm text-base-content/70">Simply drag & drop your bills. We handle the storage and organization for you.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card bg-base-100 shadow-xl border border-base-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="card-body items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="card-title">Expense Tracking</h3>
                  <p className="text-sm text-base-content/70">Visual dashboards to see where your money goes every month.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card bg-base-100 shadow-xl border border-base-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="card-body items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 text-accent">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h3 className="card-title">Smart Notifications</h3>
                  <p className="text-sm text-base-content/70">Get timely reminders before due dates so you never pay late fees again.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="card bg-base-100 shadow-xl border border-base-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="card-body items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-neutral/10 flex items-center justify-center mb-4 text-neutral">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="card-title">Secure Application</h3>
                  <p className="text-sm text-base-content/70">Your financial data is encrypted and stored securely. Privacy first.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <aside>
          <p className="font-bold text-lg">
            BillFlow <br />
            <span className="text-sm font-normal opacity-70">Simplifying personal finance since 2026</span>
          </p>
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
      </footer>
    </div>
  );
}
