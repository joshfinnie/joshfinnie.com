export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/blog/', label: 'Blog' },
  { href: '/skills/', label: 'Skills' },
  { href: '/projects/', label: 'Projects' },
];

export const footerNavLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/blog/', label: 'Blog' },
  { href: '/notes/', label: 'Notes' },
  { href: '/skills/', label: 'Skills' },
  { href: '/projects/', label: 'Projects' },
  { href: '/rss.xml', label: 'RSS' },
];
