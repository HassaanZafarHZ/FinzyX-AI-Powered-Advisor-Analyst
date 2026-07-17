import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">FinzyX</h1>
          <p className="text-white/90 text-lg">AI-Powered Investment Advisor for PSX</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-white font-semibold">AI-Powered Insights</h3>
            </div>
            <p className="text-white/80 text-sm">
              Get personalized financial advice and stock recommendations powered by advanced AI
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl">☪️</span>
              </div>
              <h3 className="text-white font-semibold">Shariah Compliant</h3>
            </div>
            <p className="text-white/80 text-sm">
              Filter and invest in Halal stocks that meet Islamic finance criteria
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl">🇵🇰</span>
              </div>
              <h3 className="text-white font-semibold">Pakistan Stock Exchange</h3>
            </div>
            <p className="text-white/80 text-sm">
              Access real-time data and insights for PSX-listed companies
            </p>
          </div>
        </div>

        <p className="text-white/60 text-sm">© 2026 FinzyX. All rights reserved.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl border border-border shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
