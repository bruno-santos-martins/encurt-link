import notFound from "../img/404.svg";
import { useEffect } from "react";
import { api } from "../util/api";

const apitWeb = import.meta.env.VITE_WEB_URL;

export function NotFound() {
 

  useEffect(() => {
    api
      .get("/links")
      .then((response) => {
        
      })
      .catch((error) => {
        console.error("Erro ao buscar links:", error);
      });
  }, []);

  return (
   <div className="bg-white px-8 p-20 rounded-lg shadow w-full max-w-md text-center">
      <div className="flex flex-col items-center gap-4">
        <img src={notFound} className="animate-pulse" alt="Logo"/>
        <h1 className="text-xl font-bold text-gray-800">Link não encontrado</h1>

        <p className="text-gray-700 text-sm">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em
          <a href="#" className="text-blue-600 hover:underline font-bold"> Acesse aqui </a>
        </p>
      </div>
    </div>
  );
}
