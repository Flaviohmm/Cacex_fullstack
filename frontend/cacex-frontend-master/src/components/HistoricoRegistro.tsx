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
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Histórico de Alterações</h2>
                <br />
                <table className="table-auto w-4/5 mx-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Ação</th>
                            <th className="px-4 py-2">Data</th>
                            <th className="px-4 py-2">Usuário</th>
                            <th className="px-4 py-2">Dados Anteriores</th>
                            <th className="px-4 py-2">Dados Atuais</th>
                            <th className="px-4 py-2">Dados Alterados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historicoRegistros.map((registro, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{registro.acao}</td>
                                <td className="border px-4 py-2">{format(new Date(registro.data), 'dd/MM/yyyy HH:mm:ss')}</td>
                                <td className="border px-4 py-2">{registro.dados_atuais.nome}</td>
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
                                <td className="border px-4 py-2">
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
            <br />

        </div>
    )
}

export default HistoricoRegistro;