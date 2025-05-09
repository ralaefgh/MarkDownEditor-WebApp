import type { Metadata } from "next"
import MarkdownEditor from "@/components/markdown-editor"

export const metadata: Metadata = {
  title: "Markdown Editor",
  description: "A web app for editing and previewing markdown files",
}

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <MarkdownEditor />
    </main>
  )
}
