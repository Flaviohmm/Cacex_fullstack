import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

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

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Lista de Dados da Receita Federal</h2>
            <div className="overflow-x-auto">
                <div className="max-h-[650px] overflow-auto p-5">
                    <table className="min-w-full border-collapse shadow-md">
                        <thead className="sticky top-0">
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
                            </tr>
                        </thead>
                        <tbody>
                            {receitas.length > 0 ? (
                                receitas.map((receita) => (
                                    <tr key={receita.id}>
                                        <td className="border px-4 py-2 text-center">{receita.nome}</td>
                                        <td className="border px-4 py-2 text-center">{receita.municipio.municipio}</td>
                                        <td className="border px-4 py-2 text-center">{receita.atividade}</td>
                                        <td className="border px-4 py-2 text-center">{receita.num_parcelamento}</td>
                                        <td className="border px-4 py-2 text-center">{receita.objeto}</td>
                                        <td className="border px-4 py-2 text-center">{formatCurrency(parseFloat(receita.valor_total))}</td>
                                        <td className="border px-4 py-2 text-center">{formatDate(receita.prazo_vigencia)}</td>
                                        <td className="border px-4 py-2 text-center">{receita.situacao}</td>
                                        <td className="border px-4 py-2 text-center">{receita.providencia}</td>
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