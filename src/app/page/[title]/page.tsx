"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  // List,
  // ListOrdered,
  // Heading,
  Table2,
  // StickyNote,
  ImagePlus,
  // Undo2,
  // Redo2,
  // FileDown,
  // FileText,
  // Sun,
  // Moon,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PageView() {
  const handleClear = () => {
    if (confirm("Are you sure you want to clear all content on this page?")) {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
        setContent("");
        localStorage.removeItem(`page-${title}`);
      }
    }
  };
  const router = useRouter();
  const params = useParams();
  const title = decodeURIComponent(params.title as string);
  const editorRef = useRef<HTMLDivElement>(null);
  const [, setContent] = useState("");

  useEffect(() => {
    const key = `page-${title}`;
    const stored = localStorage.getItem(key);

    // If no previous content exists for this page, insert the default welcome message
    if (!stored && title === "Welcome Page") {
      const welcomeMessage = `
        <h2 style="font-size: 40px; font-weight: bold; color: #4ade80; margin-bottom: 16px;">
          👋 Welcome to <span style="color:#22d3ee;">Time-Manager</span>
        </h2>
  
        <p style="font-size: 18px; margin-bottom: 12px; text-decoration: underline;">
          We're <strong style="color: #facc15;">excited</strong> to help you take control of your time and 
          <em style="color: #fb7185;">boost your productivity</em>.
        </p>
  
        <p style="font-size: 18px; margin-bottom: 12px;">
          Whether you're managing <u>daily tasks</u> or planning <u>long-term goals</u>, we’ve got your back with tools that keep you 
          <span style="color: #60a5fa;">organized</span> and 
          <span style="color: #f87171;">stress-free</span>.
        </p>
  
        <p style="font-size: 18px; margin-bottom: 12px;">
          From schedules to progress tracking—<strong style="color: #34d399;">it’s all here</strong>.
        </p>
  
        <p style="font-size: 18px; margin-top: 20px; border-left: 4px solid #4ade80; padding-left: 12px; color: #d4d4d4;">
          ⏳ <strong>Let's make every minute count.</strong><br>
          Start organizing your day the smart way. 🚀
        </p>
      `;
      localStorage.setItem(key, welcomeMessage);
      editorRef.current!.innerHTML = welcomeMessage;
      setContent(welcomeMessage);
    }

    if (stored && editorRef.current) {
      editorRef.current.innerHTML = stored;
      setContent(stored);
    }
  }, [title]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    saveContent();
  };

  const saveContent = () => {
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML;
      setContent(updatedContent);
      localStorage.setItem(`page-${title}`, updatedContent);
    }
  };

  const insertTable = () => {
    const tableHTML = `
      <table data-theme="dark" style="border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 16px;">
        <thead>
          <tr style="background-color: #374151; color: white;">
            <th style="padding: 12px; border: 1px solid #4b5563;">Header 1</th>
            <th style="padding: 12px; border: 1px solid #4b5563;">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #1f2937; color: white;">
            <td style="padding: 12px; border: 1px solid #4b5563;">Row 1</td>
            <td style="padding: 12px; border: 1px solid #4b5563;">Row 1</td>
          </tr>
        </tbody>
      </table><br/>
    `;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, tableHTML);
      saveContent();
    }
  };


  const [isHighlighted, setIsHighlighted] = useState(false);

  const highlightText = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    if (!isHighlighted) {
      document.execCommand("backColor", false, "yellow");
      document.execCommand("foreColor", false, "black");
    } else {
      document.execCommand("backColor", false, "transparent");
      document.execCommand("foreColor", false, "inherit");
    }
    setIsHighlighted(!isHighlighted);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      const imageHTML = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" /><br/>`;
      document.execCommand("insertHTML", false, imageHTML);
      saveContent();
    }
  };
  type TrashedPage = {
    title: string;
    content: string;
    date: string;
  };
  
  const [trashedPages, setTrashedPages] = useState<TrashedPage[]>([]);
  
  // const [showTrash, setShowTrash] = useState(false);

  useEffect(() => {
    const storedTrash = localStorage.getItem("trashedPages");
    if (storedTrash) {
      setTrashedPages(JSON.parse(storedTrash));
    }
  }, []);

  const handleDelete = () => {
    if (confirm("Are you sure you want to move this page to trash?")) {
      const key = `page-${title}`;
      const storedPage = localStorage.getItem(key);
      if (storedPage) {
        const updatedTrash = [
          ...trashedPages,
          { title, content: storedPage, date: new Date().toLocaleString() },
        ];
        localStorage.setItem("trashedPages", JSON.stringify(updatedTrash));
        setTrashedPages(updatedTrash);
      }

      localStorage.removeItem(key);

      const stored = localStorage.getItem("recentPages");
      if (stored) {
        const recent = JSON.parse(stored).filter((p: any) => p.title !== title);
        localStorage.setItem("recentPages", JSON.stringify(recent));
      }
      window.location.href = "/Home";
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] ml-[20%] text-white p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-6">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <button
          onClick={() => (router.push("/Home"))}
          className="flex items-center gap-2 bg-black text-white border border-dashed border-white/30 px-2 py-2 rounded-xl transition-all hover:bg-white/90 hover:text-black hover:border-white/50 shadow-md transform cursor-pointer"
          title="Back to Home"
        >
          🏠 Back to Home
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 p-4 bg-[#2a2a2a] border border-gray-700 rounded-xl">
        {/* Formatting */}
        <div className="flex gap-2 border-r pr-4 border-gray-600">
          <button
            onClick={() => execCommand("bold")}
            className="toolbar-btn"
            title="Bold"
          >
            <Bold className="w-5 h-5" />
          </button>
          <button
            onClick={() => execCommand("italic")}
            className="toolbar-btn"
            title="Italic"
          >
            <Italic className="w-5 h-5" />
          </button>
          <button
            onClick={() => execCommand("underline")}
            className="toolbar-btn"
            title="Underline"
          >
            <Underline className="w-5 h-5" />
          </button>
          <button
            onClick={highlightText}
            className="toolbar-btn"
            title="Highlight"
          >
            <Highlighter className="w-5 h-5" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-2 border-r pr-4 border-gray-600">
          <button
            onClick={() => execCommand("justifyLeft")}
            className="toolbar-btn"
            title="Align Left"
          >
            <AlignLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => execCommand("justifyCenter")}
            className="toolbar-btn"
            title="Align Center"
          >
            <AlignCenter className="w-5 h-5" />
          </button>
          <button
            onClick={() => execCommand("justifyRight")}
            className="toolbar-btn"
            title="Align Right"
          >
            <AlignRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => execCommand("justifyFull")}
            className="toolbar-btn"
            title="Justify"
          >
            <AlignJustify className="w-5 h-5" />
          </button>
        </div>

        {/* Lists */}
        {/* <div className="flex gap-2 border-r pr-4 border-gray-600">
      <button onClick={() => execCommand('insertUnorderedList')} className="toolbar-btn" title="Bullet List"><List className="w-5 h-5" /></button>
      <button onClick={() => execCommand('insertOrderedList')} className="toolbar-btn" title="Numbered List"><ListOrdered className="w-5 h-5" /></button>
    </div> */}

        {/* Headings */}
        <select
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          className="toolbar-select"
          title="Heading Style"
        >
          <option value="div">Normal</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="blockquote">Quote</option>
        </select>

        {/* Font size */}
        <select
          onChange={(e) => execCommand("fontSize", e.target.value)}
          className="toolbar-select"
          title="Font Size"
        >
          <option value="3">Size</option>
          <option value="1">S</option>
          <option value="3">M</option>
          <option value="5">L</option>
          <option value="7">XL</option>
        </select>

        {/* Font color */}
        <input
          type="color"
          onChange={(e) => execCommand("foreColor", e.target.value)}
          className="w-10 h-10 bg-transparent border-none cursor-pointer"
          title="Text Color"
        />

        {/* Insert */}
        <button
          onClick={insertTable}
          className="toolbar-btn"
          title="Insert Table"
        >
          <Table2 className="w-5 h-5" />
        </button>
        {/* <button onClick={insertStickyNote} className="toolbar-btn" title="Insert Note"><StickyNote className="w-5 h-5" /></button> */}
        <button
          onClick={insertImage}
          className="toolbar-btn"
          title="Insert Image"
        >
          <ImagePlus className="w-5 h-5" />
        </button>
        <div className="ml-auto">
        <button
          onClick={handleClear}
          className="flex items-center gap-2 text-white px-2 py-2 transition-all  hover:text-red-500 hover:underline transform cursor-pointer"
          title="Clear Page"
        >
        Clear
        </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={saveContent}
        className="w-full h-full p-6 bg-[#2c2c2c] text-white border border-gray-700 rounded-xl overflow-y-auto focus:outline-none"
        suppressContentEditableWarning={true}
      >
        {/* Editable content goes here */}
      </div>

      <div className="pt-6 flex justify-end gap-2">
        {/* Back to Home Button */}

        {/* Clear Button */}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-500 text-white border border-dashed border-white/30 px-2 py-2 rounded-xl transition-all hover:bg-white/90 hover:text-black hover:border-black/50 shadow-md transform cursor-pointer"
          title="Delete Page"
        >
          <Trash2 className="w-5 h-5" />
          Delete Page
        </button>
      </div>
    </div>
  );
}
