import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { useLocation } from "react-router-dom";

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

    useEffect(() => {
        const nomeUsuario = localStorage.getItem('nomeUsuario') || '';
        setRegistro(prevState => ({
            ...prevState,
            nome: nomeUsuario
        }));
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
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Adicionar Registro
                </button>
            </form>
        </div>
    )
}

export default AdicionarRegistro;