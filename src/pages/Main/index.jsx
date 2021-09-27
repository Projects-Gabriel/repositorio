import React, {useCallback, useEffect, useState} from 'react';
import {Container, Form, SubmitButton, List, DeleteButton} from './main.js';
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';


import api from '../../services/api';

export default function Main() {

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [alert, setAlert] = useState(null);
    const[loading, setLoading] = useState(false);

    //buscar
    useEffect(() => {
        const repoStore = localStorage.getItem('repos');
        if(repoStore) {
            setRepositorios(JSON.parse(repoStore));
        }
    },[])

    //Salvar alterações
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios))
    }, [repositorios])


    function handleInputChange(e){
        setNewRepo(e.target.value);
        setAlert(null)
    }

    const handleSubmit = useCallback((e) => {
        
        e.preventDefault();

        async function submit(){
            setLoading(true);
            try {
                
                if(newRepo === '') {
                    throw new Error('Você precisa indicar um novo reposositorio');
                }
                const response = await api.get(`repos/${newRepo}`);

                const hasRepo = repositorios.find(repo => repo.name === newRepo);

                if (hasRepo) {
                    throw new Error('Repositorio duplicado');
                }

                const data = {
                    name: response.data.full_name,
                }
            
                setRepositorios([...repositorios, data]);
                setNewRepo('');

            } catch(error) {

                setAlert(true)
                toast.warning(error);

            }finally {

                setLoading(false);

            }
            
        }

        submit();

    }, [newRepo,repositorios]);


    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [repositorios])
    
    return( 
        <Container>
            <h1>
                <FaGithub size={25} />
                Main
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>

                <input type="text" placeholder="Adicionar Repositorios" value={newRepo} onChange={handleInputChange}/>

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14}/>
                    ) : 
                        <FaPlus color="#FFF" size={14} />

                    }
                </SubmitButton>

            </Form>

            <List>
                {repositorios.map((repo) => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14}/>
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}><FaBars size={20} /></Link>
                    </li>
                ))}
            </List>

        </Container>
    )
}