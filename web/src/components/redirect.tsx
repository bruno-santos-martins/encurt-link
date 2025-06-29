import logo from "../img/logo.png";
import { useEffect } from "react";
import { api } from "../util/api";
import { useParams } from "react-router-dom";


export function RedirectUrl() {
 
 const { curt } = useParams<{ curt: string }>();

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await api.get(`/link/${curt}`);
        console.log("Dados recebidos:", response.data);

        // Redirecionar se a URL original existir:
        if (response.data?.urlOriginal) {
          window.location.href = response.data.urlOriginal;
        }
      } catch (error) {
        console.error("Erro ao buscar link:", error);
      }
    };

    if (curt) {
      fetchLink();
    }
  }, [curt]);

  return (
   <div className="bg-white px-10 p-20 rounded-lg shadow w-full max-w-md text-center">
      <div className="flex flex-col items-center gap-4">
        <img src={logo} className="animate-pulse" alt="Logo"/>
        <h1 className="text-xl font-bold text-gray-800">Redirecionando...</h1>

        <p className="text-gray-700 text-sm">
          O link será aberto automaticamente em alguns instantes.<br />
          Não foi redirecionado?
          <a href="#" className="text-blue-600 hover:underline font-bold"> Acesse aqui </a>
        </p>
      </div>
    </div>
  );
}
