import React, { useState } from "react";
import Header from "./Header";
import axios from "axios";
import InputMask from "react-input-mask";

const AddEmpregado: React.FC = () => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [pisPasep, setPisPasep] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('authToken');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError('Token de autenticação não encontrado. Faça login novamente.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/empregado/', {
                nome,
                cpf: cpf.replace(/\D/g, ''), // Removendo caracteres não numéricos
                pis_pasep: pisPasep.replace(/\D/g, ''), // Removendo caracteres não numéricos
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log('Empregado criado:', response.data);
            setSuccess('Empregado criado com sucesso!');
            // Resetando os campos do formulário
            setNome('');
            setCpf('');
            setPisPasep('');
        } catch (error) {
            console.error('Erro ao criar empregado:', error);
            if (axios.isAxiosError(error) && error.response) {
                setError(`Erro ao criar empregado: ${error.response.data.detail|| error.message}`);  
            } else {
                setError("Um erro inesperado ocorreu.");
            }
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Criar Empregado</h2>
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
                <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar Empregado</button>
                <br />
                {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
                {success && <p className="text-green-500 mt-4 font-bold">{success}</p>}
            </form>
        </div>
    );
};

export default AddEmpregado;