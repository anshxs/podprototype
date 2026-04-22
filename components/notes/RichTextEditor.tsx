'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Heading2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const buttonClass = 'p-2 rounded-lg hover:bg-secondary text-foreground';

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex flex-wrap gap-1 p-3 border-b border-border bg-secondary/30">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            buttonClass,
            editor.isActive('bold') && 'bg-primary/20 text-primary'
          )}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            buttonClass,
            editor.isActive('italic') && 'bg-primary/20 text-primary'
          )}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            buttonClass,
            editor.isActive('heading', { level: 2 }) && 'bg-primary/20 text-primary'
          )}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            buttonClass,
            editor.isActive('bulletList') && 'bg-primary/20 text-primary'
          )}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            buttonClass,
            editor.isActive('orderedList') && 'bg-primary/20 text-primary'
          )}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            buttonClass,
            editor.isActive('codeBlock') && 'bg-primary/20 text-primary'
          )}
        >
          <Code className="w-4 h-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  );
}
