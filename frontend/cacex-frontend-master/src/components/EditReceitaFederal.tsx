import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate, useParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";

interface Municipio {
    id: number;
    municipio: string;
}

interface ReceitaFederal {
    id: number;
    nome: string;
    municipio: Municipio;
    atividade: string;
    num_parcelamento: string;
    objeto: string;
    valor_total: string;
    prazo_vigencia: string;
    situacao: string;
    providencia: string;
}

const EditReceitaFederal: React.FC = () => {
    const [receita, setReceita] = useState<ReceitaFederal | null>(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Captura o ID da receita federal

    useEffect(() => {
        fetchReceita();
        fetchMunicipios();
    }, []);

    const fetchReceita = async () => {
        if (!token) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
        }

        try {
            const response = await axios.get(`http://localhost:8000/receita_federal/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setReceita(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados da receita federal:", error);
            setError('Erro ao buscar receita federal');
        }
    };

    const fetchMunicipios = async () => {
        if (!token) return;

        try {
            const response = await axios.get('http://localhost:8000/municipios/', {
                headers: {
                    'Authorization': `Token ${token}`,
                }
            });
            setMunicipios(response.data);
        } catch (error) {
            console.error("Erro ao buscar municípios:", error);
            alert('Erro ao buscar municípios');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (receita) {
            setReceita({ ...receita, [name]: value });
        }
    };

    const handleUpdate = async () => {
        if (!receita) return;

        try {
            await axios.put(`http://localhost:8000/receita_federal/${id}/`, receita, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setSuccess('Dados da receita federal atualizado com sucesso!');
            navigate('/listar_receita_federal'); // Redirecionar após edição
        } catch (error) {
            console.error("Erro ao atualizar receita federal:", error);
            setError('Erro ao atualizar receita federal');
        }
    };

    if (!receita) return <div>Carregando...</div>

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Editar Receita Federal</h2>
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={receita.nome}
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Município:</label>
                    <select
                        name="municipio"
                        value={receita.municipio.id}
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                    >
                        {municipios.map((municipio) => (
                            <option key={municipio.id} value={municipio.id}>
                                {municipio.municipio}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Atividade:</label>
                    <input
                        type="text"
                        name="atividade"
                        value={receita.atividade}
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">N° de Parcelamento:</label>
                    <input
                        type="number"
                        name="num_parcelamento"
                        value={receita.num_parcelamento}
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Objeto:</label>
                    <input 
                        type="text" 
                        name="objeto"
                        value={receita.objeto}
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Valor Total:</label>
                    <NumericFormat
                        name="valor_total"
                        value={receita.valor_total}
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale={true}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Prazo de Vigência:</label>
                    <input
                        type="date"
                        name="prazo_vigencia"
                        value={receita.prazo_vigencia.split('T')[0]} // Ajuste para o formato YYYY-MM-DD
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Situação:</label>
                    <input
                        type="text"
                        name="situacao"
                        value={receita.situacao}
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Providência:</label>
                    <input 
                        type="text" 
                        name="providencia"
                        value={receita.providencia}
                        onChange={handleInputChange}
                        className="border rounded px-4 py-2 w-full"
                    />
                </div>
                <br />
                <div className="flex justify-between">
                    <button onClick={handleUpdate} className="bg-blue-500 text-white font-bold px-4 py-2 rounded">
                        Atualizar
                    </button>
                </div>
                {success && <div className="text-green-500 font-bold text-center mt-4">{success}</div>}
                {error && <div className="text-red-500 font-bold text-center mt-4">{error}</div>}
            </div>
            <br />
        </div>
    );
};


export default EditReceitaFederal;