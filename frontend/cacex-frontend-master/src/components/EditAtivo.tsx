import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const EditAtivo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [nome, setNome] = useState<string>('');
    const [valor, setValor] = useState<string>('');
    const [circulante, setCirculante] = useState<boolean>(false);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    const parseCurrency = (valor: string): number => {
        // Remove o prefixo "R$", espaços e substitui a vírgula pelo ponto decimal
        const numero = valor
            .replace('R$', '') // Remove o prefixo
            .replace(/\s/g, '') // Remove espaços em branco
            .replace('.', '') // remove o separador de milhar (ponto)
            .replace(',', '.'); // Substitui a vírgula pelo ponto

        // Converte a string resultante em número
        return parseFloat(numero);
    };

    const formatCurrency = (valor: number) => {
        return `R$ ${valor.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).replace('.', ',')}`;
    };

    useEffect(() => {
        // Carregar os dados do ativo ao montar o componente
        const fetchAtivo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/fetch_ativo/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                setNome(response.data.nome);
                setValor(formatCurrency(response.data.valor));
                setCirculante(response.data.circulante);
            } catch (error) {
                console.error("Erro ao carregar ativo:", error);
            }
        };

        fetchAtivo();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Transformar o valor para número e validar
        const valorNumerico = parseCurrency(valor);

        if (isNaN(valorNumerico)) {
            alert("Por favor, insira um valor válido.");
            return;
        }

        try {
            await axios.put(`http://localhost:8000/edit_ativo/${id}/`, {
                nome,
                valor: valorNumerico,
                circulante,
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            // Redireciona para a página de balanço após a atualização
            navigate('/listar_balanco');
            console.log(valor)
        } catch (error) {
            console.error("Erro ao editar ativo:", error);
        }
    };

    return (
        <div>
            <Header />
            <h1 className="text-4xl font-bold underline text-center mb-6 mt-5">Editar Ativo</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Nome:</label>
                    <input
                        type="text"
                        placeholder="Nome do Ativo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Valor:</label>
                    <NumericFormat
                        placeholder="Valor do Ativo"
                        value={parseCurrency(valor)}
                        onChange={(e) => setValor(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale={true}
                    />
                </div>
                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        checked={circulante}
                        onChange={(e) => setCirculante(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <label className="ml-2 font-semibold">Circulante</label>
                </div>
                <button type="submit" className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 mt-5">
                    Atualizar Ativo
                </button>
            </form>
        </div>
    );
};

export default EditAtivo;