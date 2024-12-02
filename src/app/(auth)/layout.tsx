import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Branding Section */}
      <div className="relative hidden md:flex flex-col">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
          {/* Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-[url('/mesh-gradient.png')] opacity-20 mix-blend-overlay" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col h-full p-12 text-white">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-lg flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-2xl font-bold">Distill</div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Transform content into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-indigo-200 ml-2">
                actionable insights
              </span>
            </h1>
            <p className="mt-4 text-lg text-indigo-100 leading-relaxed max-w-md">
              Distill uses advanced AI to help you extract what matters most from any content, saving you hours of reading time.
            </p>

            {/* Features Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { title: "Smart Processing", desc: "Handles articles & videos" },
                { title: "Quick Results", desc: "Get insights in seconds" },
                { title: "AI-Powered", desc: "Advanced understanding" },
                { title: "Universal", desc: "Works with any content" },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-lg bg-white/5 backdrop-blur-sm"
                >
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-indigo-200 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-lg">
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-lg italic">
                "Distill has revolutionized how I consume content. It's like having a brilliant research assistant."
              </blockquote>
              <p className="mt-2 text-sm text-indigo-200">— Sarah Chen, Product Manager at Stripe</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>10K+ active users</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Trusted by top companies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-xl font-bold">Distill</div>
            </div>
            <ThemeToggle />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
} 