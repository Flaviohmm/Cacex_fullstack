import React, { useState } from "react";
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setRegistro({
            ...registro,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/registros_funcionarios/', registro);
            console.log('Registro adicionado:', response.data);
            // limpar o formulário ou fornecer feedback ao usuário
        } catch (error) {
            console.error('Erro ao adicionar registro:', error);
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div className="mb-4">
                    <label className="block text-xl font-bold mb-2">Nome:</label>
                    <input
                        name="nome"
                        type="text"
                        value={registro.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Adicionar Registro
                </button>
            </form>
        </div>
    )
}

export default AdicionarRegistro;