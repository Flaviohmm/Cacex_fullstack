import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import headerImage from "../assets/images/4f80f2fd-e0f5-4343-9626-8b41aab1041b.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

    const generatePDF = () => {
        const input = document.getElementById('registros-table');
        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 190; // largura da imagem no PDF
                const pageHeight = pdf.internal.pageSize.height;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                const heightLeft = imgHeight;

                let position = 0;

                // Adicione a imagem do cabeçalho
                const headerImg = new Image();
                headerImg.src = headerImage;

                headerImg.onload = () => {
                    // Adicione a imagem do cabeçalho
                    pdf.addImage(headerImg, 'PNG', 10, 10, imgWidth, 30); // Adaptação do tamanho e posição da imagem do cabeçalho
                    position += 43; // Ajuste a posiçao para o conteúdo principal do PDF

                    // Adiciona a tabela registrada como imagem
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    position += heightLeft;

                    // Se a imagem for maior que uma página, adicione uma nova página
                    while (heightLeft >= pageHeight) {
                        position = heightLeft - pageHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    }

                    // Adiciona o rodapé centralizado
                    const footerText = `Av. Antoine de Saint Exupery, n° 1003, Bairro Pitimbu, Natal/RN CEP: 59.066-430\nFone: (84) 98823-9781 / 3301-1282 - CNPJ 02.398.628/0001-12\ne-mail: centrocacex@hotmail.com\nwww.cacex.org.br`;
                    const footerX = (pdf.internal.pageSize.getWidth() / 2); // Posição X centralizada
                    let footerY = pageHeight - 20; // Posição Y para o rodapé (20 unidades do fundo da página)

                    // Define a cor e o tamanho da fonte do rodapé
                    pdf.setTextColor('#0F51A1'); // Define a cor do texto
                    pdf.setFontSize(8); // Define o tamanho da fonte (ajuste conforme necessário)

                    // Divide o footerText em linhas
                    const footerLines = footerText.split('\n');
                    footerLines.forEach(line => {
                        const lineWidth = pdf.getTextWidth(line); // Obtém a largura da linha
                        pdf.text(line, (footerX - lineWidth / 2), footerY, { baseline: 'bottom' }); // Centraliza o texto
                        footerY += 5; // Ajusta a posição Y para a próxima linha do rodapé
                    });

                    pdf.save('registros.pdf');
                }
            });
        }
    }

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mt-10 text-center">Funcionários da Previdência</h2>
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300" id="registros-table">
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

                <br />

                <button
                    className="mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={generatePDF}
                >
                    Gerar PDF
                </button>
            </div>
        </div>
    );
};

export default ListarFuncionarioPrevidencia;