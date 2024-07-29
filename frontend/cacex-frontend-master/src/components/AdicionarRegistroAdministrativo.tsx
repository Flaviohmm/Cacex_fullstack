import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const AdicionarRegistroAdministrativo = () => {
    const [municipio, setMunicipio] = useState<any[]>([]); // Array para armazenar municípios
    const [municipioId, setMunicipioId] = useState(''); // Estado para o ID do município selecionado
    const [prazoVigencia, setPrazoVigencia] = useState('');
    const [numContrato, setNumContrato] = useState('');
    const [pubFemurn, setPubFemurn] = useState('');
    const [naCacex, setNaCacex] = useState(false);
    const [naPrefeitura, setNaPrefeitura] = useState(false);
    const token = localStorage.getItem('authToken');

    const fetchMunicipios = async () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
            return;
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

    // Chamar a função para obter os municípios quando o componente for montado
    useEffect(() => {
        fetchMunicipios();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const registro = {
            municipios: [municipioId],
            prazo_vigencia: prazoVigencia,
            num_contrato: numContrato,
            pub_femurn: pubFemurn,
            na_cacex: naCacex,
            na_prefeitura: naPrefeitura,
        };

        try {
            const response = await axios.post('http://localhost:8000/adicionar_registro_administrativo/', registro, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.data;

            if (response.data) {
                alert(data.message);
            } 

        } catch (error) {
            const axiosError = error as { response?: { data: { error: string } } }; // Tipo de asserção

            if (axiosError) {
                alert('Erro ao adicionar registro: ' + axiosError.response?.data.error);
            } else {
                alert('Erro ao adicionar registro: Erro de rede ou configuração.');
            }
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className='max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md'>
                <h2 className="text-2xl font-bold mb-6 text-center">Adicionar Registro Adminstrativo</h2>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Município:</label>
                    <select name="municipio" value={municipioId} onChange={(e) => setMunicipioId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Município</option>
                        {municipio.map((municipio: any, index: number) => (
                            <option key={index} value={municipio.id}>{municipio.municipio}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Prazo de Vigência:</label>
                    <input type="date" name="prazo_vigencia" value={prazoVigencia} onChange={(e) => setPrazoVigencia(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded"/>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">N° do Contrato:</label>
                    <input 
                        type="text" 
                        name="num_convenio" 
                        value={numContrato} 
                        onChange={(e) => setNumContrato(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite o Número do Contrato'
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Publicação do FEMURN:</label>
                    <input 
                        type="text" 
                        name="num_convenio" 
                        value={pubFemurn} 
                        onChange={(e) => setPubFemurn(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite a Publicação do FEMURN'
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Na Cacex:</label>
                    <input type="checkbox" name="documento_cancelado" checked={naCacex} onChange={(e) => setNaCacex(e.target.checked)} className="form-checkbox h-5 w-5 text-indigo-600"/>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Na Prefeitura:</label>
                    <input type="checkbox" name="documento_cancelado" checked={naPrefeitura} onChange={(e) => setNaPrefeitura(e.target.checked)} className="form-checkbox h-5 w-5 text-indigo-600"/>
                </div>

                <br />

                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar Registro</button>
                </div>
                <br />
            </form>
            <br />
        </div>
    )
};

export default AdicionarRegistroAdministrativo;