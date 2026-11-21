export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          جامعة الشارقة — University of Sharjah
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Arabic Research Intelligence
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          AI Research Copilot for Arabic & English Academic Research (Next.js 16 + React 19 + Gemini 3.8 Flash)
        </p>
        <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
          Architecture Foundation initialized. System status: <span className="text-emerald-600 font-semibold">Online</span>
        </div>
      </div>
    </main>
  );
}
