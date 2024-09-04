import React from "react";
import Header from './Header';
import { useNavigate } from "react-router-dom";

const Welcome: React.FC = () => {
    const navigate = useNavigate()

    const goToTabelaCaixa = () => {
        navigate('/tabela_caixa')
    }

    const goToTabelaEstado = () => {
        navigate('/tabela_estado')
    }

    const goToTabelaFnde = () => {
        navigate('/tabela_fnde')
    }

    const goToTabelaSimec = () => {
        navigate('/tabela_simec')
    }

    const goToTabelaFns = () => {
        navigate('/tabela_fns')
    }

    const goToTabelaEntidade = () => {
        navigate('/tabela_entidade')
    }

    const goToTabelaPrevidencia = () => {
        navigate('/listar_previdencia')
    }

    const goToTabelaAdministrativa = () => {
        navigate('/listar_tabela_administrativa')
    }

    const goToTabelaFgts = () => {
        navigate('/listar_fgts')
    }

    const goToTabelaIndividualizacao = () => {
        navigate('/listar_individualizacao_fgts')
    }

    const goToTabelaReceitaFederal = () => {
        navigate('/listar_receita_federal')
    }

    const goToTabelaContabilidade = () => {
        navigate('/listar_balanco')
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex justify-center items-center p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaCaixa}>CAIXA</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaEstado}>ESTADO</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaFnde}>FNDE</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaSimec}>SIMEC</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaFns}>FNS</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaEntidade}>ENTIDADE</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaPrevidencia}>PREVIDÊNCIA</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaFgts}>FGTS</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaReceitaFederal}>RECEITA FEDERAL</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaAdministrativa}>ADMINISTRAÇÃO</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaContabilidade}>CONTABILIDADE</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaIndividualizacao}>INDIVIDUALIZAÇÃO</button>
                </div>
            </main>         
        </div>
    );
};

export default Welcome;