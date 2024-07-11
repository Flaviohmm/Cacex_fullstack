import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { NumericFormat, NumberFormatBaseProps } from 'react-number-format';

const AdicionarRegistro: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        orgao_setor: '',
        municipio: '',
        atividade: '',
        num_convenio: '',
        parlamentar: '',
        objeto: '',
        oge_ogu: '',
        cp_prefeitura: '',
        valor_liberado: '',
        prazo_vigencia: '',
        situacao: '',
        providencia: '',
        data_recepcao: '',
        data_inicio: '',
        documento_pendente: false,
        documento_cancelado: false,
        data_fim: '',
    });

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

        fetchSetores();
        fetchMunicipios();
        fetchAtividades();
    }, []); // Pass an empty array to ensure this runs only once

    const fetchSetores = async () => {
        try {
            const response = await axios.get("http://localhost:8000/listar_setores/");
            setSetores(response.data);
        } catch (error) {
            console.error("Erro ao listar setores:", error);
        }
    };

    const fetchMunicipios = async () => {
        try {
            const response = await axios.get("http://localhost:8000/listar_municipios/");
            setMunicipios(response.data);
        } catch (error) {
            console.error("Erro ao listar municípios:", error);
        }
    };

    const fetchAtividades = async () => {
        try {
            const response = await axios.get("http://localhost:8000/listar_atividades/");
            setAtividades(response.data);
        } catch (error) {
            console.error("Erro ao listar atividades:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;
        const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        axios.post('http://localhost:8000/adicionar_registro/', formData, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(response => {
                console.log(response.data);
                alert('Registro adicionado com sucesso');
            })
            .catch(error => {
                console.error('Houve um erro ao adicionar o registro:', error);
                alert(`Erro ao adicionar registro: ${error.response?.data?.error ?? error.message}`);
            });
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className='max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md'>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Nome de Usuário:</label>
                    <select name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Nome de Usuário</option>
                        {usuarios.map((usuario: any, index: number) => (
                            <option key={index} value={usuario.id}>{usuario.username}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Órgão Setor:</label>
                    <select name="orgao_setor" value={formData.orgao_setor} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Órgão/Setor</option>
                        {setores.map((setor: any, index: number) => (
                            <option key={index} value={setor.id}>{setor.orgao_setor}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Município:</label>
                    <select name="municipio" value={formData.municipio} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Município</option>
                        {municipios.map((municipio: any, index: number) => (
                            <option key={index} value={municipio.id}>{municipio.municipio}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Atividade:</label>
                    <select name="atividade" value={formData.atividade} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Órgão/Setor</option>
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
                        value={formData.num_convenio} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite o Número do Convênio'
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Parlamentar:</label>
                    <input 
                        type="text" 
                        name="parlamentar" 
                        value={formData.parlamentar} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite o nome do Parlamentar'
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Objeto:</label>
                    <input 
                        type="text" 
                        name="objeto" 
                        value={formData.objeto} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite a descrição do Objeto'
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">OGE/OGU:</label>
                    <NumericFormat
                        name='oge_ogu'
                        value={formData.oge_ogu}
                        onChange={handleChange}
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
                        value={formData.cp_prefeitura}
                        onChange={handleChange}
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
                        value={formData.valor_liberado}
                        onChange={handleChange}
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
                    <input type="date" name="prazo_vigencia" value={formData.prazo_vigencia} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded"/>
                </div>

                <div> 
                    <label className="block text-md font-bold mb-2 mt-4">Situação:</label>
                    <input 
                        type="text" 
                        name="situacao" 
                        value={formData.situacao} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite a descrição da Situação'
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Providência:</label>
                    <input 
                        type="text" 
                        name="providencia" 
                        value={formData.providencia} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        placeholder='Digite a descriçaõ da Providência'
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Data de Recepção:</label>
                    <input type="date" name="data_recepcao" value={formData.data_recepcao} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded"/>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Data de Início:</label>
                    <input type="date" name="data_inicio" value={formData.data_inicio} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded"/>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Documento Pendente:</label>
                    <input type="checkbox" name="documento_pendente" checked={formData.documento_pendente} onChange={handleChange} className="form-checkbox h-5 w-5 text-indigo-600"/>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Documento Cancelado:</label>
                    <input type="checkbox" name="documento_cancelado" checked={formData.documento_cancelado} onChange={handleChange} className="form-checkbox h-5 w-5 text-indigo-600"/>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Data de Fim:</label>
                    <input type="date" name="data_fim" value={formData.data_fim} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded"/>
                </div>
                <br />

                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar Registro</button>
                </div>
                <br />
            </form>
            <br />
        </div>
    );
};

export default AdicionarRegistro;