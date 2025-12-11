
document.addEventListener("DOMContentLoaded", () => {
    
    /* <----- Inicio da Inicialização de Elementos -----> */
    const defaultState = { name:'', username:'', meta:'', loja:'', sobre:'', whatsapp:'', instagram:'', facebook:'', photoDataUrl:'' };
    const storageKey = 'perfil_empreendedor_v2';
    const el = {
        nameDisplay: document.getElementById('nameDisplay'),
        usernameDisplay: document.getElementById('usernameDisplay'),
        metaDisplay: document.getElementById('metaDisplay'),
        lojaDisplay: document.getElementById('lojaDisplay'),
        sobreDisplay: document.getElementById('sobreDisplay'),
        whatsDisplay: document.getElementById('whatsDisplay'),
        instaDisplay: document.getElementById('instaDisplay'),
        faceDisplay: document.getElementById('faceDisplay'),
        photoInput: document.getElementById('photoInput'),
        profilePic: document.getElementById('profilePic'),
        editButton: document.getElementById('editButton'),
        editModal: document.getElementById('editModal'),
        editForm: document.getElementById('editForm'),
        saveButton: document.getElementById('saveButton'),
        cancelButton: document.getElementById('cancelButton'),
        notification: document.getElementById('notification'),
        inputs: {
            name: document.getElementById('editName'),
            username: document.getElementById('editUsername'),
            meta: document.getElementById('editMeta'),
            loja: document.getElementById('editLoja'),
            sobre: document.getElementById('editSobre'),
            whatsapp: document.getElementById('editWhats'),
            instagram: document.getElementById('editInsta'),
            facebook: document.getElementById('editFace')
        }
    };
    /* <-----aqui termina a Inicialização de Elementos-----> */

    /* <----- Inicio da Lógica de Estado -----> */
    function loadState(){ 
        try{ 
            const raw=localStorage.getItem(storageKey); 
            return raw?{...defaultState,...JSON.parse(raw)}:{...defaultState}; 
        }catch(e){return{...defaultState}}
    }
    
    function saveState(state){ 
        try{ 
            localStorage.setItem(storageKey,JSON.stringify(state)); 
            return true; 
        }catch(e){
            console.error(e);
            alert("Erro ao salvar. Verifique o tamanho da imagem.");
            return false; 
        } 
    }
    
    function render(s){ 
        el.nameDisplay.textContent=s.name||'—'; 
        el.usernameDisplay.textContent=s.username||''; 
        el.metaDisplay.textContent=s.meta||'—'; 
        el.lojaDisplay.textContent=s.loja||'—'; 
        el.sobreDisplay.textContent=s.sobre||'—'; 
        el.whatsDisplay.textContent=s.whatsapp||'—'; 
        el.instaDisplay.textContent=s.instagram||'—'; 
        el.faceDisplay.textContent=s.facebook||'—'; 
        el.profilePic.src=s.photoDataUrl||'https://via.placeholder.com/300x300.png?text=Foto'; 
    }
    
    function fillForm(s){ for(let k in el.inputs){ el.inputs[k].value=s[k]||''; } }
    /* <-----aqui termina a Lógica de Estado-----> */

    /* <----- Inicio dos Listeners e Ações -----> */
    let currentState=loadState(); 
    render(currentState);
    
    el.editButton.onclick=()=>{ fillForm(currentState); el.editModal.classList.add('active'); }
    el.cancelButton.onclick=()=>{ el.editModal.classList.remove('active'); }
    
    el.saveButton.onclick=()=>{
        const newState={...currentState};
        for(let k in el.inputs){ newState[k]=el.inputs[k].value.trim(); }
        if(saveState(newState)) {
            currentState=newState; 
            render(currentState);
            el.editModal.classList.remove('active');
            el.notification.classList.add('show');
            setTimeout(()=>el.notification.classList.remove('show'),1500);
        }
    };

    el.photoInput.addEventListener('change', ev => { 
        const file = ev.target.files && ev.target.files[0]; 
        if(!file) return; 
        if(file.size > 500 * 1024) { alert("Imagem muito grande (max 500KB)."); return; }
        const reader=new FileReader(); 
        reader.onload=e=>{ 
            const dataUrl=e.target.result; 
            el.profilePic.src=dataUrl; 
            currentState.photoDataUrl=dataUrl; 
            saveState(currentState); 
        }; 
        reader.readAsDataURL(file); 
    });
    /* <-----aqui termina os Listeners e Ações-----> */

    /* <----- Inicio da Lógica de Logout e Exclusão -----> */
    const btnLogout = document.getElementById('btn-logout');
    const btnDelete = document.getElementById('btn-delete-account');

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('nova_session_token');
            // CORREÇÃO: Caminho para a nova SPA de login
            window.location.href = '../login/index.html';
        });
    }

    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            // Usa o modal global injetado no appGLOBAL.js
            if (typeof mostrarConfirmacao === 'function') {
                mostrarConfirmacao("Isso apagará TODOS os seus dados (lançamentos, estoque, perfil). Tem certeza?", () => {
                    localStorage.clear();
                    alert("Conta excluída.");
                    window.location.href = '../login/index.html';
                });
            } else {
                // Fallback de segurança
                if(confirm("Isso apagará tudo. Continuar?")) {
                    localStorage.clear();
                    window.location.href = '../login/index.html';
                }
            }
        });
    }
    /* <-----aqui termina a Lógica de Logout e Exclusão-----> */

    console.log("Script de Perfil carregado.");
});