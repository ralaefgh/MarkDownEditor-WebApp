"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { FileText, Eye, Code, Download, Upload, Save, FileUp, Plus, Folder } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>("")
  const [fileName, setFileName] = useState<string>("untitled.md")
  const [activeTab, setActiveTab] = useState<string>("code")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample initial markdown content
  useEffect(() => {
    // Generate a longer sample to test scrolling
    let longSample = `# Welcome to Markdown Editor

## Features
- Edit markdown in code view
- Preview rendered markdown
- Import and export files
- Switch between views

### Example Content
This is **bold** text, and this is *italic* text.

> This is a blockquote

\`\`\`javascript
// This is a code block
function hello() {
  console.log("Hello, world!");
}
\`\`\`

- List item 1
- List item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2

[Link to Google](https://www.google.com)

![Image placeholder](/placeholder.svg?height=200&width=400)

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`

    // Add more content to ensure scrolling is needed
    for (let i = 0; i < 10; i++) {
      longSample += `
## Section ${i + 1}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.

\`\`\`javascript
// Example code block ${i + 1}
function example${i + 1}() {
  return "This is example ${i + 1}";
}
\`\`\`

`
    }

    setMarkdown(longSample)
  }, [])

  const handleFileOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setMarkdown(content)
    }
    reader.readAsText(file)
  }

  const handleImport = (format: string) => {
    // In a real app, we would handle different formats
    // For now, we'll just trigger the file input
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleExport = (format: string) => {
    const content = markdown
    let exportFileName = fileName
    const mimeType = "text/markdown"

    // In a real app, we would convert to different formats
    // For this demo, we'll just export as markdown
    if (format !== "md") {
      exportFileName = fileName.replace(/\.md$/, `.${format}`)
      // In a real implementation, we would convert the content here
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = exportFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSave = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleNewFile = () => {
    if (confirm("Create a new file? Unsaved changes will be lost.")) {
      setMarkdown("")
      setFileName("untitled.md")
    }
  }

  // Create a simple HTML string for the preview iframe
  const createPreviewHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.5;
              padding: 2rem;
              margin: 0;
              color: #333;
              background: white;
            }
            
            .dark body {
              color: #f8f9fa;
              background: #1a1a1a;
            }
            
            pre {
              background: #f5f5f5;
              padding: 1rem;
              border-radius: 0.25rem;
              overflow: auto;
            }
            
            .dark pre {
              background: #2d2d2d;
            }
            
            code {
              font-family: monospace;
              background: #f5f5f5;
              padding: 0.125rem 0.25rem;
              border-radius: 0.25rem;
            }
            
            .dark code {
              background: #2d2d2d;
            }
            
            blockquote {
              border-left: 4px solid #ddd;
              padding-left: 1rem;
              margin-left: 0;
              color: #666;
            }
            
            .dark blockquote {
              border-left-color: #444;
              color: #aaa;
            }
            
            table {
              border-collapse: collapse;
              width: 100%;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 0.5rem;
            }
            
            .dark th, .dark td {
              border-color: #444;
            }
            
            img {
              max-width: 100%;
            }
            
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5rem;
              margin-bottom: 1rem;
            }
            
            p, ul, ol {
              margin-top: 0;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div id="content"></div>
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <script>
            document.getElementById('content').innerHTML = marked.parse(\`${markdown.replace(/`/g, "\\`")}\`);
          </script>
        </body>
      </html>
    `
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Markdown Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-48" />
            <Button variant="outline" size="sm" onClick={handleNewFile}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Folder className="h-4 w-4 mr-1" />
              Open
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleFileOpen}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("md")}>Markdown (.md)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("html")}>HTML (.html)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("rtf")}>Rich Text Format (.rtf)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("odt")}>OpenDocument Text (.odt)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("txt")}>Plain Text (.txt)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleImport("md")}>Markdown (.md)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleImport("rtf")}>Rich Text Format (.rtf)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleImport("odt")}>OpenDocument Text (.odt)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleImport("txt")}>Plain Text (.txt)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="split" className="flex items-center gap-1">
                <FileUp className="h-4 w-4" />
                Split View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="code" className="flex-1 p-0 m-0">
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="h-full rounded-none border-0 font-mono resize-none p-4"
              placeholder="Type your markdown here..."
            />
          </TabsContent>

          <TabsContent value="preview" className="flex-1 p-0 m-0 overflow-auto">
            <div className="prose max-w-none p-8 dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
          </TabsContent>

          <TabsContent value="split" className="flex-1 p-0 m-0">
            {/* Split view with iframe for preview */}
            <div className="relative h-full">
              {/* Left side - Editor */}
              <div className="absolute left-0 top-0 w-1/2 h-full border-r">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="h-full w-full rounded-none border-0 font-mono resize-none p-4"
                  placeholder="Type your markdown here..."
                />
              </div>

              {/* Right side - Preview */}
              <div className="absolute right-0 top-0 w-1/2 h-full overflow-auto">
                <div className="prose max-w-none p-8 dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status bar */}
      <div className="border-t bg-muted px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <div>
            {markdown.split("\n").length} lines | {markdown.length} characters
          </div>
          <div>{activeTab === "code" ? "Editing" : activeTab === "preview" ? "Previewing" : "Split View"}</div>
        </div>
      </div>
    </div>
  )
}
