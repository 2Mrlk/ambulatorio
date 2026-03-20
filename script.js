/* =========================================
   NAVEGAÇÃO E LOGIN BASE
========================================= */

function doLogin(event) {
    event.preventDefault(); // Evita o form de recarregar a página
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    authContainer.style.opacity = '0';
    setTimeout(() => {
        authContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        dashboardContainer.style.opacity = '0';
        
        setTimeout(() => {
            dashboardContainer.style.opacity = '1';
        }, 50);
    }, 300);
}

function doLogout() {
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    dashboardContainer.style.opacity = '0';
    setTimeout(() => {
        dashboardContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
        authContainer.style.opacity = '1';
        
        const homeTab = document.querySelector('.menu li:first-child');
        if(homeTab) switchTab('home', homeTab);
    }, 300);
}

function switchTab(tabId, element) {
    const menuItems = document.querySelectorAll('.menu li');
    menuItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    const views = document.querySelectorAll('.view-section');
    views.forEach(view => view.classList.add('hidden'));

    const activeView = document.getElementById('view-' + tabId);
    if (activeView) {
        activeView.classList.remove('hidden');
        activeView.style.opacity = '0';
        activeView.style.transform = 'translateY(15px)';
        
        setTimeout(() => {
            activeView.style.transition = 'all 0.4s ease';
            activeView.style.opacity = '1';
            activeView.style.transform = 'translateY(0)';
        }, 10);
    }
}

function switchAuth(type) {
    // 1. Pega os elementos
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const btns = document.querySelectorAll('.toggle-btn');
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');

    // 2. Controla a exibição (Força o block ou none)
    if (type === 'login') {
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
        
        if(btns.length > 0) {
            btns[0].classList.add('active');
            btns[1].classList.remove('active');
        }
        
        if(title) title.innerText = 'Bem-vindo(a)';
        if(subtitle) subtitle.innerText = 'Aceda ao seu portal';
    } else {
        formLogin.style.display = 'none';
        formRegister.style.display = 'block';
        
        if(btns.length > 0) {
            btns[0].classList.remove('active');
            btns[1].classList.add('active');
        }
        
        if(title) title.innerText = 'Criar Conta';
        if(subtitle) subtitle.innerText = 'Registe-se para aceder';
    }
}

/* =========================================
   SISTEMA DE MODAL E NOTIFICAÇÃO
========================================= */

function openModal(contentHtml) {
    const modal = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    
    // Injeta o HTML dentro do corpo da modal
    if(modalBody) {
        modalBody.innerHTML = contentHtml;
    }
    
    modal.classList.remove('hidden');
    setTimeout(() => modal.style.opacity = '1', 10);
}

function closeModal(event) {
    // Permite fechar clicando no fundo escuro ou no botão de fechar
    if (event && event.target.id !== 'modal-overlay' && !event.target.classList.contains('close-modal') && !event.target.closest('.close-modal')) {
        return; 
    }
    const modal = document.getElementById('modal-overlay');
    if(modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

function showNotification(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-gold); margin-right: 8px;"></i> ${message}`;
    toast.className = 'show';
    
    setTimeout(() => { 
        toast.className = toast.className.replace('show', ''); 
    }, 3500);
}

/* =========================================
   FUNÇÕES DA TELA HOME
========================================= */

function confirmAppointment() {
    const btnConfirm = document.getElementById('btn-confirm');
    const btnReschedule = document.getElementById('btn-reschedule');
    const badge = document.getElementById('appointment-badge');

    if(btnConfirm) {
        btnConfirm.innerHTML = '<i class="fas fa-check"></i> Presença Confirmada';
        btnConfirm.style.backgroundColor = 'var(--success-green)';
        btnConfirm.disabled = true;
        btnConfirm.style.cursor = 'default';
    }

    if(btnReschedule) btnReschedule.style.display = 'none';

    if(badge) {
        badge.innerText = 'STATUS: CONFIRMADO';
        badge.style.backgroundColor = '#d1fae5';
        badge.style.color = '#065f46';
    }

    showNotification('Sua presença foi confirmada com sucesso!');
}

function rescheduleAppointment() {
    openModal(`
        <h2 style="color: var(--primary-dark); margin-bottom: 10px;">Reagendar Consulta</h2>
        <p style="color: var(--text-gray); margin-bottom: 20px; font-size: 0.9rem;">Escolha uma nova data para sua consulta.</p>
        
        <label style="font-size: 0.85rem; color: var(--text-gray); font-weight: bold;">Nova Data:</label>
        <input type="date" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; margin-top: 5px; margin-bottom: 20px; font-family: inherit;">
        
        <button class="btn-gold-solid btn-full" onclick="confirmReschedule()">Solicitar Nova Data</button>
    `);
}

function confirmReschedule() {
    closeModal();
    showNotification('Solicitação de reagendamento enviada à secretaria.');
}

function quickAction(actionType) {
    if (actionType === 'receitas' || actionType === 'atestados' || actionType === 'exames') {
        const recordsMenu = document.querySelectorAll('.menu li')[4];
        if(recordsMenu) switchTab('records', recordsMenu);
        showNotification(`Exibindo a área de ${actionType} no seu prontuário.`);
    } 
    else if (actionType === 'carteirinha') {
        openModal(`
            <div style="text-align: center;">
                <h2 style="color: var(--primary-dark); margin-bottom: 10px;">Identificação Acadêmica</h2>
                <div style="background: linear-gradient(135deg, var(--primary-dark), #1a365d); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: left; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <i class="fas fa-university" style="position: absolute; right: -20px; bottom: -20px; font-size: 8rem; opacity: 0.05;"></i>
                    <h3 style="color: var(--accent-gold); margin-bottom: 15px; font-size: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Sanctuary University</h3>
                    <p style="margin-bottom: 8px; font-size: 0.9rem;"><strong style="color:#cbd5e1;">Nome:</strong> Gabriel Ribeiro</p>
                    <p style="margin-bottom: 8px; font-size: 0.9rem;"><strong style="color:#cbd5e1;">Curso:</strong> Medicina</p>
                    <p style="margin-bottom: 8px; font-size: 0.9rem;"><strong style="color:#cbd5e1;">Matrícula:</strong> 2026.1.0045</p>
                    <p style="font-size: 0.9rem;"><strong style="color:#cbd5e1;">Validade:</strong> 12/2026</p>
                </div>
                <button class="btn-white" onclick="closeModal()"><i class="fas fa-download"></i> Salvar PDF</button>
            </div>
        `);
    }
}

/* =========================================
   FUNÇÕES DA TELA AGENDA
========================================= */

function openNewAppointmentModal() {
    openModal(`
        <h2 style="color: var(--primary-dark); margin-bottom: 5px;">Agendar Consulta</h2>
        <p style="color: var(--text-gray); font-size: 0.85rem; margin-bottom: 20px;">Preencha os dados abaixo para solicitar uma nova marcação.</p>
        <form onsubmit="confirmNewAppointment(event)">
            <div class="form-group">
                <label>Especialidade</label>
                <select class="form-control" id="new-specialty" required>
                    <option value="" disabled selected>Selecione a especialidade...</option>
                    <option value="Clínica Geral">Clínica Geral</option>
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Dermatologia">Dermatologia</option>
                    <option value="Nutrição">Nutrição</option>
                </select>
            </div>
            <div class="form-group" style="display: flex; gap: 15px;">
                <div style="flex: 1;">
                    <label>Data Desejada</label>
                    <input type="date" class="form-control" id="new-date" required>
                </div>
                <div style="flex: 1;">
                    <label>Horário</label>
                    <input type="time" class="form-control" id="new-time" required>
                </div>
            </div>
            <div class="form-group">
                <label>Motivo da Consulta (Opcional)</label>
                <textarea class="form-control" rows="2" placeholder="Breve descrição dos sintomas..."></textarea>
            </div>
            <button type="submit" class="btn-gold-solid btn-full mt-10">Confirmar Agendamento</button>
        </form>
    `);
}

function confirmNewAppointment(event) {
    event.preventDefault(); 
    const specialty = document.getElementById('new-specialty').value;
    const dateVal = document.getElementById('new-date').value;
    const timeVal = document.getElementById('new-time').value;

    const formattedDate = dateVal.split('-').reverse().join('/');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><strong>${formattedDate}</strong><br><span class="text-small text-gray">${timeVal}</span></td>
        <td>${specialty}</td>
        <td>A definir</td>
        <td>Ambulatório Central</td>
        <td><span class="status-badge status-confirmed" style="background-color: #e0f2fe; color: #0284c7;">Aguardando Triagem</span></td>
        <td><button class="btn-icon" onclick="openAppointmentActions(this, '${specialty}', 'A definir', '${formattedDate} às ${timeVal}', 'triagem')"><i class="fas fa-ellipsis-v"></i></button></td>
    `;

    const tbody = document.getElementById('agenda-table-body');
    if(tbody) {
        tbody.insertBefore(newRow, tbody.firstChild);
    }

    closeModal();
    showNotification(`Consulta de ${specialty} solicitada com sucesso!`);
}

let currentRowToEdit = null;

function openAppointmentActions(buttonElement, specialty, doctor, datetime, status) {
    currentRowToEdit = buttonElement.closest('tr'); 
    let cancelOption = '';
    
    if (status !== 'done') {
        cancelOption = `
            <li class="text-danger" style="cursor: pointer; padding: 12px 15px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; font-weight: 500; color: var(--danger-red);" onclick="cancelCurrentAppointment()">
                <i class="fas fa-times-circle" style="width: 20px;"></i> Cancelar Marcação
            </li>
        `;
    }

    openModal(`
        <div style="text-align: center; margin-bottom: 20px;">
            <div class="icon-box mx-auto mb-15" style="background: var(--accent-gold-light); color: var(--accent-gold); width: 50px; height: 50px; font-size: 1.2rem; display: flex; justify-content: center; align-items: center; border-radius: 8px;">
                <i class="fas fa-stethoscope"></i>
            </div>
            <h3 style="color: var(--primary-dark);">${specialty}</h3>
            <p style="color: var(--text-gray); font-size: 0.9rem;">${doctor} &bull; ${datetime}</p>
        </div>
        <ul style="list-style: none; padding: 0; margin-top: 15px;">
            <li style="cursor: pointer; padding: 12px 15px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; font-weight: 500; color: var(--primary-dark);" onclick="closeModal(); showNotification('A abrir detalhes médicos do paciente...');">
                <i class="fas fa-file-medical-alt" style="width: 20px;"></i> Ver Detalhes
            </li>
            <li style="cursor: pointer; padding: 12px 15px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; font-weight: 500; color: var(--primary-dark);" onclick="closeModal(); rescheduleAppointment();">
                <i class="fas fa-calendar-day" style="width: 20px;"></i> Reagendar
            </li>
            ${cancelOption}
        </ul>
    `);
}

function cancelCurrentAppointment() {
    if (currentRowToEdit) {
        const statusCell = currentRowToEdit.cells[4];
        if(statusCell) {
            statusCell.innerHTML = '<span class="status-badge status-pending" style="background-color: #fee2e2; color: #991b1b; text-decoration: line-through;">Cancelado</span>';
        }
        currentRowToEdit.style.opacity = '0.5';
    }
    closeModal();
    showNotification('A sua consulta foi cancelada.');
}

/* =========================================
   FUNÇÕES DA TELA DE ATENDIMENTO
========================================= */

function openNewTicketModal() {
    openModal(`
        <h2 style="color: var(--primary-dark); margin-bottom: 5px;">Abrir Novo Chamado</h2>
        <p style="color: var(--text-gray); font-size: 0.85rem; margin-bottom: 20px;">Descreva a sua necessidade para que a nossa equipa possa ajudar.</p>
        <form onsubmit="submitNewTicket(event)">
            <div class="form-group">
                <label>Categoria do Assunto</label>
                <select class="form-control" required>
                    <option value="" disabled selected>Selecione uma categoria...</option>
                    <option value="financeiro">Financeiro / Mensalidades</option>
                    <option value="academico">Académico / Documentos</option>
                    <option value="saude">Saúde / Atestados</option>
                    <option value="tecnico">Suporte Técnico do Portal</option>
                </select>
            </div>
            <div class="form-group">
                <label>Assunto Principal</label>
                <input type="text" class="form-control" placeholder="Ex: Dúvida sobre a fatura de Março" required>
            </div>
            <div class="form-group">
                <label>Mensagem</label>
                <textarea class="form-control" rows="4" placeholder="Detalhe a sua solicitação aqui..." required></textarea>
            </div>
            <div class="form-group">
                <label>Anexar Ficheiro (Opcional)</label>
                <input type="file" class="form-control" style="padding: 8px;">
            </div>
            <button type="submit" class="btn-gold-solid btn-full mt-10"><i class="fas fa-paper-plane"></i> Enviar Solicitação</button>
        </form>
    `);
}

function submitNewTicket(event) {
    event.preventDefault(); 
    const countElement = document.getElementById('open-tickets-count');
    if(countElement) {
        let currentCount = parseInt(countElement.innerText);
        countElement.innerText = (currentCount + 1).toString().padStart(2, '0');
    }
    closeModal();
    showNotification('O seu chamado foi aberto com sucesso. O prazo de resposta é de 48h úteis.');
}

function openMyTicketsModal() {
    openModal(`
        <h2 style="color: var(--primary-dark); margin-bottom: 20px;">Meus Chamados</h2>
        <div style="max-height: 300px; overflow-y: auto;">
            <table class="data-table" style="font-size: 0.85rem; width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr>
                        <th style="padding: 10px; border-bottom: 2px solid var(--border-color);">Protocolo</th>
                        <th style="padding: 10px; border-bottom: 2px solid var(--border-color);">Assunto</th>
                        <th style="padding: 10px; border-bottom: 2px solid var(--border-color);">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">#8472</td>
                        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">Envio de Atestado Médico</td>
                        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="status-badge status-pending" style="background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px;">Em Análise</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">#8103</td>
                        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">Declaração de Matrícula</td>
                        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="status-badge status-done" style="background-color: #e2e8f0; color: #475569; padding: 4px 8px; border-radius: 12px;">Resolvido</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button class="btn-white btn-full mt-20" onclick="closeModal()">Fechar Janela</button>
    `);
}

function toggleFAQ(element) {
    const answer = element.querySelector('.faq-answer');
    const icon = element.querySelector('.transition-icon');
    
    if (answer.classList.contains('hidden')) {
        document.querySelectorAll('.faq-answer').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.transition-icon').forEach(el => el.classList.remove('rotate-180'));
        
        answer.classList.remove('hidden');
        if(icon) icon.classList.add('rotate-180');
    } else {
        answer.classList.add('hidden');
        if(icon) icon.classList.remove('rotate-180');
    }
}