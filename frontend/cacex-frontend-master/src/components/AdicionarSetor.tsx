import React, { useState } from "react";
import axios from "axios";

const AdicionarSetor: React.FC = () => {
    const [orgaoSetor, setOrgaoSetor] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/adicionar_setor/', {orgao_setor: orgaoSetor});
            setOrgaoSetor('');
            alert('Setor adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar setor:', error);
            alert('Erro ao adicionar setor.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Setor:
                    <input 
                        type="text" 
                        value={orgaoSetor}
                        onChange={(e) => setOrgaoSetor(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </label>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Adicionar Setor
                </button>
            </div>
        </form>
    );
};

export default AdicionarSetor;