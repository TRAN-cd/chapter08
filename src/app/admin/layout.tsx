'use client';

import Link from 'next/link'
import { usePathname } from "next/navigation";
import { useRouteGuard } from './_hooks/useRouteGuard';

export default function AdminLayout(
  { children }: { children: React.ReactNode}
){
  useRouteGuard()

  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <>
      <aside className="fixed bg-gray-100 w-70 left-0 bottom-0 top-12">
        <Link
          href="/admin/posts"
          className={`p-4 block ${isSelected('/admin/posts') && 'bg-blue-200'}`}>
            記事一覧
        </Link>
        <Link
          href="/admin/categories"
          className={`p-4 block ${isSelected('/admin/categories') && 'bg-blue-200'}`}>
            カテゴリー一覧
        </Link>
      </aside>

      <div className="ml-70 p-4">{ children }</div>
    </>
  )
}