import React from "react";
import AdicionarSetor from "./AdicionarSetor";
import AdicionarMunicipio from "./AdicionarMunicipio";
import AdicionarAtividade from "./AdicionarAtividade";
import Header from "./Header";

const AdicionarDados: React.FC = () => {
    return (
        <div>
            <Header />
            <div className="p-8">
                <h1 className="text-4xl font-bold mb-4">Adicionar Dados</h1>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2">Adicionar Setor</h2>
                    <AdicionarSetor />
                </div>

                <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2">Adicionar Município</h2>
                    <AdicionarMunicipio />
                </div>

                <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2">Adicionar Atividade</h2>
                    <AdicionarAtividade />
                </div>
            </div>
        </div>
    );
};

export default AdicionarDados;