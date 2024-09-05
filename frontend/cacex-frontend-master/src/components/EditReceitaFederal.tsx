import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { NumericFormat } from "react-number-format";

interface Municipio {
    id: number;
    municipio: string;
}

const EditReceitaFederal: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [nome, setNome] = useState<string>('');
    const [valorTotal, setValorTotal] = useState<string>('');
    const [municipioId, setMunicipioId] = useState<number | undefined>(undefined);
    const [atividade, setAtividade] = useState<string>('');
    const [numParcelamento, setNumParcelamento] = useState<string>('');
    const [objeto, setObjeto] = useState<string>('');
    const [prazoVigencia, setPrazoVigencia] = useState<string>('');
    const [situacao, setSituacao] = useState<string>('');
    const [providencia, setProvidencia] = useState<string>('');
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    const parseCurrency = (valor: string): number => {
        const numero = valor
            .replace('R$', '')
            .replace(/\s/g, '')
            .replace('.', '')
            .replace(',', '.')
        return parseFloat(numero);
    };

    const formatCurrency = (valor: number) => {
        return `R$ ${valor.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).replace('.', ',')}`;
    };

    useEffect(() => {
        // Carregar os dados da Receita Federal ao montar o componente
        const fetchReceita = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/receita_federal/${id}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                // Atualiza os estudos usando os dados recebidos
                setNome(response.data.nome);
                setValorTotal(formatCurrency(response.data.valor_total));
                setMunicipioId(response.data.municipio.id);
                setAtividade(response.data.atividade);
                setNumParcelamento(response.data.num_parcelamento);
                setObjeto(response.data.objeto);
                setPrazoVigencia(response.data.prazo_vigencia.split('T')[0]);
                setSituacao(response.data.situacao);
                setProvidencia(response.data.providencia);
            } catch (error) {
                console.error("Erro ao carregar receita federal:", error);
            }
        };

        const fetchMunicipios = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/municipios/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                });
                setMunicipios(response.data);
            } catch (error) {
                console.error("Erro ao buscar municípios:", error);
                alert('Erro ao buscar municípios');
            }
        };

        fetchReceita();
        fetchMunicipios();
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Transformar o valor total para número
        const valorNumerico = parseCurrency(valorTotal);

        if (isNaN(valorNumerico)) {
            alert("Por favor, insira um valor válido.");
            return;
        }

        try {
            await axios.put(`http://localhost:8000/receita_federal/${id}/`, {
                nome,
                valor_total: valorNumerico,
                municipio: municipioId,
                atividade,
                num_parcelamento: numParcelamento,
                objeto,
                prazo_vigencia: prazoVigencia,
                situacao,
                providencia,
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            navigate('/listar_receita_federal'); // Redireciona após edição
        } catch (error) {
            console.error("Erro ao atualizar receita federal:", error);
        }
    };

    return (
        <div>
            <Header />
            <h2 className="text-2xl font-bold mb-6 text-center mt-5">Editar Receita Federal</h2>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Nome:</label>
                    <input
                        type="text"
                        placeholder="Nome da Receita Federal"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Município:</label>
                    <select
                        value={municipioId}
                        onChange={(e) => setMunicipioId(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    >
                        {municipios.map((municipio) => (
                            <option key={municipio.id} value={municipio.id}>
                                {municipio.municipio}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Atividade:</label>
                    <input
                        type="text"
                        value={atividade}
                        onChange={(e) => setAtividade(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">N° de Parcelamento:</label>
                    <input
                        type="text"
                        value={numParcelamento}
                        onChange={(e) => setNumParcelamento(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Objeto:</label>
                    <input
                        type="text"
                        value={objeto}
                        onChange={(e) => setObjeto(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Valor Total:</label>
                    <NumericFormat
                        value={parseCurrency(valorTotal)}
                        onChange={(e) => setValorTotal(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale={true}
                        placeholder="Valor da Receita"
                        required
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Prazo de Vigência:</label>
                    <input
                        type="date"
                        value={prazoVigencia}
                        onChange={(e) => setPrazoVigencia(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Situação:</label>
                    <input
                        type="text"
                        value={situacao}
                        onChange={(e) => setSituacao(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-base font-bold mb-2 mt-5">Providência:</label>
                    <input
                        type="text"
                        value={providencia}
                        onChange={(e) => setProvidencia(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 mt-5">
                    Atualizar
                </button>
            </form>
            <br />
        </div>
    );
};

export default EditReceitaFederal;