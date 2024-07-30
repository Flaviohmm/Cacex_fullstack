import React, { useEffect, useState } from "react";
import Header from "./Header";

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

    return (
        <div>
            <Header />
            <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">Registros Administrativos</h3>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th rowSpan={2} className="py-2 border-b border-gray-200 text-left text-md font-semibold text-gray-700">Município</th>
                            <th rowSpan={2} className="py-2 border-b border-gray-200 text-left text-md font-semibold text-gray-700">Vigência</th>
                            <th colSpan={3} className="text-center border-b border-gray-200 text-md font-semibold text-gray-700">Na Prefeitura</th>
                            <th className="text-center border-b border-gray-200 text-md font-semibold text-gray-700">Na CACEX</th>
                            <th colSpan={2} className="text-center border-b border-gray-200 text-md font-semibold text-gray-700">Na Pref</th>
                        </tr>
                        <tr>
                            <th colSpan={2} className="text-center border-b border-gray-200 text-md font-semibold text-gray-700">N° do Contrato</th>
                            <th className="text-center border-b border-gray-200 text-md font-semibold text-gray-700">Publicação FEMURN</th>
                            <th rowSpan={2} colSpan={2} className="text-center border-b border-gray-200 text-md font-semibold text-gray-700">Contra Assinado</th>
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
                                    <td className="py-2 border-b border-gray-200 text-md text-gray-700">{registro.municipio}</td>
                                    <td className="py-2 border-b border-gray-200 text-md text-gray-700">{registro.prazo_vigencia}</td>
                                    <td colSpan={2} className="text-center border-b border-gray-200 text-md text-gray-700">{registro.num_contrato}</td>
                                    <td className="text-center border-b border-gray-200 text-md text-gray-700">{registro.pub_femurn}</td>
                                    <td className="text-center border-b border-gray-200 text-md text-gray-700">{registro.na_cacex ? 'OK' : 'F'}</td>
                                    <td className="text-center border-b border-gray-200 text-md text-gray-700">{registro.na_prefeitura ? 'OK' : 'F'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Notificação de Prazo */}
                {currentModal !== null && (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
                        <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
                        <div className="bg-white p-8 rounded shadow-lg relative">
                            <h2 className="text-xl font-bold mb-4">Notificação de Prazo</h2>
                            
                            <div key={registros[currentModal].id}>
                                <p className="mb-4">
                                    {registros[currentModal].dias_restantes > 0
                                        ? `O prazo de vigência está próximo do seu vencimento. Restam ${registros[currentModal].dias_restantes} dias.`
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