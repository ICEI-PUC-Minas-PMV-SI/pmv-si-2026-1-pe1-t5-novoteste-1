/* js/main.js */

        /**
         * COMENTÁRIOS EXPLICATIVOS SOBRE LocalStorage
         * 
         * O LocalStorage é um recurso do navegador que permite armazenar dados de forma persistente
         * no computador do usuário. Os dados ficam salvos mesmo após fechar o navegador ou reiniciar
         * o computador. Ele funciona como um pequeno banco de dados local, ideal para pequenas aplicações.
         * 
         * Como usar:
         * - localStorage.setItem('chave', 'valor') -> Salva um dado com uma chave.
         * - localStorage.getItem('chave') -> Recupera o dado associado à chave.
         * - localStorage.removeItem('chave') -> Remove o dado da chave.
         * - localStorage.clear() -> Remove todos os dados.
         * 
         * ATENÇÃO: O LocalStorage armazena apenas strings. Para salvar objetos, precisamos
         * converter para JSON usando JSON.stringify() e para ler usamos JSON.parse().
         * 
         * Exemplo:
         *   const usuario = { nome: 'João', email: 'joao@email.com' };
         *   localStorage.setItem('usuario', JSON.stringify(usuario));
         *   const usuarioLido = JSON.parse(localStorage.getItem('usuario'));
         */

        // Elementos do DOM
        const form = document.getElementById('userForm');
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const telefoneInput = document.getElementById('telefone');
        const erroDiv = document.getElementById('erro');
        const tabelaUsuarios = document.getElementById('tabelaUsuarios');

        // Função para carregar os usuários do LocalStorage
        function carregarUsuarios() {
            // Tenta obter a string armazenada. Se não existir, retorna um array vazio.
            const dados = localStorage.getItem('usuarios');
            // Converte a string JSON de volta para array (ou array vazio se null)
            return dados ? JSON.parse(dados) : [];
        }

        // Função para salvar a lista de usuários no LocalStorage
        function salvarUsuarios(usuarios) {
            // Converte o array de objetos para string JSON e armazena
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        // Função para renderizar a tabela com os usuários
        function renderizarTabela() {
            const usuarios = carregarUsuarios();
            tabelaUsuarios.innerHTML = ''; // Limpa a tabela
            usuarios.forEach((usuario, index) => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>
                        <button class="delete-btn" onclick="excluirUsuario(${index})">Excluir</button>
                    </td>
                `;
                tabelaUsuarios.appendChild(linha);
            });
        }

        // Função para adicionar um novo usuário
        function adicionarUsuario(event) {
            event.preventDefault(); // Evita o recarregamento da página
            erroDiv.textContent = ''; // Limpa mensagens de erro anteriores

            // Validação dos campos
            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            const telefone = telefoneInput.value.trim();

            if (!nome) {
                erroDiv.textContent = 'O nome é obrigatório.';
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                erroDiv.textContent = 'Informe um e-mail válido.';
                return;
            }
            if (!/^\d{11}$/.test(telefone)) {
                erroDiv.textContent = 'O telefone deve ter exatamente 11 dígitos (incluindo DDD).';
                return;
            }

            // Cria objeto do usuário
            const novoUsuario = { nome, email, telefone };

            // Carrega usuários existentes, adiciona o novo e salva
            const usuarios = carregarUsuarios();
            usuarios.push(novoUsuario);
            salvarUsuarios(usuarios);

            // Atualiza a tabela e limpa o formulário
            renderizarTabela();
            form.reset();
        }

        // Função para excluir um usuário pelo índice
        function excluirUsuario(indice) {
            const usuarios = carregarUsuarios();
            usuarios.splice(indice, 1); // Remove o elemento na posição 'indice'
            salvarUsuarios(usuarios);
            renderizarTabela();
        }

        // Torna a função global para ser chamada pelo onclick
        window.excluirUsuario = excluirUsuario;

        // Adiciona evento de submit no formulário
        form.addEventListener('submit', adicionarUsuario);

        // Carrega a tabela ao iniciar a página
        renderizarTabela();
