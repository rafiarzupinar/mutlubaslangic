import './globals.css'

export const metadata = {
  title: 'MutluBasla',
  description: 'Kolaylaştırın güçleştirmeyin müjdeleyin nefret ettirmeyim(s.a.v)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}