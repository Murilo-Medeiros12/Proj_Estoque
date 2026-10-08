import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Inventário" };

const links = [
  ["/", "Início"], ["/produtos", "Produtos"], ["/movimentacoes", "Movimentações"],
  ["/marcas", "Marcas e modelos"], ["/localizacoes", "Localizações e posições"], ["/funcionarios", "Funcionários"],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-blue-700 text-white px-6 py-4 flex gap-6 items-center">
          <b className="mr-auto text-lg">Inventário</b>
          {links.map(([href, t]) => <Link key={href} href={href}>{t}</Link>)}
        </nav>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
