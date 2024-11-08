import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

interface Processo {
    id: number;
    processo: string;
    tipo_acao: string;
    autor: string;
    reu: string;
    status: string;
    data_abertura: string;
}

const EditProcesso: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtendo o id da URL
    const [formData, setFormData] = useState<Processo | null>(null);
    const navigate = useNavigate(); // Inicializando useNavigate

    useEffect(() => {
        const fetchProcesso = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:8000/processos/${id}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setFormData(response.data);
            } catch (error) {
                console.error('Erro ao buscar o processo:', error);
            }
        };
        
        fetchProcesso();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (formData) {
            setFormData((prev) => ({ ...prev!, [name]: value }));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.put(`http://localhost:8000/processos/${formData.id}/`, formData, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                alert("Processo editado com sucesso.")
                navigate('/'); // Redireciona para a lista de processos após a edição
            } catch (error) {
                console.error('Erro ao editar o processo:', error);
                alert("Houve o erro ao editar o processo. Tente novamente.");
            }
        }
    };

    if (!formData) return (
        <div>
            <Header />
            <div>Carregando...</div>
        </div> // Mensagem de carregamento
    );

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-4 text-center mt-5">Editar Processo</h2>
            <form onSubmit={handleUpdate} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Processo:</label>
                    <input
                        type="text"
                        name="processo"
                        value={formData.processo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Tipo de Ação:</label>
                    <input
                        type="text"
                        name="tipo_acao"
                        value={formData.tipo_acao}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Autor</label>
                    <input
                        type="text"
                        name="autor"
                        value={formData.autor}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Réu:</label>
                    <input
                        type="text"
                        name="reu"
                        value={formData.reu}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Status:</label>
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Data de Abertura:</label>
                    <input
                        type="date"
                        name="data_abertura"
                        value={formData.data_abertura}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">Salvar</button>
            </form>
        </div>
    );
};

export default EditProcesso;