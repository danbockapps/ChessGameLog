import MainMenu from './mainMenu'

export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <>
      <div className="flex justify-between items-center bg-gray-800 text-white h-16 pl-4">
        <h1 className="text-xl font-bold">ChessLog</h1>
        <MainMenu />
      </div>

      {children}
    </>
  )
}
