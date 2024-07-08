import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";

const AdicionarRegistro: React.FC = () => {
    const [registro, setRegistro] = useState({
        nome: '',
        orgao_setor: '',
        municipio: '',
        atividade: '',
        num_convenio: '',
        parlamentar: '',
        objeto: '',
        oge_ogu: 0,
        cp_prefeitura: 0,
        valor_liberado: 0,
        prazo_vigencia: '',
        situacao: '',
        providencia: '',
        status: 'Não Iniciado',
        data_recepcao: '',
        data_inicio: '',
        documento_pendente: false,
        documento_cancelado: false,
        data_fim: '',
        duracao_dias_uteis: 0
    });

    const [setores, setSetores] = useState<any[]>([]);
    const [municipios, setMunicipios] = useState<any[]>([]);
    const [atividades, setAtividades] = useState<any[]>([]);

    useEffect(() => {
        const nomeUsuario = localStorage.getItem('nomeUsuario') || '';
        setRegistro(prevState => ({
            ...prevState,
            nome: nomeUsuario
        }));

        const fetchData = async () => {
            try {
                const [setoresResponse, municipiosResponse, atividadesResponse] = await Promise.all([
                    axios.get("http://localhost:8000/listar_setores/"),
                    axios.get("http://localhost:8000/listar_municipios/"),
                    axios.get("http://localhost:8000/listar_atividades/")
                ]);

                setSetores(setoresResponse.data);
                setMunicipios(municipiosResponse.data);
                setAtividades(atividadesResponse.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            const { checked } = e.target;
            setRegistro(prevState => ({
                ...prevState,
                [name]: checked
            }));
        } else {
            setRegistro(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/registros_funcionarios/', {
                ...registro,
                username: registro.nome
            });
            console.log('Registro adicionado:', response.data);
            // limpar o formulário ou fornecer feedback ao usuário
        } catch (error) {
            console.error('Erro ao adicionar registro:', error);
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div className="mb-4">
                    <label className="block text-md font-bold mb-2">Nome:</label>
                    <select
                        name="nome"
                        value={registro.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    >
                        <option value={registro.nome}>{registro.nome}</option>

                    </select>
                    
                </div>
                <div className="mb-4">
                    <label className="block text-md font-bold mb-2">Setor:</label>
                    <select 
                        name="orgao_setor"
                        value={registro.orgao_setor}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    >
                        {setores.map(setor => (
                            <option key={setor.id} value={setor.orgao_setor}>{setor.orgao_setor}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-md font-bold mb-2">Município:</label>
                    <select 
                        name="municipio"
                        value={registro.municipio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    >
                        {municipios.map(municipio => (
                            <option key={municipio.id} value={municipio.municipio}>{municipio.municipio}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-md font-bold mb-2">Atividade:</label>
                    <select 
                        name="atividade"
                        value={registro.atividade}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    >
                        {atividades.map(atividade => (
                            <option key={atividade.id} value={atividade.atividade}>{atividade.atividade}</option>
                        ))}

                    </select>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Adicionar Registro
                </button>
            </form>
        </div>
    )
}

export default AdicionarRegistro;