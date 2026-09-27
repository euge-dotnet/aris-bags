import { useEffect } from "react";

type DocumentMetaProps = {
  title: string;
  description: string;
};

export function DocumentMeta({ title, description }: DocumentMetaProps) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
