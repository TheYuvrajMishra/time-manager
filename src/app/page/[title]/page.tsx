'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Table2,
  StickyNote,
  ImagePlus,
  Trash2,
  Type
} from 'lucide-react';

export default function PageView() {
  const params = useParams();
  const title = decodeURIComponent(params.title as string);
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(`page-${title}`);
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
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr><th>Header 1</th><th>Header 2</th></tr>
        <tr><td>Row 1</td><td>Row 1</td></tr>
        <tr><td>Row 2</td><td>Row 2</td></tr>
      </table><br/>
    `;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, tableHTML);
      saveContent();
    }
  };

  const insertStickyNote = () => {
    const noteHTML = `
      <div style="background-color: #fff3cd; color: #856404; padding: 10px; margin: 10px 0; border-left: 5px solid #ffecb5;">
        📝 Sticky Note: Write something here...
      </div>
    `;
    document.execCommand('insertHTML', false, noteHTML);
    saveContent();
  };

  const highlightText = () => {
    execCommand('backColor', 'yellow');
  };

  const insertImage = () => {
    const url = prompt('Enter image URL');
    if (url) {
      const imageHTML = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" /><br/>`;
      document.execCommand('insertHTML', false, imageHTML);
      saveContent();
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this page?')) {
      localStorage.removeItem(`page-${title}`);
      const stored = localStorage.getItem('recentPages');
      if (stored) {
        const recent = JSON.parse(stored).filter((p: any) => p.title !== title);
        localStorage.setItem('recentPages', JSON.stringify(recent));
      }
      window.location.href = '/Home';
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] ml-[20%] text-white p-10 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 hover:underline transition duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Delete Page
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-700">
        <button onClick={() => execCommand('bold')} className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1">
          <Bold className="w-4 h-4" /> Bold
        </button>
        <button onClick={() => execCommand('italic')} className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1">
          <Italic className="w-4 h-4" /> Italic
        </button>
        <button onClick={() => execCommand('underline')} className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1">
          <Underline className="w-4 h-4" /> Underline
        </button>
        <button onClick={highlightText} className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1">
          <Highlighter className="w-4 h-4" /> Highlight
        </button>
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          className="px-3 py-2 bg-gray-800 rounded text-white"
        >
          <option value="3">Font Size</option>
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
        <input
          type="color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          className="w-10 h-10 bg-transparent border-none cursor-pointer"
        />
        <button onClick={insertTable} className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1">
          <Table2 className="w-4 h-4" /> Table
        </button>
        <button onClick={insertStickyNote} className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1">
          <StickyNote className="w-4 h-4" /> Note
        </button>
        <button onClick={insertImage} className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-1">
          <ImagePlus className="w-4 h-4" /> Image
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={saveContent}
        className="w-full h-[70vh] p-6 bg-[#2c2c2c] text-white border border-gray-700 rounded-xl overflow-y-auto focus:outline-none"
        suppressContentEditableWarning={true}
      >
        {/* Editable Content */}
      </div>
    </div>
  );
}
