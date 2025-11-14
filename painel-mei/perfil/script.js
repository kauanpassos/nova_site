/*
 * Arquivo: script.js (da Pasta perfil)
 * Descrição: Controla o formulário de perfil com localStorage.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Seu código 100% funcional
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
        // 'photoContainer' não é mais necessário para o clique
        photoInput: document.getElementById('photoInput'),
        profilePic: document.getElementById('profilePic'),
        editButton: document.getElementById('editButton'),
        editModal: document.getElementById('editModal'),
        editForm: document.getElementById('editForm'),
        saveButton: document.getElementById('saveButton'),
        cancelButton: document.getElementById('cancelButton'),
        resetButton: document.getElementById('resetButton'),
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
    function loadState(){ try{ const raw=localStorage.getItem(storageKey); return raw?{...defaultState,...JSON.parse(raw)}:{...defaultState}; }catch(e){return{...defaultState}}}
    function saveState(state){ try{ localStorage.setItem(storageKey,JSON.stringify(state)); }catch(e){} }
    function render(s){ el.nameDisplay.textContent=s.name||'—'; el.usernameDisplay.textContent=s.username||''; el.metaDisplay.textContent=s.meta||'—'; el.lojaDisplay.textContent=s.loja||'—'; el.sobreDisplay.textContent=s.sobre||'—'; el.whatsDisplay.textContent=s.whatsapp||'—'; el.instaDisplay.textContent=s.instagram||'—'; el.faceDisplay.textContent=s.facebook||'—'; el.profilePic.src=s.photoDataUrl||'https://via.placeholder.com/300x300.png?text=Foto'; }
    function fillForm(s){ for(let k in el.inputs){ el.inputs[k].value=s[k]||''; } }
    let currentState=loadState(); render(currentState);
    el.editButton.onclick=()=>{ fillForm(currentState); el.editModal.classList.add('active'); }
    el.cancelButton.onclick=()=>{ el.editModal.classList.remove('active'); }
    el.saveButton.onclick=()=>{
        const newState={...currentState};
        for(let k in el.inputs){ newState[k]=el.inputs[k].value.trim(); }
        currentState=newState; render(currentState); saveState(currentState);
        el.editModal.classList.remove('active');
        el.notification.classList.add('show');
        setTimeout(()=>el.notification.classList.remove('show'),1500);
    };
    el.resetButton.onclick=()=>{ if(confirm('Tem certeza que deseja apagar todos os dados do perfil?')){ localStorage.removeItem(storageKey); currentState={...defaultState}; render(currentState);} };
    
    // CORREÇÃO DE ACESSIBILIDADE:
    // A linha abaixo foi removida pois o <label> no HTML cuida disso
    // el.photoContainer.addEventListener('click',()=>el.photoInput.click());

    el.photoInput.addEventListener('change',ev=>{ const file=ev.target.files&&ev.target.files[0]; if(!file)return; if(!file.type.startsWith('image/')){alert('Selecione um arquivo de imagem válido.');return;} const reader=new FileReader(); reader.onload=e=>{ const dataUrl=e.target.result; el.profilePic.src=dataUrl; currentState.photoDataUrl=dataUrl; saveState(currentState); }; reader.readAsDataURL(file); });

    console.log("Script de Perfil (perfil/script.js) carregado!");
});