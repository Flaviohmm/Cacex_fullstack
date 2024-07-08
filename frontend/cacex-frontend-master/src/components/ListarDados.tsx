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
    const [newAtividadeData, setNewAtividadeData] = useState<string>('');

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

    const editarMunicipio = (municipio: any) => {
        setEditMunicipio(municipio);
        setNewMunicipioData(municipio.municipio);
    }

    const salvarMunicipio = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/municipios/${editMunicipio.id}/update_municipio/`, { municipio: newMunicipioData});
            setMunicipios(municipios.map((municipio: any) => (municipio.id === editMunicipio.id ? response.data : municipio)));
            setEditMunicipio(null);
            setNewMunicipioData('');
        } catch (error) {
            console.error("Erro ao salvar município:", error);
        }
    };

    const deletarMunicipio = async (municipio: any) => {
        try {
            await axios.delete(`http://localhost:8000/municipios/${municipio.id}/delete_municipio/`);
            setMunicipios(municipios.filter((m: any) => m.id !== municipio.id))
        } catch (error) {
            console.error("Erro ao deletar município:", error);
        }
    };

    const editarAtividade = (atividade: any) => {
        setEditAtividade(atividade);
        setNewAtividadeData(atividade.atividade);
    };

    const salvarAtividade = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/atividades/${editAtividade.id}/update_atividade/`, { atividade: newAtividadeData });
            setAtividades(atividades.map((atividade: any) => (atividade.id === editAtividade.id ? response.data : atividade)));
            setEditAtividade(null);
            setNewAtividadeData('');
        } catch (error) {
            console.error("Erro ao salvar atividade:", error);
        }
    };

    const deletarAtividade = async (atividade: any) => {
        try {
            await axios.delete(`http://localhost:8000/atividades/${atividade.id}/delete_atividade/`);
            setAtividades(atividades.filter((a: any) => a.id !== atividade.id));
        } catch (error) {
            console.error("Erro ao deletar atividade:", error);
        }
    };

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
                               <td className="border px-4 py-2">
                                    {editMunicipio?.id === municipio.id ? (
                                        <input 
                                            type="text" 
                                            value={newMunicipioData}
                                            onChange={(e) => setNewMunicipioData(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        municipio.municipio
                                    )}
                               </td>
                               <td className="border px-4 py-2">
                                    {editMunicipio?.id === municipio.id ? (
                                        <button
                                            onClick={salvarMunicipio}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mx-2"
                                        >
                                            Salvar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => editarMunicipio(municipio)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mx-2"
                                        >
                                            Editar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deletarMunicipio(municipio)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mx-2"
                                    >
                                        Deletar
                                    </button>
                               </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2 className="text-xl font-bold mb-2 mt-4">Atividades</h2>
                <table className="table-auto mt-4 mb-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Atividade</th>
                            <th className="border px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atividades.map((atividade: any, index: number) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    {editAtividade?.id === atividade.id ? (
                                        <input 
                                            type="text"
                                            value={newAtividadeData}
                                            onChange={(e) => setNewAtividadeData(e.target.value)} 
                                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        atividade.atividade
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editAtividade?.id === atividade.id ? (
                                        <button
                                            onClick={salvarAtividade}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mx-2"
                                        >
                                            Salvar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => editarAtividade(atividade)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mx-2"
                                        >
                                            Editar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deletarAtividade(atividade)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 mx-2"
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
            </div>
        </div>
    );
};

export default ListarDados;