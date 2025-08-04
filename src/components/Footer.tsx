// src\components\Footer.tsx

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center text-sm">
      <a
        href="https://github.com/Ange230700/nihil_frontend"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        View code source on GitHub
      </a>
      <p>&copy; {currentYear} V∅ID. All rights reserved.</p>
    </footer>
  );
}
