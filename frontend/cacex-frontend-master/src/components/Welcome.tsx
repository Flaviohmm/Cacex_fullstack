import React from "react";
import Header from './Header';
import { useNavigate } from "react-router-dom";

const Welcome: React.FC = () => {
    const navigate = useNavigate()

    const goToTabelaCaixa = () => {
        navigate('/tabela_caixa')
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex justify-center items-center p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold" onClick={goToTabelaCaixa}>CAIXA</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">ESTADO</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">FNDE</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">SIMEC</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">FNS</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">ENTIDADE</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">PREVIDÊNCIA</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">FGTS</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">RECEITA FEDERAL</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">ADMINISTRAÇÃO</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">CONTABILIDADE</button>
                    <button className="bg-blue-700 text-white p-10 rounded-xl hover:bg-blue-500 font-bold">INDIVIDUALIZAÇÃO</button>
                </div>
            </main>         
        </div>
    );
};

export default Welcome;