import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, FileText, Share2, Zap } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"

export default function BlogLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          <span className="font-bold text-base sm:text-lg">SimpleBlog</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex gap-4 lg:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/posts">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
          <UserNav />
        </nav>

        {/* Mobile Navigation */}
        <div className="ml-auto md:hidden flex items-center gap-2">
          <UserNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-4xl">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none">
                  Share Your Stories with the World
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl dark:text-gray-400 px-4">
                  A simple, clean platform for writers to publish their thoughts, stories, and ideas. No sign-ups, no
                  complications - just pure writing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/write">
                    <PenTool className="mr-2 h-4 w-4" />
                    Start Writing Now
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto bg-transparent">
                  <Link href="/posts">
                    <FileText className="mr-2 h-4 w-4" />
                    Read Posts
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-4xl">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                  Simple. Clean. Effective.
                </h2>
                <p className="max-w-[900px] text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl/relaxed dark:text-gray-400 px-4">
                  Focus on what matters most - your content. We've removed all the barriers between you and your
                  readers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-4 sm:gap-6 py-8 sm:py-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="h-full">
                <CardHeader className="text-center pb-4">
                  <Zap className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 text-orange-500" />
                  <CardTitle className="text-lg sm:text-xl">Instant Publishing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm sm:text-base">
                    Write and publish immediately. No approval process, no waiting time. Your words go live instantly.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardHeader className="text-center pb-4">
                  <PenTool className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 text-green-500" />
                  <CardTitle className="text-lg sm:text-xl">Clean Writing Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm sm:text-base">
                    Distraction-free editor that lets you focus on your writing. Simple formatting, beautiful results.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full md:col-span-2 lg:col-span-1">
                <CardHeader className="text-center pb-4">
                  <Share2 className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 text-purple-500" />
                  <CardTitle className="text-lg sm:text-xl">Easy Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm sm:text-base">
                    Every post gets a unique link that's easy to share. Reach your audience wherever they are.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-8 sm:py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:gap-12 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4 order-2 lg:order-1">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                    Built for Writers, by Writers
                  </h2>
                  <p className="max-w-[600px] text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl dark:text-gray-400">
                    We believe that great ideas shouldn't be trapped behind complex interfaces or membership walls.
                    SimpleBlog is designed to get out of your way and let your creativity flow.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm sm:text-base">No registration required</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm sm:text-base">Mobile-friendly writing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm sm:text-base">Automatic saving</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm sm:text-base">SEO optimized</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center order-1 lg:order-2">
                <div className="w-full max-w-sm space-y-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-6 sm:h-8 w-16 sm:w-20 bg-orange-200 dark:bg-orange-900 rounded animate-pulse" />
                    <div className="h-4 sm:h-6 w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-4xl">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                  Ready to Share Your Voice?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl dark:text-gray-400 px-4">
                  Join thousands of writers who have chosen simplicity over complexity. Your next great post is just a
                  click away.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/write">
                    <PenTool className="mr-2 h-4 w-4" />
                    Write Your First Post
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto bg-transparent">
                  <Link href="/posts">Explore Posts</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-4 sm:py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
          © 2024 SimpleBlog. Made for writers, by writers.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/contact">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}
