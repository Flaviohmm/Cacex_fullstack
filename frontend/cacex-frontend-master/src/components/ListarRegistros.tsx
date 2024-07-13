import React, { useEffect, useState } from "react";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import Header from "./Header";
import DetalheModal from "./DetalheModal";

interface Registro {
    id: number;
    nome: string;
    orgao_setor: string;
    municipio: string;
    atividade: string;
    num_convenio: string;
    parlamentar: string;
    objeto: string;
    oge_ogu: number;
    cp_prefeitura: number;
    valor_total: number;
    valor_liberado: number;
    falta_liberar: number;
    prazo_vigencia: string;
    situacao: string;
    providencia: string;
    status: string;
    data_recepcao: string;
    data_inicio: string;
    documento_pendente: string;
    documento_cancelado: string;
    data_fim: string;
    duracao_dias_uteis: number;
    exibir_modal_prazo_vigencia: boolean;
    dias_restantes_prazo_vigencia: number;
}

const ListarRegistros: React.FC = () => {
    const [registros, setRegistros] = useState<any[]>([]);
    const [currentModal, setCurrentModal] = useState<number | null>(null);
    const [selectedRegistro, setSelectedRegistro] = useState<Registro | null>(null);

    useEffect(() => {
        const carregarRegistros = async () => {
            try {
                const response = await axios.get("http://localhost:8000/listar_registros/");
                setRegistros(response.data);
                const firstModalIndex = response.data.findIndex((r: Registro) => r.exibir_modal_prazo_vigencia);
                if (firstModalIndex !== -1) {
                    setCurrentModal(response.data[firstModalIndex].id);
                }
            } catch (error) {
                console.error("Erro ao buscar registros:", error)
            }
        };

        carregarRegistros();
    }, []);

    const generateCSV = () => {
        const csvHeaders = [
            "Nome",
            "Órgão/Setor",
            "Município",
            "Atividade",
            "Número do Convênio",
            "Parlamentar",
            "Objeto",
            "OGE/OGU",
            "CP Prefeitura",
            "Valor Total",
            "Valor Liberado",
            "Falta Liberar",
            "Prazo de Vigência",
            "Situação",
            "Providência",
            "Status",
            "Data de Recepção",
            "Data de Início",
            "Documento Pendente",
            "Documento Cancelado",
            "Data do Fim",
            "Duração de Dias Úteis",
        ];

        const csvRows = [
            csvHeaders.join(";"),
            ...registros.map((registro: Registro) => [
                registro.nome,
                registro.orgao_setor,
                registro.municipio,
                registro.atividade,
                registro.num_convenio,
                registro.parlamentar,
                registro.objeto,
                typeof registro.oge_ogu === 'number' ? `R$ ${registro.oge_ogu.toFixed(2).replace(".", ",")}` : `${registro.oge_ogu}`.replace('.', ','),
                typeof registro.cp_prefeitura === 'number' ? `R$ ${registro.cp_prefeitura.toFixed(2).replace(".", ",")}` : `${registro.cp_prefeitura}`.replace('.', ','),
                typeof registro.valor_total === 'number' ? `R$ ${registro.valor_total.toFixed(2).replace(".", ",")}` : `${registro.valor_total}`.replace('.', ','),
                typeof registro.valor_liberado === 'number' ? `R$ ${registro.valor_liberado.toFixed(2).replace(".", ",")}` : `${registro.valor_liberado}`.replace('.', ','),
                typeof registro.falta_liberar === 'number' ? `R$ ${registro.falta_liberar.toFixed(2).replace(".", ",")}` : `${registro.falta_liberar}`.replace('.', ','),
                registro.prazo_vigencia,
                registro.situacao,
                registro.providencia,
                registro.status,
                registro.data_recepcao,
                registro.data_inicio,
                registro.documento_pendente,
                registro.documento_cancelado,
                registro.data_fim,
                registro.duracao_dias_uteis
            ].join(";"))
        ];

        const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a')
        a.style.display = 'none';
        a.href = url;
        a.download = 'registros.csv';
        document.body.appendChild(a)
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const openModal = (registro: Registro) => {
        setSelectedRegistro(registro)
    }

    const closeModalDetail = () => {
        setSelectedRegistro(null);
    }

    const closeModal = (id: number) => {
        setCurrentModal(null); // Close the current modal
        // Move to the next modal if present
        const nextIndex = registros.findIndex((registro: Registro) => registro.id === id) + 1;
        const nextModal = registros.find((registro: Registro, index: number) => index >= nextIndex && registro.exibir_modal_prazo_vigencia);
        if (nextModal) {
            setCurrentModal(nextModal.id);
        }
    }

    return (
        <div>
            <Header />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Registros</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <th className="py-2 px-4 border-b text-left">Nome</th>
                            <th className="py-2 px-4 border-b text-left">Órgão/Setor</th>
                            <th className="py-2 px-4 border-b text-left">Município</th>
                            <th className="py-2 px-4 border-b text-left">Atividade</th>
                            <th className="py-2 px-4 border-b text-left">Número do Convênio</th>
                            <th className="py-2 px-4 border-b text-left">Parlamentar</th>
                            <th className="py-2 px-4 border-b text-left">Objeto</th>
                            <th className="py-2 px-4 border-b text-left">OGE/OGU</th>
                            <th className="py-2 px-4 border-b text-left">CP Prefeitura</th>
                            <th className="py-2 px-4 border-b text-left">Valor Total</th>
                            <th className="py-2 px-4 border-b text-left">Valor Liberado</th>
                            <th className="py-2 px-4 border-b text-left">Falta Liberar</th>
                            <th className="py-2 px-4 border-b text-left">Prazo de Vigência</th>
                            <th className="py-2 px-4 border-b text-left">Situação</th>
                            <th className="py-2 px-4 border-b text-left">Providencia</th>
                            <th className="py-2 px-4 border-b text-left">Status</th>
                            <th className="py-2 px-4 border-b text-left">Data de Recepção</th>
                            <th className="py-2 px-4 border-b text-left">Data de Inicio</th>
                            <th className="py-2 px-4 border-b text-left">Documento Pendente</th>
                            <th className="py-2 px-4 border-b text-left">Documento Cancelado</th>
                            <th className="py-2 px-4 border-b text-left">Data do Fim</th>
                            <th className="py-2 px-4 border-b text-left">Duração de Dias Uteis</th>
                            <th className="py-2 px-4 border-b text-left">Ver Detalhes</th>
                        </thead>
                        <tbody>
                            {registros.map((registro: Registro, index: number) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{registro.nome}</td>
                                    <td className="py-2 px-4 border-b">{registro.orgao_setor}</td>
                                    <td className="py-2 px-4 border-b">{registro.municipio}</td>
                                    <td className="py-2 px-4 border-b">{registro.atividade}</td>
                                    <td className="py-2 px-4 border-b">{registro.num_convenio}</td>
                                    <td className="py-2 px-4 border-b">{registro.parlamentar}</td>
                                    <td className="py-2 px-4 border-b">{registro.objeto}</td>
                                    <td className="py-2 px-4 border-b">
                                        <NumericFormat
                                            value={registro.oge_ogu}
                                            displayType={'text'}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            prefix={'R$ '}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <NumericFormat
                                            value={registro.cp_prefeitura}
                                            displayType={'text'}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            prefix={'R$ '}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <NumericFormat
                                            value={registro.valor_total}
                                            displayType="text"
                                            thousandSeparator={'.'}
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <NumericFormat
                                            value={registro.valor_liberado}
                                            displayType="text"
                                            thousandSeparator={'.'}
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <NumericFormat
                                            value={registro.falta_liberar}
                                            displayType="text"
                                            thousandSeparator={'.'}
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {registro.prazo_vigencia}
                                    </td>
                                    <td className="py-2 px-4 border-b">{registro.situacao}</td>
                                    <td className="py-2 px-4 border-b">{registro.providencia}</td>
                                    {registro.status === 'Concluído' && (
                                        <td className="py-2 px-4 border-b bg-green-500">{registro.status}</td>
                                    )}
                                    {registro.status === 'Pendente' && (
                                        <td className="py-2 px-4 border-b bg-red-500 text-white">{registro.status}</td>
                                    )}
                                    {registro.status === 'Suspenso' &&(
                                        <td className="py-2 px-4 border-b bg-gray-300">{registro.status}</td>
                                    )}
                                    {registro.status === 'Não Iniciado' && (
                                        <td className="py-2 px-4 border-b bg-blue-500 text-white">{registro.status}</td>
                                    )}
                                    {registro.status === 'Em Análise' && (
                                        <td className="py-2 px-4 border-b bg-yellow-300">{registro.status}</td>
                                    )}
                                    <td className="py-2 px-4 border-b">
                                        {registro.data_recepcao}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {registro.data_inicio}
                                    </td>
                                    <td className="py-2 px-4 border-b">{registro.documento_pendente}</td>
                                    <td className="py-2 px-4 border-b">{registro.documento_cancelado}</td>
                                    <td className="py-2 px-4 border-b">{registro.data_fim}</td>
                                    <td className="py-2 px-4 border-b">{registro.duracao_dias_uteis}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button className="bg-blue-500 text-white font-bold hover:bg-blue-700 py-2 px-4 rounded" onClick={() => openModal(registro)}>
                                            Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

                {selectedRegistro && (
                    <DetalheModal
                        registro={selectedRegistro}
                        isOpen={!!selectedRegistro}
                        onClose={closeModalDetail}
                    />
                )}

                <br />

                <button
                    className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={generateCSV}
                >
                    Gerar CSV
                </button>
            </div>
            
            {registros.map((registro: Registro) => (
                registro.exibir_modal_prazo_vigencia && currentModal === registro.id && (
                    <div key={registro.id} className={`fixed inset-0 z-50 flex items-center justify-center ${currentModal === registro.id ? 'block' : 'hidden'}`}>
                        <div className="fixed inset-0 bg-black opacity-50" onClick={() => closeModal(registro.id)}></div>
                        <div className="bg-white p-8 rounded shadow-lg relative">
                            <h2 className="text-xl font-bold mb-4">Notificação de Prazo</h2>
                            <p className="mb-4">
                                {registro.dias_restantes_prazo_vigencia > 0
                                    ? `O convênio ${registro.num_convenio} está com o prazo de vigência próximo do seu vencimento. Restam ${registro.dias_restantes_prazo_vigencia} dias.`
                                    : `O convênio ${registro.num_convenio} está com o prazo de vigência vencido.`
                                }
                            </p>
                            <div className="flex justify-end">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => closeModal(registro.id)}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default ListarRegistros;