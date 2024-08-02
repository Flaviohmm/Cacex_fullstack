import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";

const EditarFuncionarioPrevidencia: React.FC = () => {
    const { pk } = useParams<{ pk: string }>();
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [salario, setSalario] = useState('');
    const [categoria, setCategoria] = useState('ATIVO');
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchFuncionario = async () => {
            if (!pk) {
                console.error("ID do funcionário é underfined.");
                alert("ID do funcionário não pôde ser encontrado.");
            }

            try {
                const response = await axios.get(`http://localhost:8000/funcionarios_prev/${pk}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                const funcionario = response.data;
                setNome(funcionario.nome);
                setSalario(funcionario.salario);
                setCategoria(funcionario.categoria);
                console.log("Dados Recebidos:", funcionario)
            } catch (error) {
                console.error("Erro ao buscar funcionário:", error);
                alert("Houve um erro ao buscar os dados do funcionário.")
            }
        };

        fetchFuncionario();
    }, [pk]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const salarioNumerico = parseFloat(salario.replace('R$', '').replace('.', '').replace(',', '.'));

        try {
            await axios.put(`http://localhost:8000/funcionarios_prev/atualizar_previdencia/${pk}/`, {
                nome, 
                salario: salarioNumerico,
                categoria,
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            alert("Funcionário atualizado com sucesso.");
            navigate("/listar_previdencia");
        } catch (error) {
            console.error("Erro ao atualizar funcionários:", error);
            alert("Houve um erro ao atualizar o funcionário. Tente novamente.");
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleUpdate} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Editar Funcionários</h2>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Nome do Funcionário:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-md font-bold mb-2 mt-4">Salário:</label>
                    <NumericFormat
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
                    <label className="block text-md font-bold mb-2 mt-4">Categorias</label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" required>
                        <option value="ATIVO">Ativo</option>
                        <option value="INATIVO">Inativo</option>
                        <option value="APOSENTADO">Aposentado</option>
                    </select>
                </div>
                <br />
                <button type="submit" className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Atualizar
                </button>
            </form>
        </div>
    )
}

export default EditarFuncionarioPrevidencia;