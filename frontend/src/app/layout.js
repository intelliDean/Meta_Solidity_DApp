// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { Libre_Franklin } from 'next/font/google'
import './globals.css'
import { Web3Modal } from "@/connection"

export const metadata = {
  title: "Vesting Organization",
  description: "",
};

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin',
})

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={libre_franklin.variable}>
        <Web3Modal>{children}</Web3Modal>
      </body>
    </html>
  );
}