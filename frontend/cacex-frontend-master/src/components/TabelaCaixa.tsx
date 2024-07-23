import React, { useEffect, useState } from "react";
import Header from "./Header";

interface Registro {
    id: number;
    municipio: {
        id: number;
        municipio: string;
    };
}

const TabelaCaixa: React.FC = () => {
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:8000/tabela_caixa/', {
                headers: {
                    'Authorization': `Token ${token}`
                },
            });
            const data = await response.json();
            setRegistros(data.registros);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>

    // Criando um conjunto para restrear os municípios já exibidos
    const municipiosExibidos = new Set<number>();

    return (
        <div>
            <Header />
            <div className="container mx-auto p-5">
                <h2 className="text-blue-700 text-2xl mb-5 font-bold">CAIXA</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {registros.map((registro) => {
                        const municipioId = registro.municipio.id;

                        // Se o município já foi exibido, não renderize novamente
                        if (municipiosExibidos.has(municipioId)) {
                            return null; // Skip duplicated municipios
                        }

                        // Adicione o ID do município ao conjunto
                        municipiosExibidos.add(municipioId);

                        return (
                            <a
                                key={registro.id}
                                href={`http://localhost:8000/selecionar_municipio/${registro.municipio.id}`}
                                className="block rounded-lg bg-blue-700 text-white font-bold text-center p-6 hover:bg-blue-500 transition"
                            >
                                {registro.municipio.municipio}
                            </a>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default TabelaCaixa;