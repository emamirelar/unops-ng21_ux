export interface FooterProps {
  copyright?: string;
}

export function Footer({ copyright }: FooterProps) {
  return (
    <footer className="layout-footer">
      <span className="footer-copyright">
        {copyright ?? `\u00A9 UNOPS ${new Date().getFullYear()}`}
      </span>
    </footer>
  );
}
