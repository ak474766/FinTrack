import Link from "next/link"

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4 mr-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Fintrack</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

