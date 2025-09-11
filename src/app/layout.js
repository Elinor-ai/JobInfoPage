import './globals.css';
import { cookies } from "next/headers";
import ABTestManager from "@/lib/ab/ABTestManager";
import { experiments, PROGRAM_ID } from '@/lib/ab/config';


export const metadata = {
  title: 'JobFinder | Planned Works Building Surveyor',
  description: 'Apply for the Planned Works Building Surveyor role at Hays Specialist Recruitment Limited.',
};

const ab = new ABTestManager({experiments})

export default function RootLayout({ children }) {
  const design = ab.getServerVariantForProgram(cookies(), PROGRAM_ID || "light")
  return (
    <html lang="en" data-design={design}>
      {/* <body className="min-h-screen flex flex-col"> */}
        <body>{children}</body>  
      {/* </body> */}
    </html>
  );
}
