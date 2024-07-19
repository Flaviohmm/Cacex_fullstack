import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
      <h1>Registros Anexados</h1>
      <ul>
        {registrosAnexados.map((registro: any) => (
          <li key={registro.id}>
            <p>Nome: {registro.nome}</p>
            <p>Órgão/Setor: {registro.orgao_setor}</p>
            <p>Município: {registro.municipio}</p>
            <p>Atividade: {registro.atividade}</p>
            <p>Número do Convênio: {registro.num_convenio}</p>
            <p>Parlamentar: {registro.parlamentar}</p>
            <p>Objeto: {registro.objeto}</p>
            <p>OGE/OGU: {registro.oge_ogu}</p>
            <p>CP Prefeitura: {registro.cp_prefeitura}</p>
            <p>Valor Total: {registro.valor_total}</p>
            <p>Valor Liberado: {registro.valor_liberado}</p>
            <p>Falta Liberar: {registro.falta_liberar}</p>
            <p>Prazo Vigência: {registro.prazo_vigencia}</p>
            <p>Situação: {registro.situacao}</p>
            <p>Providência: {registro.providencia}</p>
            <p>Status: {registro.status}</p>
            <p>Data de Recepção: {registro.data_recepcao}</p>
            <p>Data de Início: {registro.data_inicio}</p>
            <p>Data de Fim: {registro.data_fim}</p>
            <p>Duração (dias úteis): {registro.duracao_dias_uteis}</p>
            <p>Documento Pendente: {registro.documento_pendente ? 'Sim' : 'Não'}</p>
            <p>Documento Cancelado: {registro.documento_cancelado ? 'Sim' : 'Não'}</p>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Anexados;