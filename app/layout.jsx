import './globals.css'

export const metadata = {
  title: 'Instituto Chui Calonego — Engenharia Civil e Arquitetura',
  description: 'Sistema especialista de engenharia civil e arquitetura com IA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
