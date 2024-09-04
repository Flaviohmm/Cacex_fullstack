import React, { useState } from "react";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const AddAtivo: React.FC = () => {
    const [nome, setNome] = useState<string>('');
    const [valor, setValor] = useState<string>('');
    const [circulante, setCirculante] = useState<boolean>(false);
    const token = localStorage.getItem('authToken');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Transformar o valor para número e validar
        const valorNumerico = parseFloat(valor.replace('R$', '').replace('.', '').replace(',', '.'));

        if (isNaN(valorNumerico)) {
            alert("Por favor, insira um valor válido.");
        }

        try {
            await axios.post('http://localhost:8000/add_ativo/', { 
                nome, 
                valor: valorNumerico, 
                circulante, 
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            // Reseta os campos
            setNome('');
            setValor('');
            setCirculante(false);
        } catch (error) {
            console.error("Erro ao adicionar ativo:", error);
        }
    };

    return (
        <div>
            <Header />
            <h1 className="text-4xl font-bold underline text-center mb-6 mt-5">Adicionar Ativo</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Nome:</label>
                    <input 
                        type="text" 
                        placeholder="Nome do Ativo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Valor:</label>
                    <NumericFormat
                        placeholder="Valor do Ativo"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale={true}
                        required
                    />
                </div>
                <div className="flex items-center mt-4">
                    <input 
                        type="checkbox"
                        checked={circulante}
                        onChange={(e) => setCirculante(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <label className="ml-2 font-semibold">Circulante</label>
                </div>
                <button type="submit" className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-700 mt-5">
                    Adicionar Ativo
                </button>
            </form>
        </div>
    );
};

export default AddAtivo;
