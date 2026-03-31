'use client';
import Link from "next/link";

export default function Header(){
  return (
    <>
      <header className="flex justify-between bg-black p-[10px]">
        <Link href="/" className="text-white text-xl font-extrabold">Blog</Link>
        <Link href="/contact/" className="text-white text-xl font-extrabold">お問い合わせ</Link>
      </header>
    </>
  )
}