import './globals.css';

export const metadata = {
  title: 'JobFinder | Planned Works Building Surveyor',
  description: 'Apply for the Planned Works Building Surveyor role at Hays Specialist Recruitment Limited.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
