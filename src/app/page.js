import SearchHero from '@/components/SearchHero';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#5c6ac4] to-[#202e78] flex items-center">
      <div className="mx-auto w-full max-w-5xl px-4">
        <h1 className="sr-only">Find Jobs</h1>
        <SearchHero />
      </div>
    </main>
  );
}
