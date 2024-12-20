import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import headerImage from "../assets/images/4f80f2fd-e0f5-4343-9626-8b41aab1041b.png";

interface Registro {
    id: number;
    municipio: string;
    prazo_vigencia: string; // Pode ser Date se for necessário
    num_contrato: string;
    pub_femurn: string;
    na_cacex: boolean;
    na_prefeitura: boolean;
    dias_restantes: number; // Número de dias restantes
    exibir_modal_prazo_vigencia: boolean; // Para controlar a exibição do modal
}

const ListarTabelaAdministrativa = () => {
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [currentModal, setCurrentModal] = useState<number | null>(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchRegistros = async () => {
            const response = await fetch('http://localhost:8000/listar_tabela_administrativa/',  {
                headers: {
                    'Authorization': `Token ${token}`,
                }
            });
            const data: Registro[] = await response.json();
            setRegistros(data);

            // Encontrar o índice do primeiro registro que deve exibir o modal
            const primeiroRegistroComModal = data.findIndex((registro: Registro) => registro.exibir_modal_prazo_vigencia);
            if (primeiroRegistroComModal !== -1) {
                setCurrentModal(primeiroRegistroComModal);
            }
        };

        fetchRegistros();
    }, [token]);

    const editarRegistro = (registro: Registro) => {
        // Redirecionar para a página de edição com ID do registro
        window.location.href = `/editar_registro_administrativo/${registro.id}`
    }

    const excluirRegistro = async (id: number) => {
        const confirmDelete = window.confirm('Você tem certeza que deseja excluir este registro?');

        if(confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/excluir_registro_administrativo/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                alert('Registro excluído com sucesso!');
                setRegistros(registros.filter(registro => registro.id !== id)); // Atualiza a lista
            } catch (error) {
                console.error('Erro ao excluir registro:', error);
                alert('Erro ao excluir registro');
            }
        }
    };

    const closeModal = () => {
        if (currentModal !== null) {
            // Verifica o próximo registro a ser exibido
            const nextIndex = registros.findIndex((registro: Registro, index: number) =>
                index > currentModal && registro.exibir_modal_prazo_vigencia
            );
            if (nextIndex !== -1) {
                setCurrentModal(nextIndex);
            } else {
                setCurrentModal(null); // Se não houver mais, fecha o modal
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
                    pdf.addImage(headerImg, 'PNG', 10, 10 , imgWidth, 30); // Adaptação do tamanho e posição da imagem do cabeçalho
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
            <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">Registros Administrativos</h3>
                <div className="overflow-x-auto shadow-md">
                    <table className="min-w-full bg-white border border-gray-200" id="registros-table">
                        <thead className="bg-gray-100">
                            <tr>
                                <th rowSpan={2} className="py-2 border-b border-r border-gray-200 text-center text-md font-semibold text-gray-700">Município</th>
                                <th rowSpan={2} className="py-2 border-b border-r border-gray-200 text-center text-md font-semibold text-gray-700">Vigência</th>
                                <th colSpan={3} className="text-center border-b border-r border-gray-200 text-md font-semibold text-gray-700">Na Prefeitura</th>
                                <th className="text-center border-b border-r border-gray-200 text-md font-semibold text-gray-700 w-40">Na CACEX</th>
                                <th className="text-center border-b border-r border-gray-200 text-md font-semibold text-gray-700">Na Pref</th>
                                <th rowSpan={2} className="py-2 border-b border-gray-200 text-center text-md font-semibold text-gray-700">Ações</th>
                            </tr>
                            <tr>
                                <th colSpan={2} className="text-center border-b border-r border-gray-200 text-md font-semibold text-gray-700">N° do Contrato</th>
                                <th className="text-center border-b border-r border-gray-200 text-md font-semibold text-gray-700">Publicação FEMURN</th>
                                <th colSpan={2} className="text-center border-b border-r border-gray-200 text-md font-semibold text-gray-700">Contra Assinado</th>
                            </tr>
                            
                        </thead>
                        <tbody>
                            {registros.map((registro: Registro, index: number) => {
                                // Determinar a classe da linha com base nas condições
                                let rowClass = '';
                                if (registro.dias_restantes <= 30 && registro.dias_restantes >= 0) {
                                    rowClass = 'bg-yellow-100'; // tabela-warning
                                } else if (registro.na_cacex && registro.na_prefeitura) {
                                    rowClass = 'bg-green-100'; // tabela-success
                                } else {
                                    rowClass = 'bg-red-100'; // tabela-danger
                                }

                                return (
                                    <tr key={registro.id} className={rowClass} onClick={() => {
                                        if (registro.exibir_modal_prazo_vigencia) {
                                            const index = registros.findIndex((r: Registro) => r.id === registro.id);
                                            setCurrentModal(index);
                                        }
                                    }}>
                                        <td className="py-2 border-b border-gray-200 text-md text-gray-700 text-center">{registro.municipio}</td>
                                        <td className="py-2 border-b border-gray-200 text-md text-gray-700 text-center">{registro.prazo_vigencia}</td>
                                        <td colSpan={2} className="text-center border-b border-gray-200 text-md text-gray-700">{registro.num_contrato}</td>
                                        <td className="text-center border-b border-gray-200 text-md text-gray-700">{registro.pub_femurn}</td>
                                        <td className="text-center border-b border-gray-200 text-md text-gray-700">{registro.na_cacex ? 'OK' : 'F'}</td>
                                        <td className="text-center border-b border-gray-200 text-md text-gray-700">{registro.na_prefeitura ? 'OK' : 'F'}</td>
                                        <td className="text-center border-b border-gray-200 text-md text-gray-700">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline px-2 py-1 mb-1" onClick={() => editarRegistro(registro)}>Editar</button>
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:shadow-outline px-2 py-1 ml-2" onClick={() => excluirRegistro(registro.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                );
                            })}
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

                {/* Notificação de Prazo */}
                {currentModal !== null && (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
                        <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
                        <div className="bg-white p-8 rounded shadow-lg relative">
                            <h2 className="text-xl font-bold mb-4">Notificação de Prazo</h2>
                            
                            <div key={registros[currentModal].id}>
                                <p className="mb-4">
                                    {registros[currentModal].dias_restantes > 0
                                        ? `O prazo de vigência do contrato ${registros[currentModal].num_contrato} está próximo do seu vencimento. Restam ${registros[currentModal].dias_restantes} dias.`
                                        : `O prazo de vigência do contrato ${registros[currentModal].num_contrato} venceu.`
                                    }
                                </p>
                            </div>
                                
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
        </div>
    );
};

export default ListarTabelaAdministrativa;