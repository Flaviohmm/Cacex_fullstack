import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import { useParams, useNavigate } from "react-router-dom";

const EditIndividualizacaoFGTS: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtendo o ID da individualização pela URL
    const navigate = useNavigate();

    const [empregados, setEmpregados] = useState<any[]>([]);
    const [empregadoId, setEmpregadoId] = useState<number | null>(null);
    const [mesAno, setMesAno] = useState<string>('');
    const [renumeracaoBruta, setRenumeracaoBruta] = useState<number | string>('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchEmpregados = async () => {
            try {
                const response = await axios.get('http://localhost:8000/empregado/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setEmpregados(response.data);
            } catch (error) {
                console.error('Erro ao buscar empregados:', error);
                setError('Erro ao buscar a lista de empregados.');
            }
        };

        const fetchIndividualizacao = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/individualizacao_fgts/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                const { empregado, mes_ano, renumeracao_bruta } = response.data;
                setEmpregadoId(empregado);
                // Garanta que mes_ano está no formato "yyyy-MM"
                setMesAno(mes_ano.substring(0, 7));
                setRenumeracaoBruta(renumeracao_bruta);
            } catch (error) {
                console.error('Erro ao buscar individualização:', error);
                setError('Individualização de FGTS não encontrada.');
            }
        };

        fetchEmpregados();
        fetchIndividualizacao();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const renumeracaoBrutaParsed = typeof renumeracaoBruta === 'string'
                ? parseFloat(renumeracaoBruta.replace('R$', '')) || 0
                : 0

            const mesAnoFormatted = `${mesAno}-01`; // Ajuste para o formato correto YYYY-MM-DD

            const payload = {
                empregado: empregadoId,
                mes_ano: mesAnoFormatted,
                renumeracao_bruta: Number(renumeracaoBrutaParsed), // Garantindo que o valor seja numérico
            };

            console.log('Dados enviados para atualização:', payload); // Verifique os dados antes de enviar

            const response = await axios.put(`http://localhost:8000/individualizacao_fgts/${id}/`, payload, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log('Individualização atualizada:', response.data);
            setSuccess('Individualização de FGTS atualizada com sucesso!');
            // Redireciona após a atualização
            setTimeout(() => navigate('/listar_individualizacao_fgts'), 2000);
        } catch (error) {
            console.error('Erro ao atualizar individualização de FGTS:', error);

            // Verificar se temos uma resposta detalhada do erro
            if (axios.isAxiosError(error) && error.response) {
                setError(`Erro ao atualizar individualização de FGTS: ${error.response.data.detail || error.message}`)
            } else {
                setError('Erro inesperado ao atualizar a individualização de FGTS.');
            }
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Editar Individualização de FGTS</h2>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Empregado:</label>
                    <select value={empregadoId || ''} onChange={(e) => setEmpregadoId(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="" disabled>Selecione um empregado</option>
                        {empregados.map((empregado) => (
                            <option key={empregado.id} value={empregado.id}>
                                NOME: {empregado.nome} - CPF: {empregado.cpf} - PIS/PASEP: {empregado.pis_pasep}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Mês/Ano:</label>
                    <input 
                        type="month"
                        placeholder="Digite o Mês/Ano"
                        value={mesAno}
                        onChange={(e) => setMesAno(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Renumeração Bruta:</label>
                    <NumericFormat
                        name="renumeracao_bruta"
                        placeholder="Digite a Remuneração Bruta"
                        value={renumeracaoBruta}
                        onChange={(e) => setRenumeracaoBruta(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale={true}
                        required
                    />
                </div>
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Atualizar Individualização de FGTS
                </button>
                <br />
                {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
                {success && <p className="text-green-500 mt-4 font-bold">{success}</p>}
            </form>
        </div>
    );
};

export default EditIndividualizacaoFGTS;
