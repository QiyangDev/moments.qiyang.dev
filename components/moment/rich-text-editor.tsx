"use client";

import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  UndoIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Tiptap, useEditor, useTiptap } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

type RichTextEditorProps = {
  id: string;
  name: string;
  placeholder: string;
  required?: boolean;
  toolbarEnd?: React.ReactNode;
  value?: string;
};

type ToolbarButtonProps = {
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  disabled,
  label,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Button
      aria-label={label}
      className="shadow-none"
      disabled={disabled}
      onClick={onClick}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      {children}
    </Button>
  );
}

type ToolbarToggleProps = {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarToggle({
  active,
  label,
  onClick,
  children,
}: ToolbarToggleProps) {
  return (
    <Toggle
      aria-label={label}
      onPressedChange={onClick}
      pressed={active}
      size="icon-sm"
    >
      {children}
    </Toggle>
  );
}

function EditorToolbar({ toolbarEnd }: { toolbarEnd?: React.ReactNode }) {
  const { editor } = useTiptap();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 px-3 py-2">
      <ToolbarButton
        disabled={!editor.can().chain().focus().undo().run()}
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <UndoIcon />
      </ToolbarButton>
      <ToolbarButton
        disabled={!editor.can().chain().focus().redo().run()}
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <RedoIcon />
      </ToolbarButton>
      <ToolbarToggle
        active={editor.isActive("bold")}
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("italic")}
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("strike")}
        label="Strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("heading", { level: 1 })}
        label="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1Icon />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("heading", { level: 2 })}
        label="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("bulletList")}
        label="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("orderedList")}
        label="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("blockquote")}
        label="Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <QuoteIcon />
      </ToolbarToggle>
      {toolbarEnd ? (
        <div className="ml-auto flex items-center gap-2">{toolbarEnd}</div>
      ) : null}
    </div>
  );
}

export function RichTextEditor({
  id,
  name,
  placeholder,
  required,
  toolbarEnd,
  value,
}: RichTextEditorProps) {
  const initialHtml = useMemo(
    () => (value && value.trim() ? value : "<p></p>"),
    [value],
  );
  const [html, setHtml] = useState(initialHtml);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-56 px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setHtml(currentEditor.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <input name={name} type="hidden" value={html} />
      <input
        aria-hidden="true"
        className="sr-only"
        onChange={() => undefined}
        required={required}
        tabIndex={-1}
        value={html.replace(/<[^>]*>/g, "").trim()}
      />
      {editor ? (
        <Tiptap instance={editor ?? undefined}>
          <EditorToolbar toolbarEnd={toolbarEnd} />
          <Tiptap.Content id={id} />
        </Tiptap>
      ) : (
        <div className="min-h-56 px-4 py-3 text-sm text-muted-foreground">
          Loading editor...
        </div>
      )}
    </div>
  );
}
