import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import headerImage from "../assets/images/4f80f2fd-e0f5-4343-9626-8b41aab1041b.png";

interface Processo {
    id: number; // Identificador do processo
    processo: string;
    tipo_acao: string;
    autor: string;
    reu: string;
    status: string;
    data_abertura: string;
}

const ListarProcessos: React.FC = () => {
    const [processos, setProcessos] = useState<Processo[]>([]);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    const fetchProcessos = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/processos/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setProcessos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os processos:', error);
        }
    };

    useEffect(() => {
        fetchProcessos();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:8000/processos/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setProcessos(processos.filter((processo) => processo.id !== id));
        } catch (error) {
            console.error('Erro ao excluir o processo:', error);
        }
    };

    // Função para formatar a data no formato dd/mm/yyyy
    const formatarData = (date: string): string => {
        const [ano, mes, dia] = date.split('-');
        return `${dia}/${mes}/${ano}`;
    }

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
                    position += 43; // Ajuste a posição para o conteúdo principal do PDF

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
                        footerY += 5; // Ajuste a posição Y para a próxima linha do rodapé
                    });

                    pdf.save('registros.pdf')
                }
            });
        }
    };

    return (
        <div>
            <Header />
            <h1 className="text-4xl font-bold text-center mb-5 mt-5">Lista de Processos</h1>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                {processos.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300" id="registros-table">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Processo</th>
                                    <th className="border border-gray-300 px-4 py-2">Tipo de Ação</th>
                                    <th className="border border-gray-300 px-4 py-2">Autor</th>
                                    <th className="border border-gray-300 px-4 py-2">Réu</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                    <th className="border border-gray-300 px-4 py-2">Data de Abertura</th>
                                    <th className="border border-gray-300 px-4 py-2">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processos.map((processo) => (
                                    <tr key={processo.id}>
                                        <td className="border border-gray-300 px-4 py-2">{processo.processo}</td>
                                        <td className="border border-gray-300 px-4 py-2">{processo.tipo_acao}</td>
                                        <td className="border border-gray-300 px-4 py-2">{processo.autor}</td>
                                        <td className="border border-gray-300 px-4 py-2">{processo.reu}</td>
                                        <td className="border border-gray-300 px-4 py-2">{processo.status}</td>
                                        <td className="border border-gray-300 px-4 py-2">{formatarData(processo.data_abertura)}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/editar_processo/${processo.id}`)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-1 mr-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(processo.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center mt-5">Nenhum processo encontrado.</p>
                )}

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

export default ListarProcessos;