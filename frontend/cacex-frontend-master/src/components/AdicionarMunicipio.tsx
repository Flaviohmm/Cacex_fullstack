import React, { useState } from "react";
import axios from "axios";

const AdicionarMunicipio: React.FC = () => {
    const [municipio, setMunicipio] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8000/adicionar_municipio/', { municipio });
            setMunicipio('');
            alert('Município adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar município:', error);
            alert('Erro ao adicionar município.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Município:
                <input 
                    type="text" 
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                />
            </label>
            <button type="submit">Adicionar Município</button>
        </form>
    );
};

export default AdicionarMunicipio;