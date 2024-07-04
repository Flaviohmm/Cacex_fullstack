import React, { useState } from "react";
import axios from "axios";

const AdicionarAtividade: React.FC = () => {
    const [atividade, setAtividade] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/adicionar_atividade', {atividade});
            setAtividade('');
            alert('Atividade adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar atividade:', error);
            alert('Erro ao adicionar atividade.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Atividade:
                <input 
                    type="text"
                    value={atividade}
                    onChange={(e) => setAtividade(e.target.value)} 
                />
            </label>
            <button type="submit">Adicionar Atividade</button>
        </form>
    );
};

export default AdicionarAtividade;