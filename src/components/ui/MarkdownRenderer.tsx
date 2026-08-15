"use client";

import React from "react";

type BlockType = "paragraph" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "ul" | "ol" | "blockquote" | "code" | "hr";

interface Block {
  type: BlockType;
  lines: string[];
  language?: string;
}

/**
 * Parses raw markdown text into blocks (structural components)
 */
function parseMarkdownToBlocks(content: string): Block[] {
  if (!content) return [];
  
  // Normalize line endings
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code block handling (multiline mode)
    if (currentBlock && currentBlock.type === "code") {
      if (trimmed.startsWith("```")) {
        blocks.push(currentBlock);
        currentBlock = null;
      } else {
        currentBlock.lines.push(line); // Preserve original indentation for code
      }
      continue;
    }

    if (trimmed.startsWith("```")) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      const lang = trimmed.slice(3).trim();
      currentBlock = { type: "code", lines: [], language: lang };
      continue;
    }

    // 2. Horizontal Rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      blocks.push({ type: "hr", lines: [] });
      continue;
    }

    // 3. Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();
      const type = `h${level}` as BlockType;
      blocks.push({ type, lines: [headingText] });
      currentBlock = null;
      continue;
    }

    // 4. Blockquotes
    if (trimmed.startsWith(">")) {
      const quoteText = line.replace(/^\s*>\s?/, "");
      if (currentBlock && currentBlock.type === "blockquote") {
        currentBlock.lines.push(quoteText);
      } else {
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = { type: "blockquote", lines: [quoteText] };
      }
      continue;
    }

    // 5. Unordered List Items
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (ulMatch) {
      const itemText = ulMatch[2].trim();
      if (currentBlock && currentBlock.type === "ul") {
        currentBlock.lines.push(itemText);
      } else {
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = { type: "ul", lines: [itemText] };
      }
      continue;
    }

    // 6. Ordered List Items
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      const itemText = olMatch[2].trim();
      if (currentBlock && currentBlock.type === "ol") {
        currentBlock.lines.push(itemText);
      } else {
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = { type: "ol", lines: [itemText] };
      }
      continue;
    }

    // 7. Empty line ends structural blocks (except code blocks)
    if (trimmed === "") {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // 8. Paragraph text
    if (currentBlock && currentBlock.type === "paragraph") {
      currentBlock.lines.push(trimmed);
    } else {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = { type: "paragraph", lines: [trimmed] };
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

/**
 * Parses inline elements (bold, italic, code, links) within a string
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match bold (**text**), italic (*text*), inline code (`code`), or links ([text](url))
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    // Bold
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Italic
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    // Inline code
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="bg-slate-100/80 text-teal-600 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200/50">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Links
    if (part.startsWith("[") && part.includes("](")) {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 font-bold hover:text-teal-700 underline underline-offset-4 decoration-2 hover:decoration-teal-600 transition-all cursor-pointer"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    // Normal text
    return part;
  });
}

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = parseMarkdownToBlocks(content);

  return (
    <div className="space-y-6 text-slate-600 leading-relaxed text-[16px] md:text-lg">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case "h1":
            return (
              <h1 key={key} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-10 mb-6 tracking-tight leading-tight">
                {renderInlineMarkdown(block.lines[0])}
              </h1>
            );
          case "h2":
            return (
              <h2 key={key} className="text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight border-b border-slate-100 pb-3">
                {renderInlineMarkdown(block.lines[0])}
              </h2>
            );
          case "h3":
            return (
              <h3 key={key} className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">
                {renderInlineMarkdown(block.lines[0])}
              </h3>
            );
          case "h4":
            return (
              <h4 key={key} className="text-lg font-bold text-slate-900 mt-6 mb-2">
                {renderInlineMarkdown(block.lines[0])}
              </h4>
            );
          case "h5":
          case "h6":
            return (
              <h5 key={key} className="text-base font-bold text-slate-900 mt-6 mb-2">
                {renderInlineMarkdown(block.lines[0])}
              </h5>
            );
          case "blockquote":
            return (
              <blockquote key={key} className="border-l-4 border-teal-500 pl-6 py-2 my-6 italic text-slate-700 bg-slate-50/70 rounded-r-2xl shadow-sm">
                {renderInlineMarkdown(block.lines.join(" "))}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={key} className="list-disc pl-6 my-6 space-y-2.5 text-slate-600">
                {block.lines.map((line, idx) => (
                  <li key={idx} className="pl-1">
                    {renderInlineMarkdown(line)}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="list-decimal pl-6 my-6 space-y-2.5 text-slate-600">
                {block.lines.map((line, idx) => (
                  <li key={idx} className="pl-1">
                    {renderInlineMarkdown(line)}
                  </li>
                ))}
              </ol>
            );
          case "code":
            return (
              <pre key={key} className="bg-slate-900 text-slate-100 p-5 rounded-2xl my-6 overflow-x-auto text-sm font-mono leading-relaxed border border-slate-800 shadow-inner">
                <code>{block.lines.join("\n")}</code>
              </pre>
            );
          case "hr":
            return <hr key={key} className="border-slate-200 my-8" />;
          case "paragraph":
          default:
            return (
              <p key={key} className="my-5 text-slate-600 leading-relaxed text-[16px] md:text-lg">
                {renderInlineMarkdown(block.lines.join(" "))}
              </p>
            );
        }
      })}
    </div>
  );
}
