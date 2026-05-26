export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/blog/', label: 'Blog' },
  { href: '/projects/', label: 'Projects' },
];

export const footerNavLinks: NavLink[] = [...navLinks, { href: '/rss.xml', label: 'RSS' }];
