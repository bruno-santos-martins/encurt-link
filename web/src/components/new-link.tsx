export function NewLink() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col py-8">
      {/* Logo com responsividade */}
      <div className="mb-6 flex justify-center md:justify-start">
        <img src="/logo.svg" alt="brev.ly logo" className="h-6" />
      </div>

      {/* Layout principal responsivo */}
      <div className="max-w-none flex flex-col gap-8 md:flex-row md:justify-center ">
        {/* Card: Novo link */}
        <div className="bg-white p-8 rounded-lg shadow-md max-w-none md:max-w-md flex-1 md:w-[600px]">
          <h2 className="text-2xl font-semibold mb-6">Novo link</h2>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">
              Link original
            </label>
            <input
              type="text"
              placeholder="www.exemplo.com.br"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">
              Link encurtado
            </label>
            <input
              type="text"
              placeholder="brev.ly/"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button className="w-full bg-indigo-400 hover:bg-indigo-500 text-white font-medium py-3 rounded-md text-base transition">
            Salvar link
          </button>
        </div>

        {/* Card: Meus links */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full flex-1 md:w-[700px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Meus links</h2>
            <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-300">
              Baixar CSV
            </button>
          </div>

          <div className="flex flex-col items-center justify-center text-center text-sm text-gray-500 h-40 border-t pt-4">
            <img
              src="/link-icon.svg"
              alt="Link ícone"
              className="w-6 h-6 mb-2"
            />
            AINDA NÃO EXISTEM LINKS CADASTRADOS
          </div>
        </div>
      </div>
    </div>
  );
}
