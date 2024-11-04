import React, { useState } from "react";
import Header from "./Header";
import axios from "axios";

const AddProcesso: React.FC = () => {
    const [processo, setProcesso] = useState('');
    const [tipoAcao, setTipoAcao] = useState('');
    const [autor, setAutor] = useState('');
    const [reu, setReu] = useState('');
    const [status, setStatus] = useState('');
    const [dataAbertura, setDataAbertura] = useState('');
    const token = localStorage.getItem('authToken');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/processos/`, {
                processo,
                tipo_acao: tipoAcao,
                autor,
                reu,
                status,
                data_abertura: dataAbertura,
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log('Processo adicionado:', response.data);
            // Limpar o formulário após o envio
            setProcesso('');
            setTipoAcao('');
            setAutor('');
            setReu('');
            setStatus('');
            setDataAbertura('');
        } catch (error) {
            console.error('Erro ao adicionar o processo:', error);
        }
    }

    return (
        <div>
            <Header />
            <h1 className="text-4xl font-bold text-center mb-6 mt-5">Adicionar Processo</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Processo:</label>
                    <input 
                        type="text" 
                        placeholder="Processo"
                        value={processo} 
                        onChange={(e) => setProcesso(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Tipo de Ação:</label>
                    <input 
                        type="text" 
                        placeholder="Tipo de Ação"
                        value={tipoAcao} 
                        onChange={(e) => setTipoAcao(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Autor:</label>
                    <input 
                        type="text" 
                        placeholder="Autor"
                        value={autor} 
                        onChange={(e) => setAutor(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Réu:</label>
                    <input 
                        type="text"
                        placeholder="Réu" 
                        value={reu} 
                        onChange={(e) => setReu(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Status:</label>
                    <input 
                        type="text"
                        placeholder="Status" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Data de Abertura:</label>
                    <input 
                        type="date"
                        placeholder="Data de Abertura" 
                        value={dataAbertura} 
                        onChange={(e) => setDataAbertura(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <button type="submit" className="bg-green-500 text-white font-bold px-4 py-2 hover:bg-green-700 rounded mt-5">Adicionar Processo</button>
            </form>
        </div>
    );
};

export default AddProcesso;