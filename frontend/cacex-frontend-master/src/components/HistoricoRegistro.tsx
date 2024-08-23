import React, { useEffect, useState } from "react";
import { format } from 'date-fns'
import Header from "./Header";

interface HistoricoRegistro {
    id: number;
    acao: string;
    data: string;
    usuario: string;
    dados_anteriores: Record<string, string>;
    dados_atuais: Record<string, string>;
    dados_alterados: Array<[string, string, string]>;
}

const HistoricoRegistro: React.FC = () => {
    const [historicoRegistros, setHistoricoRegistros] = useState<HistoricoRegistro[]>([]);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetch('http://localhost:8000/historico/', {
            headers: {
                'Authorization': `Token ${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Dados recebidos:', data)
                if (Array.isArray(data)) {
                    setHistoricoRegistros(data);
                } else {
                    console.error('Response is not an array:', data);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [token]);

    return (
        <div>
            <Header />
            <div className="mt-10 p-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Histórico de Alterações</h2>
                <br />
                <div className="overflow-x-auto shadow-md">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100 border-t">
                            <tr>
                                <th className="border-l px-4 py-2 border-b">Ação</th>
                                <th className="px-4 py-2 border-b">Data</th>
                                <th className="px-4 py-2 border-b">Usuário</th>
                                <th className="px-4 py-2 border-b">Dados Anteriores</th>
                                <th className="px-4 py-2 border-b">Dados Atuais</th>
                                <th className="border-r px-4 py-2 border-b">Dados Alterados</th>
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

export default HistoricoRegistro;