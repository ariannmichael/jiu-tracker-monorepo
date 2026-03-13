import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jiu Tracker | Acompanhe sua evolução no Jiu-Jitsu",
  description:
    "Registre treinos, acompanhe estatísticas e organize técnicas com um app feito para praticantes de Jiu-Jitsu.",
  verification: {
    google: "cARWrLni4VcQ_Wi_6uAoYrp164ly5CK-NSQbcZS115w",
  },
  openGraph: {
    title: "Jiu Tracker | Acompanhe sua evolução no Jiu-Jitsu",
    description:
      "Registro de treinos, estatísticas detalhadas e biblioteca de técnicas para evoluir com mais intenção.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jiu Tracker | Acompanhe sua evolução no Jiu-Jitsu",
    description:
      "Treinos, estatísticas e técnicas para praticantes que querem evoluir com clareza.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics/>
      </body>
    </html>
  );
}
