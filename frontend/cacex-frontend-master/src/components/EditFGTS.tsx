import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";

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

const EditFGTS: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [fgtsData, setFgtsData] = useState<FGTSRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (!id) {
            console.error("ID não definido.");
            navigate('/listar_fgts'); // Redireciona se o ID não estiver presente
            return;
        }

        const fetchFGTS = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/fgts/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setFgtsData(response.data);
            } catch (error) {
                console.error("Erro ao buscar os dados do FGTS:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFGTS();
    }, [id, token, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (fgtsData) {
            setFgtsData({
                ...fgtsData,
                [name]: name === 'salario_bruto' || name === 'taxa_juros_anual' || name === 'taxa_correcao_mensal'
                    ? (value ? parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) : 0)
                    : value,
            });
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (fgtsData) {
            try {
                await axios.put(`http://localhost:8000/fgts/${id}/`, fgtsData, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                alert("Registro atualizado com sucesso!");
                navigate('/listar_fgts'); // Redireciona para a lista de FGTS após a atualização
            } catch (error) {
                console.error("Erro ao atualizar o registro:", error);
                alert("Erro ao atualizar o registro.");
            }
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div>Carregando...</div>
            </div>
        )
    }

    return (
        <div>
            <Header />
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-center mt-5">Editar FGTS</h2>
                <form onSubmit={handleUpdate} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                    <div className="mb-4">
                        <label htmlFor="nome" className="block text-sm font-bold mb-1">Nome:</label>
                        <input
                            type="text"
                            placeholder="Nome do Funcionário"
                            id="nome"
                            name="nome"
                            value={fgtsData?.nome}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="data_inicial" className="block text-sm font-bold mb-1">Data Inicial:</label>
                        <input
                            type="date"
                            id="data_inicial"
                            name="data_inicial"
                            value={fgtsData?.data_inicial}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="data_final" className="block text-sm font-bold mb-1">Data Final:</label>
                        <input
                            type="date"
                            id="data_final"
                            name="data_final"
                            value={fgtsData?.data_final}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="salario_bruto" className="block text-sm font-bold mb-1">Salário Bruto:</label>
                        <NumericFormat
                            id="salario_bruto"
                            placeholder="Salário Bruto"
                            name="salario_bruto"
                            value={fgtsData?.salario_bruto}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            decimalScale={2}
                            fixedDecimalScale={true}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="taxa_juros_anual" className="block text-sm font-bold mb-1">Taxa de Juros Anual (%):</label>
                        <input
                            type="number"
                            placeholder="Taxa de Juros Anual (%)"
                            id="taxa_juros_anual"
                            name="taxa_juros_anual"
                            value={fgtsData?.taxa_juros_anual}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="taxa_correcao_mensal" className="block text-sm font-bold mb-1">Taxa de Correção Mensal (%):</label>
                        <input
                            type="number"
                            placeholder="Taxa de Correção Mensal (%)"
                            id="taxa_correcao_mensal"
                            name="taxa_correcao_mensal"
                            value={fgtsData?.taxa_correcao_mensal}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold rounded-md p-2">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditFGTS;