import React, { useEffect, useState } from "react";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import Header from "./Header";

const ListarRegistros: React.FC = () => {
    const [registros, setRegistros] = useState<any[]>([]);

    useEffect(() => {
        const carregarRegistros = async () => {
            try {
                const response = await axios.get("http://localhost:8000/listar_registros/");
                setRegistros(response.data);
            } catch (error) {
                console.error("Erro ao buscar registros:", error)
            }
        };

        carregarRegistros();
    }, []);

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
                        </thead>
                        <tbody>
                            {registros.map((registro: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{registro.nome}</td>
                                    <td className="py-2 px-4 border-b">{registro.orgao_setor}</td>
                                    <td className="py-2 px-4 border-b">{registro.municipio}</td>
                                    <td className="py-2 px-4 border-b">{registro.atividade}</td>
                                    <td className="py-2 px-4 border-b">{registro.num_convenio}</td>
                                    <td className="py-2 px-4 border-b">{registro.parlamentar}</td>
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
                                    <td className="py-2 px-4 border-b">{registro.prazo_vigencia}</td>
                                    <td className="py-2 px-4 border-b">{registro.situacao}</td>
                                    <td className="py-2 px-4 border-b">{registro.providencia}</td>
                                    <td className="py-2 px-4 border-b">{registro.status}</td>
                                    <td className="py-2 px-4 border-b">{registro.data_recepcao}</td>
                                    <td className="py-2 px-4 border-b">{registro.data_inicio}</td>
                                    <td className="py-2 px-4 border-b">{registro.documento_pendente}</td>
                                    <td className="py-2 px-4 border-b">{registro.documento_cancelado}</td>
                                    <td className="py-2 px-4 border-b">{registro.data_fim}</td>
                                    <td className="py-2 px-4 border-b">{registro.duracao_dias_uteis}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ListarRegistros;