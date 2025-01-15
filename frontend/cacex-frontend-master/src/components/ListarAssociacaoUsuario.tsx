import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

interface UserSetor {
    id: number;
    orgao_setor: string;
}

const ListarAssociacaoUsuario: React.FC = () => {
    const [associacoes, setAssociacoes] = useState<UserSetor[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssociacoes = async () => {
            try {
                const response = await axios.get("http://localhost:8000/listar_associacoes_usuario/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                });
                if (response.status === 200) {
                    setAssociacoes(response.data);
                } else {
                    console.error('Erro ao buscar associações:', response);
                    setMessage('Erro ao buscar associações');
                }
            } catch (error) {
                console.error('Erro ao buscar associações:', error);
                setMessage('Erro ao buscar associações');
            }
        };

        fetchAssociacoes();
    }, [token]);

    const handleEditClick = (associacaoId: number) => {
        navigate(`/editar_associacao/${associacaoId}`);
    }

    return (
        <div>
            <Header />
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-5">
                <h2 className="text-xl font-semibold mb-4">Associações de Usuário a Setores</h2>
                {message && <p className="mt-4 font-medium text-red-600">{message}</p>}
                <ul>
                    {associacoes.length > 0 ? (
                        associacoes.map(associacao => (
                            <li key={associacao.id} className="mb-2">
                                <span>{associacao.orgao_setor}</span>
                                <button
                                    onClick={() => handleEditClick(associacao.id)}
                                    className="ml-4 text-red-600 font-medium hover:underline"
                                >
                                    Deletar
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>Nenhuma associação encontrada.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ListarAssociacaoUsuario;