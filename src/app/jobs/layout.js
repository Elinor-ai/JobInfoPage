// app/jobs/layout.js  (segment layout for all /jobs/* pages)
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function JobsLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="mx-auto w-full max-w-5xl px-4 flex-1">{children}</div>
      <Footer />
    </div>
  );
}
