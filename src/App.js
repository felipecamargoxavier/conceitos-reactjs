import React, { useState, useEffect} from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  function handleAddRepository() {
    api.post('/repositories', {
      title: `teste repositorio ${Date.now()}`,
      url: "teste.com.br",
      techs: [1,2,3,4]
    }).then(response => {
      setRepositories([...repositories, response.data]);
    });
  }

  async function handleRemoveRepository(id) {
    try {
      const response = await api.delete(`/repositories/${id}`);

      if(response.status === 204) {
        var newRepositories = [...repositories];
        const indexRepository = newRepositories.findIndex(respository => respository.id === id);
        newRepositories.splice(indexRepository, 1);
        setRepositories(newRepositories);
      }

    } catch(err) {
      alert('Nao foi possivel deletar o repositorio');
      console.log(err);
    }
  }

  async function handleLikeRepository(id) {

    try {
      const response = await api.post(`/repositories/${id}/like`);

      var newRepositories = [...repositories];
      const indexRepository = newRepositories.findIndex(respository => respository.id === id);

      newRepositories[indexRepository].likes = response.data.likes;
      setRepositories(newRepositories);
    } catch(err) {
      alert('Nao foi possivel dar like no repositorio');
      console.log(err);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
            <button  onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
            <button onClick={() => handleLikeRepository(repository.id)}>
              Like: {repository.likes}
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
