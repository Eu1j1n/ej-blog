import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EJ Blog | 나만의 기술 블로그",
  description:
    "개발자 김의진의 기술 블로그입니다. 웹 개발, 프론트엔드, 백엔드 등 다양한 기술 관련 글을 공유합니다.",
  keywords: ["개발자 블로그", "기술 블로그", "웹 개발", "프론트엔드", "김의진"],
  authors: [{ name: "김의진", url: "https://github.com/dmlwls7094" }],
  openGraph: {
    title: "EJ Blog | 나만의 기술 블로그",
    description: "개발자 김의진의 기술 블로그입니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen flex flex-col">
          {children}
          <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-600">김의진 / dmlwls7094@gmail.com</p>
                </div>
                <div className="text-gray-600">
                  <p>© 2025. Kim Eui Jin. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
