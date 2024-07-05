import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const ListarDados: React.FC = () => {
    const [setores, setSetores] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [atividades, setAtividades] = useState([]);

    const fetchSetores = async () => {
        try {
            const response = await axios.get("http://localhost:8000/listar_setores/");
            setSetores(response.data);
        } catch (error) {
            console.error("Erro ao listar setores:", error)
        }
    };

    const fetchMunicipios = async () => {
        try {
            const response = await axios.get("http://localhost:8000/listar_municipios/");
            setMunicipios(response.data);
        } catch (error) {
            console.error("Erro ao listar municípios:", error)
        }
    };

    const fetchAtividades = async () => {
        try {
            const response = await axios.get("http://localhost:8000/listar_atividades/");
            setAtividades(response.data);
        } catch (error) {
            console.error("Erro ao listar atividades:", error)
        }
    };

    useEffect(() => {
        fetchSetores();
        fetchMunicipios();
        fetchAtividades();
    }, []);

    return (
        <div>
            <Header />
            <div className="container mx-auto">
                <h2 className="text-xl font-bold mb-2 mt-4">Setores</h2>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Setor</th>
                            <th className="border px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setores.map((setor: any, index: number) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{setor.orgao_setor}</td>
                                <td className="border px-4 py-2">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mx-2">Editar</button>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mx-2">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 className="text-xl font-bold mb-2 mt-4">Municípios</h2>
                <ul>
                    {municipios.map((municipio: any, index: number) => (
                        <li key={index}>{municipio.municipio}</li>
                    ))}
                </ul>

                <h2 className="text-xl font-bold mb-2 mt-4">Atividades</h2>
                <ul>
                    {atividades.map((atividade: any, index: number) => (
                        <li key={index}>{atividade.atividade}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ListarDados;