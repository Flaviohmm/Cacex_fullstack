import React, { useState } from "react";
import axios from "axios";

const AddProcesso: React.FC<{ onProcessoAdded: () => void }> = ({ onProcessoAdded }) => {
    const [processo, setProcesso] = useState('');
    const [tipoAcao, setTipoAcao] = useState('');
    const [autor, setAutor] = useState('');
    const [reu, setReu] = useState('');
    const [status, setStatus] = useState('');
    const [dataAbertura, setDataAbertura] = useState('');
    const token = localStorage.getItem('authToken');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/processos/`, {
                processo,
                tipo_acao: tipoAcao,
                autor,
                reu,
                status,
                data_abertura: dataAbertura,
            });
            console.log('Processo adicionado:', response.data);
            // Limpar o formulário após o envio
        }
    }

    return (
        <form onSubmit={handleSubmit}>

        </form>
    );
};

export default AddProcesso;