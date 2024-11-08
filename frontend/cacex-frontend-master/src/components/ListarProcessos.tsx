import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

interface Processo {
    id: number; // Identificador do processo
    processo: string;
    tipo_acao: string;
    autor: string;
    reu: string;
    status: string;
    data_abertura: string;
}

const ListarProcessos: React.FC = () => {
    const [processos, setProcessos] = useState<Processo[]>([]);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    const fetchProcessos = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/processos/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setProcessos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os processos:', error);
        }
    };

    useEffect(() => {
        fetchProcessos();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:8000/processos/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setProcessos(processos.filter((processo) => processo.id !== id));
        } catch (error) {
            console.error('Erro ao excluir o processo:', error);
        }
    };

    // Função para formatar a data no formato dd/mm/yyyy
    const formatarData = (date: string): string => {
        const [ano, mes, dia] = date.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <div>
            <Header />
            <h1 className="text-4xl font-bold text-center mb-5 mt-5">Lista de Processos</h1>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                {processos.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Processo</th>
                                    <th className="border border-gray-300 px-4 py-2">Tipo de Ação</th>
                                    <th className="border border-gray-300 px-4 py-2">Autor</th>
                                    <th className="border border-gray-300 px-4 py-2">Réu</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                    <th className="border border-gray-300 px-4 py-2">Data de Abertura</th>
                                    <th className="border border-gray-300 px-4 py-2">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processos.map((processo) => (
                                    <tr key={processo.id}>
                                        <td className="border border-gray-300 px-4 py-2">{processo.processo}</td>
                                        <td className="border border-gray-300 px-4 py-2">{processo.tipo_acao}</td>
                                        <td className="border border-gray-300 px-4 py-2">{processo.autor}</td>
                                        <td className="border border-gray-300 px-4 py-2">{processo.reu}</td>
                                        <td className="border border-gray-300 px-4 py-2">{processo.status}</td>
                                        <td className="border border-gray-300 px-4 py-2">{formatarData(processo.data_abertura)}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/editar_processo/${processo.id}`)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-1 mr-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(processo.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center mt-5">Nenhum processo encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ListarProcessos;