import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useParams } from "react-router-dom";

interface Setor {
    id: number;
    orgao_setor: string;
}

const EditarAssociacaoUsuario: React.FC= () => {
    const [setores, setSetores] = useState<Setor[]>([]);
    const [selectedSetores, setSelectedSetores] = useState<number[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const token = localStorage.getItem('authToken');
    const { id } = useParams<{ id: string }>();
    const associacaoId = Number(id);

    useEffect(() => {
        const fetchSetores = async () => {
            try {
                const response = await axios.get("http://localhost:8000/listar_setores/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                });
                if (response.status === 200) {
                    setSetores(response.data);
                } else {
                    console.error('Erro ao buscar setores:', response);
                    setMessage('Erro ao buscar setores');
                }
            } catch (error) {
                console.error('Erro ao buscar setores:', error);
                setMessage('Erro ao buscar setores');
            }
        };

        const fetchSetoresAssociados = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/listar_associacoes_usuario/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                });
                if (response.status === 200) {
                    const associadoIds = response.data.map((associacao: { id: number }) => associacao.id)
                    setSelectedSetores(associadoIds)
                } else {
                    console.error('Erro ao buscar associações:', response);
                    setMessage('Erro ao buscar associações');
                }
            } catch (error) {
                console.error('Erro ao buscar associações:', error);
                setMessage('Erro ao buscar associações');
            }
        };

        fetchSetores();
        fetchSetoresAssociados();
    }, [token, associacaoId]);

    const handleCheckboxChange = (setorId: number) => {
        setSelectedSetores((prevSelected) => {
            if (prevSelected.includes(setorId)) {
                return prevSelected.filter(id => id !== setorId);
            } else {
                return [...prevSelected, setorId];
            }
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedSetores.length > 0) {
            try {
                const response = await axios.put(`http://localhost:8000/editar_associacao_usuario/${associacaoId}/`, {
                    setor_ids: selectedSetores,
                }, {
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                });
                setMessage(response.data);
                setMessage("Associação excluida com sucesso.");
            } catch (error) {
                console.error("Erro ao editar associação:", error);
                setMessage("Erro desconhecido");
            }
        } else {
            setMessage("Por favor, selecione pelo menos um setor.")
        }
    };

    return (
        <div>
            <Header />
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-5">
                <h2 className="text-xl font-semibold mb-4">Editar Associação de Usuário a Setor</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <span className="text-gray-700">Selecione os Setores:</span>
                        {setores.map(setor => (
                            <div key={setor.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`setor-${setor.id}`}
                                    value={setor.id}
                                    checked={selectedSetores.includes(setor.id)}
                                    onChange={() => handleCheckboxChange(setor.id)}
                                    className="mr-2"
                                />
                                <label htmlFor={`setor-${setor.id}`}>{setor.orgao_setor}</label>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-semibold bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-offset-2 focus:ring-red-500 transition"
                    >
                        Deletar
                    </button>
                </form>
                {message && <p className="mt-4 text-red-600 font-semibold">{message}</p>}
            </div>
        </div>
    );
};

export default EditarAssociacaoUsuario;