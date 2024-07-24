import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { NumericFormat } from "react-number-format";
import { useParams } from "react-router-dom";

interface RegistroData {
    username: string;
    orgao_setor: string;
    municipio: string;
    atividade: string;
    num_convenio: string;
    parlamentar: string;
    objeto: string;
    oge_ogu: number;
    cp_prefeitura: number;
    valor_liberado: number;
    prazo_vigencia: string;
    situacao: string;
    providencia: string;
    data_recepcao: string;
    data_inicio: string;
    documento_pendente: boolean;
    documento_cancelado: boolean;
    data_fim: string;
}

interface HistoricoData {
    id: number;
    usuario: string;
    acao: string;
    dados_anteriores: string;
    dados_atuais: string;
    dados_alterados: string;
    data: string;
    registro: number;
}

const EditRegistro: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtenha o ID dos parâmetros da URL
    const [data, setData] = useState<RegistroData>({
        username: '',
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
        data_recepcao: '',
        data_inicio: '',
        documento_pendente: false,
        documento_cancelado: false,
        data_fim: '',
    });

    const [historico, setHistorico] = useState<HistoricoData[]>([]);

    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [setores, setSetores] = useState<any[]>([]);
    const [municipios, setMunicipios] = useState<any[]>([]);
    const [atividades, setAtividades] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            axios.get('http://localhost:8000/usuarios/', {
                headers: {
                    'Authorization': `Token ${token}`
                },
            })
                .then(response => setUsuarios(response.data))
                .catch(error => console.error('Erro ao buscar usuários:', error));
        } else {
            console.error('Token de autenticação não encontrado.');
        }

        const fetchRegistro = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/listar_registro/${id}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                });
                setData(response.data);
            } catch (err) {
                console.error(err);
                alert("Erro ao carregar registro.")
            }
        }

        fetchSetores();
        fetchMunicipios();
        fetchAtividades();
        fetchRegistro();
        fetchHistorico();
    }, [id]); // Pass an empty array to ensure this runs only once

    const fetchSetores = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.get("http://localhost:8000/listar_setores/", {
                headers: {
                    'Authorization': `Token ${token}`
                },
            });
            setSetores(response.data);
        } catch (error) {
            console.error("Erro ao listar setores:", error);
        }
    };

    const fetchMunicipios = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.get("http://localhost:8000/listar_municipios/", {
                headers: {
                    'Authorization': `Token ${token}`
                },
            });
            setMunicipios(response.data);
        } catch (error) {
            console.error("Erro ao listar municípios:", error);
        }
    };

    const fetchAtividades = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.get("http://localhost:8000/listar_atividades/", {
                headers: {
                    'Authorization': `Token ${token}`
                },
            });
            setAtividades(response.data);
        } catch (error) {
            console.error("Erro ao listar atividades:", error);
        }
    };

    const fetchHistorico = async () => {
        const token = localStorage.getItem('authToken'); // Obtendo o token de autenticação

        try {
            const response = await axios.get(`http://localhost:8000/historico/${id}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.status === 200) {
                setHistorico(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar o histórico:', error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type } = e.target;
        const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        const token = localStorage.getItem('authToken');
        e.preventDefault();
        console.log("Dados enviados:", data);

        // Convertendo strings de data para o formato correto se necessário
        const formattedData = {
            ...data,
            prazo_vigencia: new Date(data.prazo_vigencia).toISOString().split('T')[0],
            data_recepcao: new Date(data.data_recepcao).toISOString().split('T')[0],
            data_inicio: data.data_inicio ? new Date(data.data_inicio).toISOString().split('T')[0] : null,
            data_fim: data.data_fim ? new Date(data.data_fim).toISOString().split('T')[0] : null,
        };
        
        try {
            const response = await axios.put(`http://localhost:8000/editar_registro/${id}/`, formattedData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Supondo que a resposta seja sempre correta se o status for 200
            if (response.status === 200 && response.data.success) {
                alert('Registro editado com sucesso.')
                fetchHistorico();
            }
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert('Erro ao editar o registro')
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className='max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md'>
            <h2 className="text-2xl font-bold mb-6 text-center">Editar Registro</h2>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Nome de Usuário:</label>
                    <select name="username" value={data.username} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Nome de Usuário</option>
                        {usuarios.map((usuario: any, index: number) => (
                            <option key={index} value={usuario.id}>{usuario.username}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Órgão Setor:</label>
                    <select name="orgao_setor" value={data.orgao_setor} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Órgão/Setor</option>
                        {setores.map((setor: any, index: number) => (
                            <option key={index} value={setor.id}>{setor.orgao_setor}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Município:</label>
                    <select name="municipio" value={data.municipio} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Município</option>
                        {municipios.map((municipio: any, index: number) => (
                            <option key={index} value={municipio.id}>{municipio.municipio}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Atividade:</label>
                    <select name="atividade" value={data.atividade} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione uma Atividade</option>
                        {atividades.map((atividade: any, index: number) => (
                            <option key={index} value={atividade.id}>{atividade.atividade}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Número do Convênio:</label>
                    <input 
                        type="text" 
                        name="num_convenio" 
                        value={data.num_convenio} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite o Número do Convênio'
                        required
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Parlamentar:</label>
                    <input 
                        type="text" 
                        name="parlamentar" 
                        value={data.parlamentar} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite o nome do Parlamentar'
                        required
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Objeto:</label>
                    <input 
                        type="text" 
                        name="objeto" 
                        value={data.objeto} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite a descrição do Objeto'
                        required
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">OGE/OGU:</label>
                    <NumericFormat
                        name='oge_ogu'
                        value={data.oge_ogu}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded'
                        placeholder='Digite o valor da OGE/OGU (R$)'
                        thousandSeparator='.'
                        decimalSeparator=','
                        prefix='R$ '
                        decimalScale={2}
                        fixedDecimalScale={true}
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">CP Prefeitura:</label>
                    <NumericFormat
                        name='cp_prefeitura'
                        value={data.cp_prefeitura}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded'
                        placeholder='Digite o valor da CP Prefeitura (R$)' 
                        thousandSeparator='.'
                        decimalSeparator=','                      
                        prefix='R$ '
                        decimalScale={2}
                        fixedDecimalScale={true}
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Valor Liberado:</label>
                    <NumericFormat
                        name='valor_liberado'
                        value={data.valor_liberado}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded'
                        placeholder='Digite o Valor Liberado (R$)'
                        thousandSeparator='.'
                        decimalSeparator=','
                        prefix='R$ '
                        decimalScale={2}
                        fixedDecimalScale={true}
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Prazo de Vigência:</label>
                    <input type="date" name="prazo_vigencia" value={data.prazo_vigencia} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" required />
                </div>

                <div> 
                    <label className="block text-md font-bold mb-2 mt-4">Situação:</label>
                    <input 
                        type="text" 
                        name="situacao" 
                        value={data.situacao} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite a descrição da Situação'
                        required
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Providência:</label>
                    <input 
                        type="text" 
                        name="providencia" 
                        value={data.providencia} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite a descriçaõ da Providência'
                        required
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Data de Recepção:</label>
                    <input type="date" name="data_recepcao" value={data.data_recepcao} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" required />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Data de Início:</label>
                    <input type="date" name="data_inicio" value={data.data_inicio} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Documento Pendente:</label>
                    <input type="checkbox" name="documento_pendente" checked={data.documento_pendente} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-indigo-600" />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Documento Cancelado:</label>
                    <input type="checkbox" name="documento_cancelado" checked={data.documento_cancelado} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-indigo-600" />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Data de Fim:</label>
                    <input type="date" name="data_fim" value={data.data_fim} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" />
                </div>
                <br />

                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Editar Registro</button>
                </div>
                <br />
            </form>
            <br />
        </div>

    )
}
    

export default EditRegistro;