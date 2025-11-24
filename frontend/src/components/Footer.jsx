import { Zap, Github, Twitter, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const links = {
    product: [
      { name: 'Markets', path: '/' },
      { name: 'How It Works', path: '/about' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'Leaderboard', path: '/leaderboard' },
    ],
    resources: [
      { name: 'Documentation', path: '#' },
      { name: 'Smart Contract', path: '#' },
      { name: 'BNB Testnet', path: 'https://testnet.bscscan.com/' },
      { name: 'Support', path: '#' },
    ],
    social: [
      { name: 'Twitter', icon: Twitter, path: '#' },
      { name: 'Discord', icon: MessageCircle, path: '#' },
      { name: 'GitHub', icon: Github, path: '#' },
    ],
  };

  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-primary" fill="currentColor" />
              <span className="text-2xl font-bold gradient-text-primary">AION-X</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Decentralized prediction markets powered by blockchain. Predict, compete, and win.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="flex space-x-4">
              {links.social.map((social) => (
                <a
                  key={social.name}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass p-3 rounded-lg hover:bg-primary/10 transition-smooth group"
                >
                  <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-smooth" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AION-X. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built on <span className="text-accent font-semibold">Polygon</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
