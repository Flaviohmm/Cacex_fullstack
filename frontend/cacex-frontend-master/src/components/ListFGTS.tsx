import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

interface FGTSRecord {
    id: number;
    nome: string;
    data_inicial: string;
    data_final: string;
    salario_bruto: number;
    diferenca_meses: number;
    fgts_mensal: number;
    taxa_juros_anual: number;
    juros: number;
    taxa_correcao_mensal: number;
    saldo_fgts_corrigido: number;
    multa_40: number;
    total_com_multa: number;
}

const ListFGTS: React.FC = () => {
    const [fgtsList, setFgtsList] = useState<FGTSRecord[]>([]);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFGTS = async () => {
            try {
                const response = await axios.get('http://localhost:8000/fgts/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setFgtsList(response.data);
            } catch (error) {
                console.error("Erro ao buscar os registros de FGTS:", error);
            }
        };

        fetchFGTS();
    }, [token]);

    const formatarData = (dataString: string) => {
        // Verifique se a string está no formato DD/MM/YYYY
        const partes = dataString.split('-');
        if (partes.length !== 3) {
            throw new Error("Formato de data inválido. Utilize o formato YYYY-MM-DD.")
        }

        const ano = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const dia = parseInt(partes[2], 10);

        // Cria um novo objeto Date
        const data = new Date(ano, mes, dia);

        // Verifique se a data foi criada corretamente
        if (isNaN(data.getTime())) {
            throw new Error("Data inválida.");
        }

        // Retorna a data formatada
        const diaFormatado = String(data.getDate()).padStart(2, '0');
        const mesFormatado = String(data.getMonth() + 1).padStart(2, '0');
        const anoFormatado = data.getFullYear();

        return `${diaFormatado}/${mesFormatado}/${anoFormatado}`
    };

    const formatarMoeda = (salario: number) => {
        // Formata o salário para R$ com 2 casas decimais
        return `R$ ${new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(salario)}`;
    };

    const handleDelete = async (id: number) => {
        const confirmacao = window.confirm("Você tem certeza que deseja excluir este registro de FGTS?");

        if(confirmacao) {
            try {
                await axios.delete(`http://localhost:8000/fgts/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                alert("Registro excluído com sucesso!");
                setFgtsList(fgtsList.filter(fgts => fgts.id !== id));
            } catch (error) {
                console.error("Erro ao excluir o registro:", error);
                alert("Erro ao excluir o registro.")
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-center mt-5">Lista de FGTS</h2>
                <div className="overflow-x-auto shadow-md">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 border-b">Nome</th>
                                <th className="py-2 border-b">Data Inicial</th>
                                <th className="py-2 border-b">Data Final</th>
                                <th className="py-2 border-b">Salário Bruto</th>
                                <th className="py-2 border-b">Diferença de Meses</th>
                                <th className="py-2 border-b">FGTS Mensal</th>
                                <th className="py-2 border-b">Taxa de Juros Anual (%)</th>
                                <th className="py-2 border-b">Juros</th>
                                <th className="py-2 border-b">Taxa de Correção Mensal</th>
                                <th className="py-2 border-b">Saldo FGTS Corrigido</th>
                                <th className="py-2 border-b">Multa 40%</th>
                                <th className="py-2 border-b">Total com Multa</th>
                                <th className="py-2 border-b">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fgtsList.map((fgts) => (
                                <tr key={fgts.id}>
                                    <td className="py-2 border-b text-center">{fgts.nome}</td>
                                    <td className="py-2 border-b text-center">{formatarData(fgts.data_inicial)}</td>
                                    <td className="py-2 border-b text-center">{formatarData(fgts.data_final)}</td>
                                    <td className="py-2 border-b text-center">{formatarMoeda(fgts.salario_bruto)}</td>
                                    <td className="py-2 border-b text-center">{fgts.diferenca_meses}</td>
                                    <td className="py-2 border-b text-center">{formatarMoeda(fgts.fgts_mensal)}</td>
                                    <td className="py-2 border-b text-center">{fgts.taxa_juros_anual} %</td>
                                    <td className="py-2 border-b text-center">{fgts.juros.toFixed(2)}</td>
                                    <td className="py-2 border-b text-center">{fgts.taxa_correcao_mensal} %</td>
                                    <td className="py-2 border-b text-center">{formatarMoeda(fgts.saldo_fgts_corrigido)}</td>
                                    <td className="py-2 border-b text-center">{formatarMoeda(fgts.multa_40)}</td>
                                    <td className="py-2 border-b text-center">{formatarMoeda(fgts.total_com_multa)}</td>
                                    <td className="py-2 border-b text-center">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/editar_fgts/${fgts.id}`)}
                                            className="bg-blue-500 hover:bg-sky-700 text-white font-bold rounded-md p-2 mb-1"
                                        >
                                            Editar
                                        </button> 
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(fgts.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-md p-2 ml-2"
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
        </div>
    )
}

export default ListFGTS;