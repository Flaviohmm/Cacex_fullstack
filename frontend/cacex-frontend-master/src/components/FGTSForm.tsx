import React, { useState } from "react";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";

interface FGTSData {
    nome: string;
    data_inicial: string;
    data_final: string;
    salario_bruto: number;
    taxa_juros_anual: number;
    taxa_correcao_mensal: number;
}

const FGTSForm: React.FC = () => {
    const token = localStorage.getItem('authToken');
    const [formData, setFormData] = useState<FGTSData>({
        nome: '',
        data_inicial: '',
        data_final: '',
        salario_bruto: 0,
        taxa_juros_anual: 0,
        taxa_correcao_mensal: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'salario_bruto' || name === 'taxa_juros_anual' || name === 'taxa_correcao_mensal' 
                ? (value ? parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) : 0) 
                : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/fgts/', formData, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            alert("FGTS adicionado com sucesso.")
            console.log(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert("Erro ao criar FGTS")
                console.error('Error creating FGTS entry:', error.response?.data || error.message);
            } else {
                alert("Erro ao criar FGTS")
                console.error('Error creating FGTS entry:', error);
            }
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Adicionar FGTS</h2>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Nome do Funcionario:</label>
                    <input 
                        type="text" 
                        name="nome" 
                        placeholder="Nome do Funcionário" 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Data Inicial:</label>
                    <input 
                        type="date" 
                        name="data_inicial" 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Data Final:</label>
                    <input 
                        type="date" 
                        name="data_final" 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Salário Bruto:</label>
                    <NumericFormat 
                        name="salario_bruto" 
                        placeholder="Salário Bruto" 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale={true}
                        required 
                    />
                </div>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Taxa de Juros Anual:</label>
                    <input 
                        type="number" 
                        name="taxa_juros_anual" 
                        placeholder="Taxa de Juros Anual (%)" 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Taxa de Correção Mensal:</label>
                    <input 
                        type="number" 
                        name="taxa_correcao_mensal" 
                        placeholder="Taxa de Correção Mensal (%)" 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded" 
                        required 
                    />
                </div>
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar FGTS</button>
            </form>

        </div>
    );
};

export default FGTSForm;