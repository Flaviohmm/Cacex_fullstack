import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

interface Empregado {
    id: number;
    nome: string;
    cpf: string;
    pis_pasep: string;
}

interface IndividualizacaoFGTS {
    id: number;
    mes_ano: string;
    renumeracao_bruta: string;
    valor_fgts: string;
}

const EmpregadoFGTSTable: React.FC = () => {
    const [empregadoFGTS, setEmpregadoFGTS] = useState<IndividualizacaoFGTS[]>([]);
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

        const fetchEmpregadosFGTS = async () => {
            try {
                const response = await axios.get('http://localhost:8000/individualizacao_fgts/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                
                if (Array.isArray(response.data)) {
                    setEmpregadoFGTS(response.data);
                } else {
                    console.error("Estrutura de dados inesperada:", response.data);
                    setEmpregadoFGTS([]);
                }
            } catch (error) {
                console.error("Erro ao buscar dados de FGTS:", error);
                setEmpregadoFGTS([]);
            }
        };

        fetchEmpregado();
        fetchEmpregadosFGTS();
    }, [token]);

    // Função para formatar CPF
    const formatCPF = (cpf: string) => {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    };

    // Função para formatar PIS/PASEP
    const formatPISPasep = (pis: string) => {
        return pis.replace(/^(\d{3})(\d{5})(\d{2})(\d)$/, '$1.$2.$3-$4');
    }

    // Função para formatar mês/ano
    const formatMonthYear = (mesAno: string) => {
        const [year, month] = mesAno.split('-'); // Supondo que o formato seja "YYYY-MM"
        return `${month}/${year}`;
    };

    // Função para formatar valores monetários
    const formatCurrency = (value: number) => {
        return `R$ ${value.toLocaleString('pt-BR', { 
            style: 'decimal',
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })}`;
    };

    // Função de exclusão
    const handleDelete = async (id: number) => {
        const confirmar = window.confirm("Você tem certeza que deseja excluir está individualização de FGTS?");
        if (confirmar) {
            try {
                await axios.delete(`http://localhost:8000/individualizacao_fgts/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                // Atualiza a tabela após a exclusão
                setEmpregadoFGTS(empregadoFGTS.filter(item => item.id !== id));
                alert("Individualização de FGTS excluída com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir individualização de FGTS:", error);
                alert("Ocorreu um erro ao excluir a individualização.");
            }
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Tabela de Individualização de FGTS</h2>
            <div className="overflow-x-auto p-4">
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Nome do Empregado</th>
                            <th className="px-4 py-2 text-left">CPF</th>
                            <th className="px-4 py-2 text-left">PIS/PASEP</th>
                            <th className="px-4 py-2 text-left">Mês/Ano</th>
                            <th className="px-4 py-2 text-left">Renumuneração Bruta</th>
                            <th className="px-4 py-2 text-left">Valor do FGTS</th>
                            <th className="px-4 py-2 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empregadoFGTS.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{empregados.map((empregado) => empregado.nome)}</td>
                                <td className="border px-4 py-2">{empregados.map((empregado) => formatCPF(empregado.cpf))}</td>
                                <td className="border px-4 py-2">{empregados.map((empregado) => formatPISPasep(empregado.pis_pasep))}</td>
                                <td className="border px-4 py-2">{formatMonthYear(item.mes_ano)}</td>
                                <td className="border px-4 py-2">{formatCurrency(parseFloat(item.renumeracao_bruta))}</td>
                                <td className="border px-4 py-2">{formatCurrency(parseFloat(item.valor_fgts))}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/editar_individualizacao/${item.id}`)}
                                        className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-1 ml-2"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => handleDelete(item.id)} // Chamada à função handleDelete
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

export default EmpregadoFGTSTable;