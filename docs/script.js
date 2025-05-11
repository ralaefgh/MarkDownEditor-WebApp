document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const markdownInput = document.getElementById("markdown-input")
  const splitMarkdownInput = document.getElementById("split-markdown-input")
  const markdownPreview = document.getElementById("markdown-preview")
  const splitMarkdownPreview = document.getElementById("split-markdown-preview")
  const fileNameInput = document.getElementById("file-name")
  const fileInput = document.getElementById("file-input")
  const lineCount = document.getElementById("line-count")
  const charCount = document.getElementById("char-count")
  const editorMode = document.getElementById("editor-mode")

  // Tab elements
  const codeTab = document.getElementById("code-tab")
  const previewTab = document.getElementById("preview-tab")
  const splitTab = document.getElementById("split-tab")
  const codeContent = document.getElementById("code-content")
  const previewContent = document.getElementById("preview-content")
  const splitContent = document.getElementById("split-content")

  // Button elements
  const newFileBtn = document.getElementById("new-file-btn")
  const openFileBtn = document.getElementById("open-file-btn")
  const saveBtn = document.getElementById("save-btn")
  const exportBtn = document.getElementById("export-btn")
  const importBtn = document.getElementById("import-btn")
  const exportMenu = document.getElementById("export-menu")
  const importMenu = document.getElementById("import-menu")

  // Sample markdown content
  const sampleMarkdown = `# Welcome to Markdown Editor

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

![Image placeholder](./images/placeholder.png)

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`

  // Initialize with sample content
  markdownInput.value = sampleMarkdown
  splitMarkdownInput.value = sampleMarkdown
  updatePreview()
  updateCounts()

  // Set up marked.js options
  const marked = window.marked
  const DOMPurify = window.DOMPurify

  marked.setOptions({
    breaks: true,
    gfm: true,
  })

  // Event Listeners

  // Tab switching
  codeTab.addEventListener("click", () => {
    setActiveTab("code")
  })

  previewTab.addEventListener("click", () => {
    setActiveTab("preview")
  })

  splitTab.addEventListener("click", () => {
    setActiveTab("split")
  })

  // Markdown input events
  markdownInput.addEventListener("input", () => {
    splitMarkdownInput.value = markdownInput.value
    updatePreview()
    updateCounts()
  })

  splitMarkdownInput.addEventListener("input", () => {
    markdownInput.value = splitMarkdownInput.value
    updatePreview()
    updateCounts()
  })

  // File operations
  newFileBtn.addEventListener("click", handleNewFile)
  openFileBtn.addEventListener("click", () => fileInput.click())
  fileInput.addEventListener("change", handleFileOpen)
  saveBtn.addEventListener("click", handleSave)

  // Dropdown menus
  exportBtn.addEventListener("click", () => {
    toggleDropdown(exportMenu)
  })

  importBtn.addEventListener("click", () => {
    toggleDropdown(importMenu)
  })

  // Export format selection
  document.querySelectorAll("#export-menu .dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      const format = item.getAttribute("data-format")
      handleExport(format)
      exportMenu.classList.remove("show")
    })
  })

  // Import format selection
  document.querySelectorAll("#import-menu .dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      fileInput.click()
      importMenu.classList.remove("show")
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      exportMenu.classList.remove("show")
      importMenu.classList.remove("show")
    }
  })

  // Functions

  // Set active tab
  function setActiveTab(tab) {
    // Remove active class from all tabs and content
    ;[codeTab, previewTab, splitTab].forEach((el) => el.classList.remove("active"))
    ;[codeContent, previewContent, splitContent].forEach((el) => el.classList.remove("active"))

    // Add active class to selected tab and content
    if (tab === "code") {
      codeTab.classList.add("active")
      codeContent.classList.add("active")
      editorMode.textContent = "Editing"
    } else if (tab === "preview") {
      previewTab.classList.add("active")
      previewContent.classList.add("active")
      editorMode.textContent = "Previewing"
    } else if (tab === "split") {
      splitTab.classList.add("active")
      splitContent.classList.add("active")
      editorMode.textContent = "Split View"
    }
  }

  // Update markdown preview
  function updatePreview() {
    const markdown = markdownInput.value
    const html = DOMPurify.sanitize(marked.parse(markdown))
    markdownPreview.innerHTML = html
    splitMarkdownPreview.innerHTML = html
  }

  // Update line and character counts
  function updateCounts() {
    const text = markdownInput.value
    const lines = text.split("\n").length
    const chars = text.length

    lineCount.textContent = `${lines} lines`
    charCount.textContent = `${chars} characters`
  }

  // Handle new file creation
  function handleNewFile() {
    if (confirm("Create a new file? Unsaved changes will be lost.")) {
      markdownInput.value = ""
      splitMarkdownInput.value = ""
      fileNameInput.value = "untitled.md"
      updatePreview()
      updateCounts()
    }
  }

  // Handle file open
  function handleFileOpen(e) {
    const file = e.target.files[0]
    if (!file) return

    fileNameInput.value = file.name

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      markdownInput.value = content
      splitMarkdownInput.value = content
      updatePreview()
      updateCounts()
    }
    reader.readAsText(file)
  }

  // Handle file save
  function handleSave() {
    const content = markdownInput.value
    const fileName = fileNameInput.value
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle file export
  function handleExport(format) {
    const content = markdownInput.value
    let exportFileName = fileNameInput.value
    let exportContent = content
    let mimeType = "text/plain"

    // Handle different export formats
    if (format === "html") {
      exportFileName = exportFileName.replace(/\.md$/, ".html")
      const htmlContent = marked.parse(content)
      exportContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${exportFileName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      padding: 2rem;
      max-width: 50rem;
      margin: 0 auto;
    }
    pre {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 0.25rem;
      overflow: auto;
    }
    code {
      background-color: #f5f5f5;
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-family: monospace;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1rem;
      margin-left: 0;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.5rem;
    }
    img {
      max-width: 100%;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`
      mimeType = "text/html"
    } else if (format === "txt") {
      exportFileName = exportFileName.replace(/\.md$/, ".txt")
    }

    const blob = new Blob([exportContent], { type: mimeType })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = exportFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Toggle dropdown menu
  function toggleDropdown(menu) {
    menu.classList.toggle("show")
  }

  // Initialize preview
  updatePreview()
})
