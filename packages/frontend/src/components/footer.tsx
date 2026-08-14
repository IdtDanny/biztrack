'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Button } from '@/components/ui/button';

const footerLinks = {
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
  ],
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Integrations', href: '/integrations' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact', href: '/contact' },
    { label: 'Status', href: '/status' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialIcons = [
  { icon: FaFacebook, href: '#' },
  { icon: FaTwitter, href: '#' },
  { icon: FaInstagram, href: '#' },
  { icon: FaLinkedin, href: '#' },
];

export function Footer() {
  return (
    <footer className="w-full glass-deep border-t border-white/5 dark:border-white/5">
      <div className="container mx-auto px-4 py-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-bold gradient-text">Ubucuruzi ERP</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              The all‑in‑one business management platform for Rwandan enterprises.
              Inventory, sales, customers, and compliance – beautifully unified.
            </p>
            <div className="mt-6 flex gap-3">
              {socialIcons.map(({ icon: Icon, href }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className="w-9 h-9 rounded-full glass-modern flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider opacity-80">
                {category}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter section – glassy separator instead of border */}
        <div className="relative mt-12 pt-8">
          {/* Subtle gradient separator */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Subscribe to our newsletter</span>
              {' '}for product updates and tips.
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 sm:w-64 px-4 py-2 rounded-full glass-modern border border-white/10 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              <Button size="sm" className="gradient-primary text-white shadow-lg shadow-blue-500/25 rounded-full px-4 hover:shadow-blue-500/40 transition-shadow">
                <MdEmail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-muted-foreground/70">
            &copy; {new Date().getFullYear()} Ubucuruzi ERP. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

// 'use client';

// import Link from 'next/link';
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
// import { MdEmail } from 'react-icons/md';
// import { Button } from '@/components/ui/button';

// const footerLinks = {
//   Company: [
//     { label: 'About', href: '/about' },
//     { label: 'Careers', href: '/careers' },
//     { label: 'Blog', href: '/blog' },
//   ],
//   Product: [
//     { label: 'Features', href: '/features' },
//     { label: 'Pricing', href: '/pricing' },
//     { label: 'Integrations', href: '/integrations' },
//   ],
//   Support: [
//     { label: 'Help Center', href: '/help' },
//     { label: 'Contact', href: '/contact' },
//     { label: 'Status', href: '/status' },
//   ],
//   Legal: [
//     { label: 'Privacy Policy', href: '/privacy' },
//     { label: 'Terms of Service', href: '/terms' },
//     { label: 'Cookie Policy', href: '/cookies' },
//   ],
// };

// const socialIcons = [
//   { icon: FaFacebook, href: '#' },
//   { icon: FaTwitter, href: '#' },
//   { icon: FaInstagram, href: '#' },
//   { icon: FaLinkedin, href: '#' },
// ];

// export function Footer() {
//   return (
//     <footer className="border-t border-border/40 bg-background/50 backdrop-blur-lg">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
//           {/* Brand column */}
//           <div className="lg:col-span-2">
//             <Link href="/" className="flex items-center space-x-2">
//               <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/20">
//                 <span className="text-white font-bold text-sm">B</span>
//               </div>
//               <span className="text-lg font-bold gradient-text">Ubucuruzi ERP</span>
//             </Link>
//             <p className="mt-4 text-sm text-muted-foreground max-w-xs">
//               The all‑in‑one business management platform for Rwandan enterprises.
//               Inventory, sales, customers, and compliance – beautifully unified.
//             </p>
//             <div className="mt-6 flex gap-3">
//               {socialIcons.map(({ icon: Icon, href }, idx) => (
//                 <Link
//                   key={idx}
//                   href={href}
//                   className="w-9 h-9 rounded-full glass-modern flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
//                   aria-label="Social link"
//                 >
//                   <Icon className="h-4 w-4" />
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Links columns */}
//           {Object.entries(footerLinks).map(([category, links]) => (
//             <div key={category}>
//               <h3 className="font-semibold text-foreground">{category}</h3>
//               <ul className="mt-4 space-y-2 text-sm">
//                 {links.map((link) => (
//                   <li key={link.label}>
//                     <Link
//                       href={link.href}
//                       className="text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Newsletter signup */}
//         <div className="mt-12 pt-8 border-t border-border/40">
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div className="text-sm text-muted-foreground">
//               <span className="font-medium text-foreground">Subscribe to our newsletter</span>
//               {' '}for product updates and tips.
//             </div>
//             <div className="flex w-full sm:w-auto gap-2">
//               <input
//                 type="email"
//                 placeholder="Your email"
//                 className="flex-1 sm:w-64 px-4 py-2 rounded-full glass-modern border border-white/10 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//               />
//               <Button size="sm" className="gradient-primary text-white shadow-lg shadow-blue-500/25 rounded-full px-4">
//                 <MdEmail className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//           <div className="mt-6 text-center text-xs text-muted-foreground">
//             &copy; {new Date().getFullYear()} Ubucuruzi ERP. All rights reserved.
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }