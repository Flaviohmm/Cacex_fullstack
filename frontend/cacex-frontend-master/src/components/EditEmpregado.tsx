import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import InputMask from "react-input-mask";
import { useParams, useNavigate } from "react-router-dom";

const EditEmpregado: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtendo o ID do empregado da URL
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [pisPasep, setPisPasep] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchEmpregado = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/empregado/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                const { nome, cpf, pis_pasep } = response.data;
                setNome(nome);
                setCpf(cpf);
                setPisPasep(pis_pasep);
            } catch (error) {
                console.error('Erro ao buscar empregado:', error);
                alert('Empregado não encontrado.');
            }
        };

        fetchEmpregado();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError('Token de autenticação não encontrado. Faça login novamente.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/empregado/${id}/`, {
                nome,
                cpf: cpf.replace(/\D/g, ''),
                pis_pasep: pisPasep.replace(/\D/g, ''),
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log('Dados atualizados:', response.data);
            setSuccess('Empregado atualizado com sucesso!');
            // Redireciona após a atualização
            setTimeout(() => navigate('/listar_empregados'), 2000);
        } catch (error) {
            console.error('Erro ao atualizar empregado:', error);
            if (axios.isAxiosError(error) && error.response) {
                setError(`Erro ao atualizar empregado: ${error.response.data.detail || error.message}`);
            } else {
                setError("Um erro inesperado ocorreu.");
            }
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Editar Empregado</h2>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">Nome:</label>
                    <input
                        type="text"
                        placeholder="Digite o Nome do empregado"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">CPF:</label>
                    <InputMask
                        mask="999.999.999-99"
                        placeholder="Digite o CPF do empregado"
                        value={cpf}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCpf(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-4">PIS/PASEP:</label>
                    <InputMask
                        mask="999.99999.99-9"
                        placeholder="Digite o PIS/PASEP do empregado"
                        value={pisPasep}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPisPasep(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Atualizar Empregado</button>
                <br />
                {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
                {success && <p className="text-green-500 mt-4 font-bold">{success}</p>}
            </form>
        </div>
    );
};

export default EditEmpregado;