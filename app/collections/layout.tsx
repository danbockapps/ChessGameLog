import MainMenu from './mainMenu'

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <>
      <div className="flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-950 text-white h-16 pl-4">
        <h1 className="text-xl font-bold">ChessLog</h1>
        <MainMenu />
      </div>

      <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-gray-100">{children}</div>
    </>
  )
}
