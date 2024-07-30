import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";

const EditRegistroAdministrativo = () => {
    const { id } = useParams<{ id: string }>();
    const [municipios, setMunicipios] = useState<any[]>([]);
    const [registro, setRegistro] = useState({
        municipio: '',
        prazo_vigencia: '',
        num_contrato: '',
        pub_femurn: '',
        na_cacex: false,
        na_prefeitura: false,
    });

    const fetchMunicipios = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.get("http://localhost:8000/listar_municipios/", {
                headers: {
                    'Authorization': `Token ${token}`
                },
            });
            setMunicipios(response.data);
        } catch (error) {
            console.error("Erro ao listar municípios:", error);
        }
    };

    useEffect(() => {
        const fetchRegistro = async () => {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://localhost:8000/listar_tabela_administrativa/${id}`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setRegistro(response.data);
        };

        fetchMunicipios()
        fetchRegistro();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;

        // Verifique se o tipo é um input checkbox
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setRegistro({
            ...registro,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        try {
            await axios.put(`http://localhost:8000/editar_registro_administrativo/${id}/`, registro, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            alert('Registro editado com sucesso!');
            window.location.href = '/listar_tabela_administrativa';
        } catch (error) {
            alert('Erro ao editar o registro: ')
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Editar Registro Administrativo</h2>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Município:</label>
                    <select name="municipio" value={registro.municipio} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="">Selecione um Município</option>
                        {municipios.map((municipio: any, index: number) => (
                            <option key={index} value={municipio.id}>{municipio.municipio}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Prazo de Vigência:</label>
                    <input
                        type="date"
                        name="prazo_vigencia"
                        value={registro.prazo_vigencia}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">N° do Contrato:</label>
                    <input 
                        type="text"
                        name="num_contrato"
                        value={registro.num_contrato} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Publicação do FEMURN:</label>
                    <input 
                        type="text"
                        name="pub_femurn"
                        value={registro.pub_femurn}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Na Cacex:</label>
                    <input 
                        type="checkbox"
                        name="na_cacex"
                        checked={registro.na_cacex}
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-indigo-600" 
                    />
                </div>

                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Na Prefeitura:</label>
                    <input 
                        type="checkbox"
                        name="na_prefeitura"
                        checked={registro.na_prefeitura} 
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                </div>

                <br />

                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Editar Registro
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRegistroAdministrativo;