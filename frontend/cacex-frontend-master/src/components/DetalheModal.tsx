import React from "react";
import { NumericFormat } from "react-number-format";

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

interface DetalheModalProps {
    registro: Registro;
    isOpen: any;
    onClose: any;
}

const DetalheModal: React.FC<DetalheModalProps> = ({registro, isOpen, onClose}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white p-10 rounded shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                <div className=" flex justify-between items-center pb-3 border-b">
                    <h3 className="text-lg font-bold">Detalhes do Registro</h3>
                    <button className="text-black cursor-pointer" onClick={onClose}>x</button>
                </div>
                <div className="mt-4 space-y-2">
                    <p><strong>Nome:</strong> {registro.nome}</p>
                    <p><strong>Orgão/Setor:</strong> {registro.orgao_setor}</p>
                    <p><strong>Município:</strong> {registro.municipio}</p>
                    <p><strong>Atividade:</strong> {registro.atividade}</p>
                    <p><strong>N° do Convênio:</strong> {registro.num_convenio}</p>
                    <p><strong>Parlamentar:</strong> {registro.parlamentar}</p>
                    <p><strong>Objeto:</strong> {registro.objeto}</p>
                    <p><strong>OGE/OGU:</strong>  
                        <NumericFormat
                            value={registro.oge_ogu}
                            displayType={'text'}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            prefix={' R$ '}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </p>
                    <p><strong>CP Prefeitura:</strong> 
                        <NumericFormat
                            value={registro.cp_prefeitura}
                            displayType={'text'}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            prefix={' R$ '}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </p>
                    <p><strong>Valor Total:</strong> 
                        <NumericFormat
                            value={registro.valor_total}
                            displayType={'text'}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            prefix={' R$ '}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </p>
                    <p><strong>Valor Liberado:</strong> 
                        <NumericFormat
                            value={registro.valor_liberado}
                            displayType={'text'}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            prefix={' R$ '}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </p>
                    <p><strong>Falta Liberar:</strong> 
                        <NumericFormat
                            value={registro.falta_liberar}
                            displayType={'text'}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            prefix={' R$ '}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </p>
                    <p><strong>Prazo de Vigência:</strong> {registro.prazo_vigencia}</p>
                    <p><strong>Situação:</strong> {registro.situacao}</p>
                    <p><strong>Providência:</strong> {registro.providencia}</p>
                    <p><strong>Status:</strong> {registro.status}</p>
                    <p><strong>Data de Recepção:</strong> {registro.data_recepcao}</p>
                    <p><strong>Data de Inicio</strong> {registro.data_inicio}</p>
                    <p><strong>Documento Pendente:</strong> {registro.documento_pendente}</p>
                    <p><strong>Documento Cancelado:</strong> {registro.documento_cancelado}</p>
                    <p><strong>Data do Fim:</strong> {registro.data_fim}</p>
                    <p><strong>Duração de Dias Úteis:</strong> {registro.duracao_dias_uteis}</p>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button>Editar</button>
                </div>
            </div>
        </div>
    )
}

export default DetalheModal;