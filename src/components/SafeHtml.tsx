// src/components/SafeHtml.tsx
import DOMPurify from "dompurify";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export default function SafeHtml({ html, className }: Readonly<SafeHtmlProps>) {
  const clean = DOMPurify.sanitize(html);
  return (
    // The HTML is sanitized with DOMPurify, so usage of dangerouslySetInnerHTML is safe here.
    // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
