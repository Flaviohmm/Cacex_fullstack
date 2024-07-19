import React, { useEffect, useState } from "react";
import { format } from 'date-fns'
import Header from "./Header";
import { useParams } from "react-router-dom";

interface HistoricoRegistroID {
    acao: string;
    data: string;
    usuario: {
        id: number;
        username: string;
    };
    dados_anteriores: Record<string, string>;
    dados_atuais: Record<string, string>;
    dados_alterados: Array<[string, string, string]>;
}

const HistoricoRegistroID: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Pega o ID da URL
    const [historicoRegistros, setHistoricoRegistros] = useState<HistoricoRegistroID[]>([]);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8000/historico/${id}`, {
                headers: {
                    'Authorization': `Token ${token}`
                },
            })
                .then(response => {
                    console.log('Resposta da API:', response);
                    return response.json()
                })
                .then(data => {
                    console.log('Dados recebidos:', data)
                    if (data.historico_registros) {
                        setHistoricoRegistros(data.historico_registros);
                    } else {
                        console.error('Response is not an array:', data);
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [id ,token]);

    return (
        <div>
            <Header />
            <div className="mt-10 p-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Histórico de Alterações</h2>
                <br />
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Ação</th>
                                <th className="px-4 py-2 border-b">Data</th>
                                <th className="px-4 py-2 border-b">Usuário</th>
                                <th className="px-4 py-2 border-b">Dados Anteriores</th>
                                <th className="px-4 py-2 border-b">Dados Atuais</th>
                                <th className="px-4 py-2 border-b">Dados Alterados</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoRegistros.map((registro, index) => (
                                <tr key={index}>
                                    <td className="border-y px-4 py-2 text-center">{registro.acao}</td>
                                    <td className="border px-4 py-2 text-center">{format(new Date(registro.data), 'dd/MM/yyyy HH:mm:ss')}</td>
                                    <td className="border px-4 py-2 text-center">{registro.dados_atuais.nome}</td>
                                    <td className="border px-4 py-2">
                                        {Object.entries(registro.dados_anteriores).map(([key, value]) => (
                                            <div key={key}>
                                                <strong>{key}:</strong> {value}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {Object.entries(registro.dados_atuais).map(([key, value]) => (
                                            <div key={key}>
                                                <strong>{key}:</strong> {value}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border-y px-4 py-2 text-center">
                                        <ul>
                                            {registro.dados_alterados.map(([key, value_anterior, value_atual], innerIndex) => (
                                                <li key={innerIndex}>
                                                    <strong>{key}</strong>: {value_anterior} - {value_atual}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <br />

        </div>
    )
}

export default HistoricoRegistroID;