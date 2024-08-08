import React, { useState } from "react";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const AdicionarFuncionarioPrevidencia: React.FC = () => {
    const [nome, setNome] = useState('');
    const [salario, setSalario] = useState('');
    const [categoria, setCategoria] = useState('ATIVO');  // Estado para armazenar a categoria
    const token = localStorage.getItem('authToken');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Transformar o salário para número e validar
        const salarioNumerico = parseFloat(salario.replace('R$', '').replace('.', '').replace(',', '.'));

        if (isNaN(salarioNumerico)) {
            alert("Por favor, insira um salário válido.");
        }

        try {
            await axios.post('http://localhost:8000/funcionarios_prev/adicionar_previdencia/', {
                nome,
                salario: salarioNumerico, 
                categoria, // Inclui a categoria na requisição
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setNome('');
            setSalario('');
            setCategoria('ATIVO'); // Reseta a categoria para padrão após o envio
            alert("Funcionário foi adicionado na previdencia com sucesso.")
        } catch (error) {
            console.error("Erro ao adicionar funcionário:", error);
            alert("Houve um erro ao adicionar o funcionário. Tente novamente.")
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md" method="POST">
            <h2 className="text-2xl font-bold mb-6 text-center">Adicionar Previdencia</h2>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Nome do Funcionario:</label>
                    <input 
                        type="text" 
                        placeholder="Digite o nome do funcionario para previdencia."
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Salário:</label>
                    <NumericFormat
                        placeholder="Digite o salário do funcionario"
                        value={salario}
                        onChange={(e) => setSalario(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        thousandSeparator='.'
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale={true}
                        required
                    />
                </div>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Categorias:</label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="ATIVO">Ativo</option>
                        <option value="INATIVO">Inativo</option>
                        <option value="APOSENTADO">Aposentado</option>
                    </select>
                </div>
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Adicionar Funcionários</button>
            </form>
        </div>
    );
};

export default AdicionarFuncionarioPrevidencia;