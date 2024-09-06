import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Ativo {
    id: number;
    nome: string;
    valor: string;
    circulante: boolean
}

interface Passivo {
    id: number;
    nome: string;
    valor: string;
    circulante: boolean;
}

const ListBalanco: React.FC = () => {
    const [ativosCirculantes, setAtivosCirculantes] = useState<Ativo[]>([]);
    const [passivosCirculantes, setPassivosCirculantes] = useState<Passivo[]>([]);
    const [ativosNaoCirculantes, setAtivosNaoCirculantes] = useState<Ativo[]>([]);
    const [passivosNaoCiculantes, setPassivosNaoCirculantes] = useState<Passivo[]>([]);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();
    const [totais, setTotais] = useState({
        totalAtivosCirculantes: '',
        totalPassivosCirculantes: '',
        totalAtivosNaoCirculantes: '',
        totalPassivosNaoCirculantes: '',
        totalAtivos: '',
        totalPassivos: '',
        patrimonioLiquido: '',
    });

    useEffect(() => {
        // Função para carregar os dados do balanço.
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:8000/balanco', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });  // Ajuste a URL da API conforme necessário
                const { ativos_circulantes, passivos_circulantes, ativos_nao_circulantes, passivos_nao_circulantes } = response.data;

                setAtivosCirculantes(ativos_circulantes);
                setPassivosCirculantes(passivos_circulantes);
                setAtivosNaoCirculantes(ativos_nao_circulantes);
                setPassivosNaoCirculantes(passivos_nao_circulantes);

                setTotais({
                    totalAtivosCirculantes: response.data.total_ativos_circulantes,
                    totalPassivosCirculantes: response.data.total_passivos_circulantes,
                    totalAtivosNaoCirculantes: response.data.total_ativos_nao_circulantes,
                    totalPassivosNaoCirculantes: response.data.total_passivos_nao_circulantes,
                    totalAtivos: response.data.total_ativos,
                    totalPassivos: response.data.total_passivos,
                    patrimonioLiquido: response.data.patrimonio_liquido,
                });
            } catch (error) {
                console.error("Erro ao carregar dados do balanço:", error);
            }
        }

        fetchData();
    }, []);

    const formatCurrency = (valor: number) => {
        return `R$ ${valor.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const handleDeleteAtivo = async (id: number, circulante: boolean) => {
        if (window.confirm('Deseja realmente excluir este ativo?')) {
            try {
                await axios.delete(`http://localhost:8000/ativos/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                if (circulante) {
                    setAtivosCirculantes(ativosCirculantes.filter(ativo => ativo.id !== id));
                } else {
                    setAtivosNaoCirculantes(ativosNaoCirculantes.filter(ativo => ativo.id !== id));
                }
            } catch (error) {
                console.error('Erro ao exclui ativo:', error);
            }
        }
    };

    const handleDeletePassivo = async (id: number, circulante: boolean) => {
        if (window.confirm('Deseja realmente excluir este passivo?')) {
            try {
                await axios.delete(`http://localhost:8000/passivos/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                if (circulante) {
                    setPassivosCirculantes(passivosCirculantes.filter(passivo => passivo.id !== id));
                } else {
                    setPassivosNaoCirculantes(passivosNaoCiculantes.filter(passivo => passivo.id !== id));
                }
            } catch (error) {
                console.error('Erro ao excluir passivo:', error);
            }
        }
    }

    return (
        <div>
            <Header />
            <div>
                <h1 className="text-4xl font-bold underline text-center mb-6 mt-5">Balanço Patrimonial</h1>

                <div className="overflow-x-auto shadow-md m-5">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th colSpan={3} className="text-center">Ativos Circulantes</th>
                                <th colSpan={3} className="text-center">Passivos Circulantes</th>
                            </tr>
                            <tr>
                                <th className="text-left">Ativo</th>
                                <th>Valor (R$)</th>
                                <th>Ações</th>
                                <th className="text-left">Passivo</th>
                                <th>Valor (R$)</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ativosCirculantes.map((ativo: Ativo, index: number) => (
                                <tr key={ativo.id}>
                                    <td>{ativo.nome}</td>
                                    <td className="text-center">{formatCurrency(parseFloat(ativo.valor))}</td>
                                    <td className="text-center space-x-4">
                                        <button 
                                            className="bg-blue-500 text-white font-bold px-4 py-2 text-center rounded hover:bg-blue-700"
                                            onClick={() => navigate(`/editar_ativo/${ativo.id}`)}
                                        >
                                            Editar
                                        </button> 
                                        <button 
                                            className="bg-red-500 text-white font-bold px-4 py-2 text-center rounded hover:bg-red-700"
                                            onClick={() => handleDeleteAtivo(ativo.id, ativo.circulante)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                    {index < passivosCirculantes.length ? (
                                        <>
                                            <td>{passivosCirculantes[index].nome}</td>
                                            <td className="text-center">{formatCurrency(parseFloat(passivosCirculantes[index].valor))}</td>
                                            <td className="text-center space-x-4">
                                                <button 
                                                    className="bg-blue-500 text-white font-bold px-4 py-2 text-center rounded hover:bg-blue-700"
                                                    onClick={() => navigate(`/editar_passivo/${passivosCirculantes[index].id}`)}
                                                >
                                                    Editar
                                                </button> 
                                                <button 
                                                    className="bg-red-500 text-white font-bold px-4 py-2 text-center rounded hover:bg-red-700"
                                                    onClick={() => handleDeletePassivo(passivosCirculantes[index].id, passivosCirculantes[index].circulante)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            <tr>
                                <td className="font-semibold">Total Ativos Circulantes</td>
                                <td className="font-semibold text-center">{formatCurrency(parseFloat(totais.totalAtivosCirculantes))}</td>
                                <td></td>
                                <td className="font-semibold">Total Passivos Circulantes</td>
                                <td className="font-semibold text-center">{formatCurrency(parseFloat(totais.totalPassivosCirculantes))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto shadow-md m-5">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th colSpan={3} className="text-center">Ativos Não Circulantes</th>
                                <th colSpan={3} className="text-center">Passivos Não Circulantes</th>
                            </tr>
                            <tr>
                                <th className="text-left">Ativo</th>
                                <th>Valor (R$)</th>
                                <th>Ações</th>
                                <th className="text-left">Passivo</th>
                                <th>Valor (R$)</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ativosNaoCirculantes.map((ativo: Ativo, index: number) => (
                                <tr key={ativo.id}>
                                    <td>{ativo.nome}</td>
                                    <td className="text-center">{formatCurrency(parseFloat(ativo.valor))}</td>
                                    <td className="text-center space-x-4">
                                        <button 
                                            className="bg-blue-500 text-white font-bold px-4 py-2 text-center rounded hover:bg-blue-700"
                                            onClick={() => navigate(`/editar_ativo/${ativo.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="bg-red-500 text-white font-bold px-4 py-2 text-center rounded hover:bg-red-700"
                                            onClick={() => handleDeleteAtivo(ativo.id, ativo.circulante)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                    {index < passivosNaoCiculantes.length ? (
                                        <>
                                            <td>{passivosNaoCiculantes[index].nome}</td>
                                            <td className="text-center">{formatCurrency(parseFloat(passivosNaoCiculantes[index].valor))}</td>
                                            <td className="text-center space-x-4">
                                                <button 
                                                    className="bg-blue-500 text-white font-bold px-4 py-2 text-center rounded hover:bg-blue-700"
                                                    onClick={() => navigate(`/editar_passivo/${passivosNaoCiculantes[index].id}`)}
                                                >
                                                    Editar
                                                </button> 
                                                <button 
                                                    className="bg-red-500 text-white font-bold px-4 py-2 text-center rounded hover:bg-red-700"
                                                    onClick={() => handleDeletePassivo(passivosNaoCiculantes[index].id, passivosNaoCiculantes[index].circulante)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            <tr>
                                <td className="font-semibold">Total Ativos Não Circulantes</td>
                                <td className="font-semibold text-center">{formatCurrency(parseFloat(totais.totalAtivosNaoCirculantes))}</td>
                                <td></td>
                                <td className="font-semibold">Total Passivos Não Circulantes</td>
                                <td className="font-semibold text-center">{formatCurrency(parseFloat(totais.totalPassivosNaoCirculantes))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto shadow-md m-5 mb-6">
                    <table className="min-w-full bg-white border border-gray-300 mt-4">
                        <tbody>
                            <tr>
                                <td><strong>Total Ativo</strong></td>
                                <td><strong>{formatCurrency(parseFloat(totais.totalAtivos))}</strong></td>
                            </tr>
                            <tr>
                                <td><strong>Total Passivo</strong></td>
                                <td><strong>{formatCurrency(parseFloat(totais.totalPassivos))}</strong></td>
                            </tr>
                            <tr>
                                <td><strong>Patrimônio Líquido</strong></td>
                                <td><strong>{formatCurrency(parseFloat(totais.patrimonioLiquido))}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="space-x-4 mx-5">
                    <button 
                        className="bg-violet-500 text-white font-bold px-4 py-2 rounded hover:bg-violet-700"
                        onClick={() => navigate('/adicionar_ativo')}
                    >
                        Adicionar Ativo
                    </button>
                    <button 
                        className="bg-sky-500 text-white font-bold px-4 py-2 rounded hover:bg-sky-700"
                        onClick={() => navigate('/adicionar_passivo')}
                    >
                        Adicionar Passivo
                    </button>
                </div>
                <br />
            </div>
        </div>
    );
};

export default ListBalanco;