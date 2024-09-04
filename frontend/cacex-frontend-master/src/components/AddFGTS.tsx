import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const AddFGTS: React.FC = () => {
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
            }
        };

        fetchEmpregados();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const date = new Date(); // Use o formato adequado que seu backend espera
        const mesAnoFormatted = `${date.getFullYear()}-${date.getMonth() + 1}-01`; // Formato YYYY-MM-DD

        // Garanta que renumeracaoBruta é sempre uma string antes de usar replace
        const parsedRenumeracaoBruta = typeof renumeracaoBruta === 'string' ?
            parseFloat(renumeracaoBruta.replace('R$', '').replace('.', '').replace(',', '.')) || 0 :
            0; // Caso seja um número, o valor padrão é 0

        try {
            const response = await axios.post('http://localhost:8000/individualizacao_fgts/', {
                empregado: empregadoId,
                mes_ano: mesAnoFormatted,
                renumeracao_bruta: parsedRenumeracaoBruta, // Envia o valor numérico
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log('FGTS registrado:', response.data);
            setSuccess('Individualização de FGTS registrado com sucesso!');
            // Resetar campos ou mostrar mensagem de sucesso
        } catch (error) {
            console.error('Erro ao registrar Individualização de FGTS:', error);
            setError(`Erro ao registrar Individualização de FGTS`)
            alert('Erro ao registrar Individualização de FGTS. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Registrar Individualização de FGTS</h2>
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
                    <label className="block text-base font-bold mb-2 mt-4">Remuneração Bruta:</label>
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
                    />
                </div>
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Registrar FGTS</button>
                <br />
                {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
                {success && <p className="text-green-500 mt-4 font-bold">{success}</p>}
            </form>
        </div>
    );
};

export default AddFGTS;