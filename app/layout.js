import './globals.css'

export const metadata = {
  title: 'Mutlu Başlangıç',
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