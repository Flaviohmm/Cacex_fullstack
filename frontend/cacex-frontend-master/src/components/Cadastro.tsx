import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const Cadastro: React.FC = () => {
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/auth/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, senha })
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert('Erro ao realizar cadastro');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Senha</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <button type="submit">Cadastrar</button>
        </form>
    );
};

export default Cadastro;