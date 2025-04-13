import Image from "next/image";

// export default function Home() {
//   return (
//     <div>
//       Landing Page
//     </div>
//   );
// }
// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Platform</h1>
      <Link 
        href="/chat"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Medical Chatbot
      </Link>
    </main>
  );
}
