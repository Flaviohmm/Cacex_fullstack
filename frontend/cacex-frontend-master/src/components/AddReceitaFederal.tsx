import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";


const AddReceitaFederal = () => {
    const [nome, setNome] = useState('');
    const [municipio, setMunicipio] = useState<any[]>([]); // Array para armazenar municípios
    const [municipioId, setMunicipioId] = useState(''); // Estado para o ID do município selecionado
    const [atividade, setAtividade] = useState('');
    const [numParcelamento, setNumParcelamento] = useState(0);
    const [objeto, setObjeto] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [prazoVigencia, setPrazoVigencia] = useState('');
    const [situacao, setSituacao] = useState('');
    const [providencia, setProvidencia] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('authToken');

    const fetchMunicipios = async () => {
        if (!token) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
        }

        try {
            const response = await axios.get("http://localhost:8000/listar_municipios/", {
                headers: {
                    'Authorization': `Token ${token}`
                },
            });
            setMunicipio(response.data);
        } catch (error) {
            console.error("Erro ao listar municípios:", error);
        }
    };

    useEffect(() => {
        fetchMunicipios(); // Faz a chamada para buscar os municípios ao iniciar o componente
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Garanta que valorTotal é sempre uma string antes de usar replace
        const parsedValorTotal = typeof valorTotal === 'string' ? 
            parseFloat(valorTotal.replace('R$', '').replace('.', '').replace(',', '.')) || 0 :
            0;
    
        const data = {
            nome,
            municipio: municipioId,
            atividade,
            num_parcelamento: numParcelamento,
            objeto,
            valor_total: parsedValorTotal,
            prazo_vigencia: prazoVigencia,
            situacao,
            providencia,
        };
    
        try {
            const response = await axios.post('http://localhost:8000/receita_federal/', data, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            console.log('Dados da Receita adicionada:', response.data);
    
            if (response.data.id) { // Verifique se o ID está presente na resposta
                setSuccess('Dados da Receita Federal adicionado com sucesso!');
                // Aqui você pode redirecionar ou manipular o que acontece após a criação com sucesso
            } else {
                setError('A Receita Federal foi criada, mas não foi possível obter o ID.');
            }
        } catch (err) {
            setError('Erro ao adicionar Receita Federal. Verifique os campos.');
            console.error(err);
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Adicionar Receita Federal</h2>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Nome:</label>
                    <input 
                        type="text" 
                        placeholder="Digite o nome do contribuinte"
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Município:</label>
                    <select value={municipioId} onChange={(e) => setMunicipioId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="" disabled>Selecione um município</option>
                        {municipio.map((municipio: any, index: number) => (
                            <option key={index} value={municipio.id}>{municipio.municipio}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Atividade:</label>
                    <input 
                        type="text" 
                        placeholder="Digite o nome ou setor da atividade"
                        value={atividade} 
                        onChange={(e) => setAtividade(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded" 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">N° de Parcelamento:</label>
                    <input 
                        type="number" 
                        placeholder="Digite o número do parcelamento que foi acordado com a Receita Federal "
                        value={numParcelamento} 
                        onChange={(e) => setNumParcelamento(Number(e.target.value))} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Objeto:</label>
                    <input 
                        type="text" 
                        placeholder="Especifique o tipo de obrigação ou dívida que está sendo parcelada"
                        value={objeto} 
                        onChange={(e) => setObjeto(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Valor Total:</label>
                    <NumericFormat
                        value={valorTotal}
                        onChange={(e) => setValorTotal(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale={true}
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Prazo de Vigência:</label>
                    <input 
                        type="date" 
                        placeholder="Digite o prazo de vigência"
                        value={prazoVigencia} 
                        onChange={(e) => setPrazoVigencia(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Situação:</label>
                    <input 
                        type="text" 
                        placeholder="Digite a situação atual do parcelamento"
                        value={situacao} 
                        onChange={(e) => setSituacao(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Providência:</label>
                    <input 
                        type="text" 
                        placeholder="Digite as ações ou medidas que devem ser tomadas"
                        value={providencia} 
                        onChange={(e) => setProvidencia(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar</button>
                <br />
                {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
                {success && <p className="text-green-500 mt-4 font-bold">{success}</p>}
            </form>
            <br />
        </div>
    );
};

export default AddReceitaFederal;