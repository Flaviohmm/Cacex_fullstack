import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

interface Empregado {
    id: number;
    nome: string;
    cpf: string;
    pis_pasep: string;
}

const ListEmpregado: React.FC = () => {
    const [empregados, setEmpregados] = useState<Empregado[]>([]);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpregado = async () => {
            try {
                const response = await axios.get('http://localhost:8000/empregado/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setEmpregados(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados de Empregados:", error);
            }
        }

        fetchEmpregado();
    }, [token]);

    // Função para formatar CPF
    const formatCPF = (cpf: string) => {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }

    // Função para formatar PIS/PASEP
    const formatPISPasep = (pis: string) => {
        return pis.replace(/^(\d{3})(\d{5})(\d{2})(\d)$/, '$1.$2.$3-$4');
    }

    // Função para excluir empregado
    const handleDelete = async (id: number) => {
        const confirmar = window.confirm("Você tem certeza que deseja excluir este empregado?");

        if (confirmar) {
            try {
                await axios.delete(`http://localhost:8000/empregado/${id}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                // Atualiza a lista de empregados após a exclusão
                setEmpregados(empregados.filter(empregado => empregado.id !== id));
                alert("Empregado excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir empregado:", error);
                alert("Ocorreu um erro ao excluir o empregado.")
            }
        }
    }

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Lista de Empregados</h2>
            <div className="overflow-x-auto p-5">
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="px-4 py-2 text-left">Nome do Empregado</th>
                            <th className="px-4 py-2 text-left">CPF</th>
                            <th className="px-4 py-2 text-left">PIS/PASEP</th>
                            <th className="px-4 py-2 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empregados.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{item.nome}</td>
                                <td className="border px-4 py-2">{formatCPF(item.cpf)}</td>
                                <td className="border px-4 py-2">{formatPISPasep(item.pis_pasep)}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/editar_empregado/${item.id}`)}
                                        className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-1 ml-2"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListEmpregado;