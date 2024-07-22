import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import Header from './Header';

axios.defaults.withCredentials = true;

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

const Anexados: React.FC = () => {
  const [registrosAnexados, setRegistrosAnexados] = useState<Registro[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const token = localStorage.getItem('authToken');

  const fetchRegistros = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/mostrar_registros_anexados/", 
      );
      console.log("Dados recebidos:", response.data);
      setRegistrosAnexados(response.data.registros_anexados);
      console.log("Registros Anexados: ", registrosAnexados)
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
    }
  };

  const handleDesanexar = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/desanexar_registro/${registrosAnexados.map((registro: any) => registro.id)}/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": 'application/json',
          }
        }
      );
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Erro ao desanexar registro.");
    }
  }

  useEffect(() => {
    const getCsrfToken = async () => {
        try {
            const response = await axios.get("http://localhost:8000/csrf_token/", {
              withCredentials: true
            });
            setCsrfToken(response.data.csrfToken);
            axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
            await fetchRegistros();
        } catch (err) {
            console.error(err);
            alert("Erro ao obter o token CSRF.");
        }
    };

    getCsrfToken();
  }, []);

  return (
    <div>
      <Header />
      <div className="p-4">
        <h1 className='text-2xl font-bold mb-4'>Registros Anexados</h1>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white'>
            <thead>
            <th className="py-2 px-4 border-b text-left">Nome</th>
              <th className="py-2 px-4 border-b text-left">Órgão/Setor</th>
              <th className="py-2 px-4 border-b text-left">Município</th>
              <th className="py-2 px-4 border-b text-left">Atividade</th>
              <th className="py-2 px-4 border-b text-left">N° do Convênio</th>
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
              <th className="py-2 px-4 border-b text-center">Ação</th>
            </thead>
            <tbody>
              {registrosAnexados.map((registro: Registro) => (
                <tr key={registro.id} className='hover:bg-gray-100'>
                  <td className='py-4 px-2 border-b'>{registro.nome}</td>
                  <td className='py-4 px-2 border-b'>{registro.orgao_setor}</td>
                  <td className='py-4 px-2 border-b'>{registro.municipio}</td>
                  <td className='py-4 px-2 border-b'>{registro.atividade}</td>
                  <td className='py-4 px-2 border-b'>{registro.num_convenio}</td>
                  <td className='py-4 px-2 border-b'>{registro.parlamentar}</td>
                  <td className='py-4 px-2 border-b'>{registro.objeto}</td>
                  <td className='py-4 px-2 border-b'>
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
                  <td className='py-4 px-2 border-b'>
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
                  <td className='py-4 px-2 border-b'>
                    <NumericFormat
                      value={registro.valor_total}
                      displayType={'text'}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={'R$ '}
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  </td>
                  <td className='py-4 px-2 border-b'>
                    <NumericFormat
                      value={registro.valor_liberado}
                      displayType={'text'}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={'R$ '}
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  </td>
                  <td className='py-4 px-2 border-b'>
                    <NumericFormat
                      value={registro.falta_liberar}
                      displayType={'text'}
                      thousandSeparator={'.'}
                      decimalSeparator={','}
                      prefix={'R$ '}
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  </td>
                  <td className='py-4 px-2 border-b'>{registro.prazo_vigencia}</td>
                  <td className='py-4 px-2 border-b'>{registro.situacao}</td>
                  <td className='py-4 px-2 border-b'>{registro.providencia}</td>
                  <td className='py-4 px-2 border-b'>{registro.status}</td>
                  <td className='py-4 px-2 border-b'>{registro.data_recepcao}</td>
                  <td className='py-4 px-2 border-b'>{registro.data_inicio ? registro.data_inicio : 'Sem Data de Inicio'}</td>
                  <td className='py-4 px-2 border-b'>{registro.documento_pendente ? 'Sim' : 'Não'}</td>
                  <td className='py-4 px-2 border-b'>{registro.documento_cancelado ? 'Sim' : 'Não'}</td>
                  <td className='py-4 px-2 border-b'>{registro.data_fim ? registro.data_fim : 'Sem Data de Termino'}</td>
                  <td className='py-4 px-2 border-b'>{registro.duracao_dias_uteis}</td>
                  <td className='py-4 px-2 border-b'>
                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleDesanexar}>
                      Desanexar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      <ul>
      </ul>
      
    </div>
  );
};

export default Anexados;