'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML;
      setContent(updatedContent);
      localStorage.setItem(`page-${title}`, updatedContent);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      localStorage.setItem(`page-${title}`, newContent);
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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <button
          onClick={handleDelete}
          className="text-sm text-red-400 hover:text-red-300 hover:underline transition duration-200"
        >
          Delete Page
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex space-x-2 pb-2 border-b border-gray-700">
        <button onClick={() => execCommand('bold')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Bold</button>
        <button onClick={() => execCommand('italic')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Italic</button>
        <button onClick={() => execCommand('underline')} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Underline</button>
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          className="bg-gray-700 text-white px-2 py-1 rounded"
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
          title="Text Color"
          className="w-8 h-8 bg-transparent border-0 cursor-pointer"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full h-[70vh] p-6 bg-[#2c2c2c] text-white border border-gray-700 rounded-xl overflow-y-auto focus:outline-none"
        // value="Start typing your thoughts..."
        suppressContentEditableWarning={true}
      ></div>
    </div>
  );
}
