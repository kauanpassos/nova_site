/*
 * Arquivo: script.js (da Pasta login)
 * DESCRIÇÃO: Lógica de Autenticação e Alternância de Telas (SPA).
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* <----- Inicio da Alternância de Telas (Login <-> Cadastro) -----> */
    const cardLogin = document.getElementById("card-login");
    const cardCadastro = document.getElementById("card-cadastro");
    const linkIrCadastro = document.getElementById("link-ir-cadastro");
    const linkIrLogin = document.getElementById("link-ir-login");

    if (linkIrCadastro && linkIrLogin) {
        // Clicou em "Criar agora" -> Some login, Aparece cadastro
        linkIrCadastro.addEventListener("click", (e) => {
            e.preventDefault();
            cardLogin.classList.add("oculto");
            cardCadastro.classList.remove("oculto");
        });

        // Clicou em "Fazer Login" -> Some cadastro, Aparece login
        linkIrLogin.addEventListener("click", (e) => {
            e.preventDefault();
            cardCadastro.classList.add("oculto");
            cardLogin.classList.remove("oculto");
        });
    }
    /* <-----aqui termina a Alternância de Telas-----> */


    /* <----- Inicio da Lógica de Cadastro -----> */
    const formCadastro = document.getElementById("form-cadastro");
    
    if (formCadastro) {
        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("reg-email").value;
            const senha = document.getElementById("reg-senha").value;
            const confirma = document.getElementById("reg-senha-confirm").value;

            if (senha.length < 6) {
                alert("A senha precisa ter pelo menos 6 caracteres.");
                return;
            }

            if (senha !== confirma) {
                alert("As senhas não coincidem.");
                return;
            }

            const usuario = { email, senha };
            localStorage.setItem("nova_user_db", JSON.stringify(usuario));
            
            alert("Conta criada com sucesso! Faça login para continuar.");
            
            // Redireciona automaticamente para a tela de login (apenas trocando a div)
            cardCadastro.classList.add("oculto");
            cardLogin.classList.remove("oculto");
            
            // Limpa o form
            formCadastro.reset();
        });
    }
    /* <-----aqui termina a Lógica de Cadastro-----> */


    /* <----- Inicio da Lógica de Login -----> */
    const formLogin = document.getElementById("form-login");

    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const senha = document.getElementById("login-senha").value;

            const usuarioSalvoJSON = localStorage.getItem("nova_user_db");
            const usuarioSalvo = usuarioSalvoJSON ? JSON.parse(usuarioSalvoJSON) : null;

            if (usuarioSalvo && usuarioSalvo.email === email && usuarioSalvo.senha === senha) {
                localStorage.setItem("nova_session_token", "ativo");
                window.location.href = "../inicio/index.html";
            } else {
                alert("E-mail ou senha incorretos.");
            }
        });
    }
    /* <-----aqui termina a Lógica de Login-----> */
});