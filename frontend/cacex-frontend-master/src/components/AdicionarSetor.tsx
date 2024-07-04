import React, { useState } from "react";

const AdicionarSetor: React.FC = () => {
    const [setor, setSetor] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/adicionar-setor/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: setor }),
            });

            if (response.ok) {
                setMessage('Setor enviado com sucesso!');
                setSetor('');
            } else {
                setMessage('Erro ao enviar o setor para a API Django');
            }

        } catch (error) {
            console.error('Erro ao enviar com sucesso!', error);
            setMessage('Erro ao enviar o setor');
        }
    };

    return (
        <div>
            <h2>Adicionar Setor</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="setor">Setor:</label>
                    <input
                        type="text"
                        id="setor"
                        value={setor}
                        onChange={(event) => setSetor(event.target.value)}
                        required
                    />
                </div>
                <button type="submit">Adicionar Setor</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default AdicionarSetor;