import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const ListarDados: React.FC = () => {
    const [setores, setSetores] = useState<any[]>([]);
    const [municipios, setMunicipios] = useState<any[]>([]);
    const [atividades, setAtividades] = useState<any[]>([]);
    const [editSetor, setEditSetor] = useState<any>(null);
    const [newSetorData, setNewSetorData] = useState<string>('');
    const [editMunicipio, setEditMunicipio] = useState<any>(null);
    const [newMunicipioData, setNewMunicipioData] = useState<string>('');
    const [editAtividade, setEditAtividade] = useState<any>(null);
    const [newAtividadeData, setNewAtividade] = useState<string>('');

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

    const editarSetor = (setor: any) => {
        setEditSetor(setor);
        setNewSetorData(setor.orgao_setor);
    }

    const salvarSetor = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/setores/${editSetor.id}/update_setor/`, { orgao_setor: newSetorData });
            setSetores(setores.map((setor: any) => (setor.id === editSetor.id ? response.data : setor)));
            setEditSetor(null);
            setNewSetorData('');
        } catch (error) {
            console.error("Erro ao salvar setor:", error);
        }
    }

    const deletarSetor = async (setor: any) => {
        try {
            await axios.delete(`http://localhost:8000/setores/${setor.id}/delete_setor/`);
            setSetores(setores.filter((s: any) => s.id !== setor.id));
        } catch (error) {
            console.error("Erro ao deletar setor:", error);
        }
    }

    return (
        <div>
            <Header />
            <div className="container mx-auto">
                <h2 className="text-xl font-bold mb-2 mt-4">Setores</h2>
                <table className="table-auto mt-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Setor</th>
                            <th className="border px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setores.map((setor: any, index: number) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    {editSetor?.id === setor.id ? (
                                        <input 
                                            type="text" 
                                            value={newSetorData}
                                            onChange={(e) => setNewSetorData(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        setor.orgao_setor
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editSetor?.id === setor.id ? (
                                        <button
                                            onClick={salvarSetor}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mx-2"
                                        >
                                            Salvar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => editarSetor(setor)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mx-2"
                                        >
                                            Editar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deletarSetor(setor)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mx-2"
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 className="text-xl font-bold mb-2 mt-4">Municípios</h2>
                <table className="table-auto mt-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Município</th>
                            <th className="border px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {municipios.map((municipio: any, index: number) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{municipio.municipio}</td>
                                <td className="border px-4 py-2">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mx-2">Editar</button>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mx-2">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 className="text-xl font-bold mb-2 mt-4">Atividades</h2>
                <table className="table-auto mt-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Atividade</th>
                            <th className="border px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atividades.map((atividade: any, index: number) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{atividade.atividade}</td>
                                <td className="border px-4 py-2">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mx-2">Editar</button>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mx-2">Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListarDados;