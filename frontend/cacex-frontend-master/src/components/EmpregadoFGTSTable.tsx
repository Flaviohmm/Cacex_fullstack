import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import headerImage from "../assets/images/4f80f2fd-e0f5-4343-9626-8b41aab1041b.png";

interface Empregado {
    id: number;
    nome: string;
    cpf: string;
    pis_pasep: string;
}

interface IndividualizacaoFGTS {
    id: number;
    mes_ano: string;
    renumeracao_bruta: string;
    valor_fgts: string;
}

const EmpregadoFGTSTable: React.FC = () => {
    const [empregadoFGTS, setEmpregadoFGTS] = useState<IndividualizacaoFGTS[]>([]);
    const [empregados, setEmpregados] = useState<Empregado[]>([]);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpregado = async () => {
            try {
                const response = await axios.get('http://localhost:8000/empregado/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setEmpregados(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados de Empregados:", error);
            }
        }

        const fetchEmpregadosFGTS = async () => {
            try {
                const response = await axios.get('http://localhost:8000/individualizacao_fgts/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                
                if (Array.isArray(response.data)) {
                    setEmpregadoFGTS(response.data);
                } else {
                    console.error("Estrutura de dados inesperada:", response.data);
                    setEmpregadoFGTS([]);
                }
            } catch (error) {
                console.error("Erro ao buscar dados de FGTS:", error);
                setEmpregadoFGTS([]);
            }
        };

        fetchEmpregado();
        fetchEmpregadosFGTS();
    }, [token]);

    // Função para formatar CPF
    const formatCPF = (cpf: string) => {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    };

    // Função para formatar PIS/PASEP
    const formatPISPasep = (pis: string) => {
        return pis.replace(/^(\d{3})(\d{5})(\d{2})(\d)$/, '$1.$2.$3-$4');
    }

    // Função para formatar mês/ano
    const formatMonthYear = (mesAno: string) => {
        const [year, month] = mesAno.split('-'); // Supondo que o formato seja "YYYY-MM"
        return `${month}/${year}`;
    };

    // Função para formatar valores monetários
    const formatCurrency = (value: number) => {
        return `R$ ${value.toLocaleString('pt-BR', { 
            style: 'decimal',
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })}`;
    };

    // Função de exclusão
    const handleDelete = async (id: number) => {
        const confirmar = window.confirm("Você tem certeza que deseja excluir está individualização de FGTS?");
        if (confirmar) {
            try {
                await axios.delete(`http://localhost:8000/individualizacao_fgts/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                // Atualiza a tabela após a exclusão
                setEmpregadoFGTS(empregadoFGTS.filter(item => item.id !== id));
                alert("Individualização de FGTS excluída com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir individualização de FGTS:", error);
                alert("Ocorreu um erro ao excluir a individualização.");
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
                        footerY += 5; // Ajuste a posição Y para a prómixa linha do rodapé
                    });

                    pdf.save('registros.pdf');
                }
            });
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Tabela de Individualização de FGTS</h2>
            <div className="overflow-x-auto p-4">
                <table className="min-w-full bg-white border border-gray-300 shadow-md" id="registros-table">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Nome do Empregado</th>
                            <th className="px-4 py-2 text-left">CPF</th>
                            <th className="px-4 py-2 text-left">PIS/PASEP</th>
                            <th className="px-4 py-2 text-left">Mês/Ano</th>
                            <th className="px-4 py-2 text-left">Renumuneração Bruta</th>
                            <th className="px-4 py-2 text-left">Valor do FGTS</th>
                            <th className="px-4 py-2 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empregadoFGTS.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2 bg-white">{empregados.map((empregado) => empregado.nome)}</td>
                                <td className="border px-4 py-2 bg-white">{empregados.map((empregado) => formatCPF(empregado.cpf))}</td>
                                <td className="border px-4 py-2 bg-white">{empregados.map((empregado) => formatPISPasep(empregado.pis_pasep))}</td>
                                <td className="border px-4 py-2 bg-white">{formatMonthYear(item.mes_ano)}</td>
                                <td className="border px-4 py-2 bg-white">{formatCurrency(parseFloat(item.renumeracao_bruta))}</td>
                                <td className="border px-4 py-2 bg-white">{formatCurrency(parseFloat(item.valor_fgts))}</td>
                                <td className="border px-4 py-2 text-center bg-white">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/editar_individualizacao/${item.id}`)}
                                        className="bg-blue-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-1 ml-2"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => handleDelete(item.id)} // Chamada à função handleDelete
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <br />

            <button
                className="mx-4 mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={generatePDF}
            >
                Gerar PDF
            </button>
        </div>
    );
};

export default EmpregadoFGTSTable;