import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { User, Setor } from "./models";
import Header from "./Header";

const EditUser: React.FC<{ userId: number }> = ({ userId }) => {
    const [user, setUser] = useState<User | null>(null);
    const [setores, setSetores] = useState<Setor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSetor, setSelectedSetor] = useState<number | string>(''); // ou '0' dependendo de como você quer fazer a escolha
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:8000/usuarios/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setUser(userResponse.data);
                setSelectedSetor(userResponse.data.setorId); // ou qualquer lógica para capturar o setor do usuário

                const setorResponse = await axios.get(`http://localhost:8000/listar_setores/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setSetores(setorResponse.data);
            } catch (error) {
                setError('Erro ao buscar dados do usuário.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedSetor(event.target.value as number);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8000/usuarios/`, {
                ...user,
                setorId: selectedSetor,
            });
            alert('Usuário atualizado com sucesso!');
        } catch (error) {
            setError('Erro ao atualizar o usuário');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Header />
            <h2>Editar Usuários</h2>
            <TextField
                label="Nome de Usuário"
                variant="outlined"
                value={user?.username || ''}
                onChange={(e) => setUser({ ...user!, username: e.target.value })}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel id="select-sector-label">Setor</InputLabel>
                <Select
                    labelId="select-sector-label"
                    value={selectedSetor}
                >
                    {setores.map((setor) => (
                        <MenuItem key={setor.id} value={setor.id}>
                            {setor.orgao_setor}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
                Atualizar
            </Button>
        </div>
    );
};

export default EditUser;