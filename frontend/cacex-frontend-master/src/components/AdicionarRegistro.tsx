import React, { useState } from 'react';
import axios from 'axios';

const AdicionarRegistro: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        orgao_setor: '',
        municipio: '',
        atividade: '',
        num_convenio: '',
        parlamentar: '',
        objeto: '',
        oge_ogu: '',
        cp_prefeitura: '',
        valor_liberado: '',
        prazo_vigencia: '',
        situacao: '',
        providencia: '',
        data_recepcao: '',
        data_inicio: '',
        documento_pendente: false,
        documento_cancelado: false,
        data_fim: '',
    });

    // Definindo o tipo de evento apropriado para a função de handleChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type } = e.target;
        const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Envie os dados para o servidor
        axios.post('http://localhost:8000/adicionar_registro/', formData)
            .then(response => {
                console.log(response.data);
                alert('Registro adicionado com sucesso');
            })
            .catch(error => {
                console.error('Houve um erro ao adicionar o registro:', error);
                alert(`Erro ao adicionar registro: ${error.response?.data?.error ?? error.message}`);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nome:</label>
                <select name="id" value={formData.username} onChange={handleChange} required>
                    <option value="">Selecione um usuário</option>
                    <option value={formData.username}>{formData.username}</option>
                </select>
            </div>

            <div>
                <label>Órgão Setor:</label>
                <input type="text" name="orgao_setor" value={formData.orgao_setor} onChange={handleChange} />
            </div>

            <div>
                <label>Município:</label>
                <input type="text" name="municipio" value={formData.municipio} onChange={handleChange} />
            </div>

            <div>
                <label>Atividade:</label>
                <input type="text" name="atividade" value={formData.atividade} onChange={handleChange} />
            </div>

            <div>
                <label>Num Convênio:</label>
                <input type="text" name="num_convenio" value={formData.num_convenio} onChange={handleChange} />
            </div>

            <div>
                <label>Parlamentar:</label>
                <input type="text" name="parlamentar" value={formData.parlamentar} onChange={handleChange} />
            </div>

            <div>
                <label>Objeto:</label>
                <input type="text" name="objeto" value={formData.objeto} onChange={handleChange} />
            </div>

            <div>
                <label>OGE/OGU:</label>
                <input type="text" name="oge_ogu" value={formData.oge_ogu} onChange={handleChange} />
            </div>

            <div>
                <label>CP Prefeitura:</label>
                <input type="text" name="cp_prefeitura" value={formData.cp_prefeitura} onChange={handleChange} />
            </div>

            <div>
                <label>Valor Liberado:</label>
                <input type="text" name="valor_liberado" value={formData.valor_liberado} onChange={handleChange} />
            </div>

            <div>
                <label>Prazo Vigência:</label>
                <input type="date" name="prazo_vigencia" value={formData.prazo_vigencia} onChange={handleChange} />
            </div>

            <div>
                <label>Situação:</label>
                <input type="text" name="situacao" value={formData.situacao} onChange={handleChange} />
            </div>

            <div>
                <label>Providência:</label>
                <input type="text" name="providencia" value={formData.providencia} onChange={handleChange} />
            </div>

            <div>
                <label>Data de Recepção:</label>
                <input type="date" name="data_recepcao" value={formData.data_recepcao} onChange={handleChange} />
            </div>

            <div>
                <label>Data de Início:</label>
                <input type="date" name="data_inicio" value={formData.data_inicio} onChange={handleChange} />
            </div>

            <div>
                <label>Documento Pendente:</label>
                <input type="checkbox" name="documento_pendente" checked={formData.documento_pendente} onChange={handleChange} />
            </div>

            <div>
                <label>Documento Cancelado:</label>
                <input type="checkbox" name="documento_cancelado" checked={formData.documento_cancelado} onChange={handleChange} />
            </div>

            <div>
                <label>Data de Fim:</label>
                <input type="date" name="data_fim" value={formData.data_fim} onChange={handleChange} />
            </div>

            <div>
                <button type="submit">Adicionar Registro</button>
            </div>
        </form>
    );
};

export default AdicionarRegistro;