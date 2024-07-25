import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Header from "./Header";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

// Registrar as escalas e elementos necessários
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/dashboard_data', {
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                });
                setDashboardData(response.data);
            } catch (error) {
                console.error("Erro ao carregar os dados do dashboard", error)
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [])

    if (loading) {
        return <div>Carregando...</div>
    }

    // Dados para os gráficos
    const geralChartData = {
        labels: dashboardData.demanda_geral.map((item: any) => item.orgao_setor__orgao_setor),
        datasets: [
            {
                label: 'Demanda Geral',
                data: dashboardData.demanda_geral.map((item: any) => item.total),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const atividadeChartData = {
        labels: dashboardData.demanda_por_atividade.map((item: any) => item.atividade__atividade),
        datasets: [
            {
                label: 'Demanda por Atividade',
                data: dashboardData.demanda_por_atividade.map((item: any) => item.total),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    return (
        <div>
            <Header />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Painel</h1>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold">Total de Atividades: {dashboardData.total_atividades}</h2>
                    </div>
                    <div className="bg-green-300 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold">Concluídas: {dashboardData.atividades_concluidas}</h2>
                    </div>
                    <div className="bg-red-300 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold">Pendência: {dashboardData.atividades_com_pendencia}</h2>
                    </div>
                    <div className="bg-yellow-300 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold">Em Análise: {dashboardData.atividades_em_analise}</h2>
                    </div>
                    <div className="bg-blue-300 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold">Não Iniciadas: {dashboardData.atividades_nao_iniciadas}</h2>
                    </div>
                    <div className="bg-gray-300 rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold">Suspensas: {dashboardData.atividades_suspensas}</h2>
                    </div>
                </div>
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2">Demanda Geral</h3>
                    <div className="w-4/5 h-3/5 ml-8" >
                        <Bar data={geralChartData} key={JSON.stringify(geralChartData)}/>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Demanda por Atividade</h3>
                    <div className="w-4/5 h-3/5 ml-8">
                        <Bar data={atividadeChartData} key={JSON.stringify(atividadeChartData)}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;