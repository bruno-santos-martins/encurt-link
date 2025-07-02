import logo from "../img/logo.png";
import linkIcon from "../img/link.png";
import iconCopy from "../img/icon-copy.png";
import icontrash from "../img/icon-trash.png";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../util/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

const apitWeb = import.meta.env.VITE_WEB_URL;

type Link = {
  id: string;
  url: string;
  urlCurt: string;
  createdAt: string;
  visited: number;
};

const schema = z.object({
  url: z.string().url("Digite uma URL válida"),
  urlCurt: z.string().min(1, "Link encurtado é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function NewLink() {
  const [downloadCsv, setDownloadCsv] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api
      .get("/links")
      .then((response) => {
        setLinks(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar links:", error);
      });
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitError("");
    try {
      const response = await api.post("/link", data);
      setLinks((prev) => [response.data, ...prev]); // Adiciona novo link à lista
      reset();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response?.status === 409 || error.response?.status === 400) {
          setSubmitError("Este link já está cadastrado.");
        } else {
          setSubmitError("Erro ao salvar o link. Tente novamente.");
        }
      }
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await api.delete(`/link/${id}`);
      setLinks((prev) => prev.filter((link) => link.id !== id)); // remove da lista
    } catch (error) {
      console.error("Erro ao deletar link:", error);
    }
  };

  const handleCsv = async () => {
    setDownloadCsv(true);
    try {
      const response = await api.get(`/links-csv`);
      window.location.href = response.data.url;
      setDownloadCsv(false);
    } catch (error) {
      setDownloadCsv(false);
      console.error("Erro ao baixar links:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col py-8">
      <div className="mb-6 flex justify-center md:justify-start">
        <img src={logo} alt="brev.ly logo" className="h-6" />
        <span className="ml-2 text-[#2C46B1] font-bold">brev.ly</span>
      </div>

      <div className="max-w-none flex flex-col gap-8 md:flex-row md:justify-center">
        {/* Formulário de novo link */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-md max-w-none md:max-w-md flex-1 md:w-[600px]"
        >
          <h2 className="text-2xl font-semibold mb-6">Novo link</h2>

          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">
              Link original
            </label>
            <input
              {...register("url", { required: true })}
              type="text"
              placeholder="www.exemplo.com.br"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.url && (
              <span className="text-red-500 text-sm">{errors.url.message}</span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">
              Link encurtado
            </label>
            <div className="flex items-center w-full border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="px-4 py-3 text-gray-500 bg-gray-100 border-r border-gray-300">
                brev.ly/
              </span>
              <input
                {...register("urlCurt", { required: true })}
                type="text"
                placeholder="seu-link"
                className="flex-1 px-4 py-3 focus:outline-none"
              />
            </div>
          </div>
          {submitError && (
            <div className="mb-4 text-sm text-red-600 font-medium">
              {submitError}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-400 hover:bg-indigo-500 text-white font-medium py-3 rounded-md text-base transition"
          >
            Salvar link
          </button>
        </form>

        {/* Card: Meus links */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full flex-1 md:w-[700px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Meus links</h2>
            <button
              onClick={handleCsv}
              disabled={downloadCsv}
              className={`text-sm px-4 py-2 rounded-md border transition ${
                downloadCsv
                  ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {downloadCsv ? "Download..." : "Baixar CSV"}
            </button>
          </div>

          {!links.length && (
            <div className="flex flex-col items-center justify-center text-center text-sm text-gray-400 h-40 border-t pt-4">
              <img src={linkIcon} alt="Link ícone" className="w-6 h-6 mb-2" />
              AINDA NÃO EXISTEM LINKS CADASTRADOS
            </div>
          )}

          <ul className="space-y-4 border-t border-gray-200 pt-4">
            {links.map((item, i) => (
              <li
                key={i}
                className="border-b border-gray-200 last:border-b-0 pb-2"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Coluna do link */}
                  <div className=" ">
                    <a
                      href={apitWeb + item.urlCurt}
                      className="text-sm text-blue-600 font-medium hover:underline block"
                    >
                      {apitWeb}
                      {item.urlCurt}
                    </a>
                    <p className="text-sm text-gray-500 break-words max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.url}
                    </p>
                  </div>

                  {/* Coluna de ações */}
                  <div className="flex items-center gap-2 pt-1 flex-shrink-1">
                    <span className="text-sm text-gray-700">
                      {item.visited ?? 0} Acessos
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${apitWeb + item.urlCurt}`
                        );
                      }}
                      title="Copiar link"
                      className="p-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition"
                    >
                      <img src={iconCopy} />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(item.id)}
                      title="Deletar link"
                      className="p-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition"
                    >
                      <img src={icontrash} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
