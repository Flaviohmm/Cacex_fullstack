import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import headerImage from "../assets/images/4f80f2fd-e0f5-4343-9626-8b41aab1041b.png";

interface Municipio {
    id: number;
    municipio: string;
}

interface ReceitaFederal {
    id: number;
    nome: string;
    municipio: Municipio;
    atividade: string;
    num_parcelamento: string;
    objeto: string;
    valor_total: string;
    prazo_vigencia: string;
    situacao: string;
    providencia: string;
}

const ListarReceitaFederal: React.FC = () => {
    const [receitas, setReceitas] = useState<ReceitaFederal[]>([]);
    const [error, setError] = useState('');
    const [currentModal, setCurrentModal] = useState<number | null>(null);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        fetchReceitas();
    }, []);

    useEffect(() => {
        checkExpirations();
    }, [receitas]);

    const fetchReceitas = async () => {
        if (!token) {
            alert('Token de autenticação não encontrado. Faça login novamente.');
            return;
        }

        try {
            const response = await axios.get("http://localhost:8000/receita_federal/", {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setReceitas(response.data);
            console.log('Dados da Receita Federal:', response.data)
        } catch (error) {
            console.error("Erro ao buscar dados da receita federal:", error);
            setError('Erro ao buscar receitas');
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este funcionário?");

        if (!token) return;

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/receita_federal/${id}`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                alert('Dados da receita federal excluido com sucesso!');
            } catch (error) {
                console.error("Erro ao excluir receita federal:", error);
                alert('Erro ao excluir dados da receita federal');
            }
        }
    }

    const openModal = (index: number) => {
        setCurrentModal(index);
    };

    const closeModal = () => {
        setCurrentModal(null);
    };

    const checkExpirations = () => {
        const today = new Date();
        receitas.forEach((receita: ReceitaFederal, index: number) => {
            const prazo = new Date(receita.prazo_vigencia);
            const diasRestantes = Math.ceil((prazo.getTime() - today.getTime()) / (1000 * 3600 * 24));

            if (diasRestantes <= 30) {
                openModal(index)
            }
        });
    };

    // Função para formatar valores monetários
    const formatCurrency = (value: number) => {
        return `R$ ${value.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return ''; // Retorna uma string vazia se não houver data

        const [year, month, day] = dateString.split('-'); // Divide a string de data
        return `${day}/${month}/${year}`; // Retorna no formato DD/MM/YYYY
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

                    pdf.save('registros.pdf');
                }
            });
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Lista de Dados da Receita Federal</h2>
            <div className="overflow-x-auto">
                <div className="max-h-[650px] overflow-auto p-5">
                    <table className="min-w-full border-collapse shadow-md" id="registros-table">
                        <thead className="sticky top-0 bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2">Nome</th>
                                <th className="border px-4 py-2">Município</th>
                                <th className="border px-4 py-2">Atividade</th>
                                <th className="border px-4 py-2">N° de Parcelamento</th>
                                <th className="border px-4 py-2">Objeto</th>
                                <th className="border px-4 py-2">Valor Total</th>
                                <th className="border px-4 py-2">Prazo de Vigência</th>
                                <th className="border px-4 py-2">Situação</th>
                                <th className="border px-4 py-2">Providência</th>
                                <th className="border px-4 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receitas.length > 0 ? (
                                receitas.map((receita) => (
                                    <tr key={receita.id}>
                                        <td className="border px-4 py-2 text-center bg-white">{receita.nome}</td>
                                        <td className="border px-4 py-2 text-center bg-white">{receita.municipio.municipio}</td>
                                        <td className="border px-4 py-2 text-center bg-white">{receita.atividade}</td>
                                        <td className="border px-4 py-2 text-center bg-white">{receita.num_parcelamento}</td>
                                        <td className="border px-4 py-2 text-center bg-white">{receita.objeto}</td>
                                        <td className="border px-4 py-2 text-center bg-white">{formatCurrency(parseFloat(receita.valor_total))}</td>
                                        <td className="border px-4 py-2 text-center bg-white">{formatDate(receita.prazo_vigencia)}</td>
                                        <td className="border px-4 py-2 text-center bg-white">{receita.situacao}</td>
                                        <td className="border px-4 py-2 text-center bg-white">{receita.providencia}</td>
                                        <td className="border px-4 py-2 text-center bg-white">
                                            <button 
                                                onClick={() => navigate(`/editar_receita_federal/${receita.id}`)}
                                                className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mx-2"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(receita.id)} 
                                                className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition duration-300 mx-2"
                                            >
                                                Deletar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="border px-4 py-2 text-center">Nenhuma receita encontrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <br />

                <button
                    className="mx-5 mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={generatePDF}
                >
                    Gerar PDF
                </button>
            </div>
            {/* Notificação de Prazo */}
            {currentModal !== null && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
                    <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
                    <div className="bg-white p-8 rounded shadow-lg relative">
                        <h2 className="text-xl font-bold mb-4">Notificação de Prazo</h2>

                        <div key={receitas[currentModal].id}>
                            {(() => {
                                const prazo = new Date(receitas[currentModal].prazo_vigencia);
                                const today = new Date();
                                const diasRestantes = Math.ceil((prazo.getTime() - today.getTime()) / (1000 * 3600 * 24));

                                return diasRestantes > 0
                                    ? `O prazo de vigência está próximo do seu vencimento. Restam ${diasRestantes} dias.`
                                    : `O prazo de vigência está vencido`

                            })()}
                        </div>

                        <br />

                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={closeModal}
                            >
                                Fechar
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListarReceitaFederal;