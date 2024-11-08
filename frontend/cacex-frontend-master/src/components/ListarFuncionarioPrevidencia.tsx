import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";

const ListarFuncionarioPrevidencia: React.FC = () => {
    const [funcionarios, setFuncionarios] = useState([]); // Estado para armazenar a lista de funcionários
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const response = await axios.get('http://localhost:8000/funcionarios_prev/listar_previdencia/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setFuncionarios(response.data);
                console.log("Dados Recebidos:", response.data)
            } catch (error) {
                console.error("Erro ao listar funcionários:", error);
                alert("Houve um erro ao listar os funcionários. Tente novamente.");
            }
        };

        fetchFuncionarios();
    }, []) // Executa apenas uma vez quando o componente é montado

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este funcionário?");
        if (confirmDelete) {
            try{
                await axios.delete(`http://localhost:8000/funcionarios_prev/excluir_previdencia/${id}`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                });
                alert("Funcionário excluído com sucesso.");
                navigate("/"); // Redirect to the list page after deletion
            } catch (error) {
                console.error("Erro ao excluir funcionário:", error);
                alert("Houve um erro ao excluir o funcionário. Tente novamente.");
            }
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mt-10 text-center">Funcionários da Previdência</h2>
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 p-4 text-center">Nome</th>
                                <th className="border border-gray-300 p-4 text-center">Salário</th>
                                <th className="border border-gray-300 p-4 text-center">Categoria</th>
                                <th className="border border-gray-300 p-4 text-center">Contribuição</th>
                                <th className="border border-gray-300 p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios.length > 0 ? (
                                funcionarios.map((funcionario: any) => (
                                    <tr key={funcionario.id}>
                                        <td className="border border-gray-300 p-4 text-center">{funcionario.nome}</td>
                                        <td className="border border-gray-300 p-4 text-center">{funcionario.salario}</td>
                                        <td className="border border-gray-300 p-4 text-center">{funcionario.categoria}</td>
                                        <td className="border border-gray-300 p-4 text-center">{funcionario.contribuicao}</td>
                                        <td className="border border-gray-300 p-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/editar_previdencia/${funcionario.id}`)}
                                                className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-1 ml-2"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDelete(funcionario.id)} 
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center border-gray-300 p-4">Nenhum funcionário encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListarFuncionarioPrevidencia;