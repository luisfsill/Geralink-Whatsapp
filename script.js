// Adicione esta nova referência ao elemento DOM no início do seu arquivo JS
const customMessageInput = document.getElementById('customMessage');
const phoneNumberInput = document.getElementById('phoneNumber');
const generateBtn = document.getElementById('generateBtn');
const resultContainer = document.getElementById('result-container');
const linkDisplay = document.getElementById('link-display');
const openLinkButton = document.getElementById('openLinkButton');

let whatsappLink = '';

// Modifique a função generateLink() para incluir a mensagem personalizada
function generateLink(e) {
    // Prevenir comportamento padrão do botão
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    
    // Remover foco do botão para evitar problemas visuais
    if (document.activeElement) {
        document.activeElement.blur();
    }
    
    const phoneNumber = phoneNumberInput.value.trim();
    const customMessage = customMessageInput.value.trim();
    
    // Verifica se o campo de número foi preenchido
    if (phoneNumber === '') {
        showNotification('Por favor, insira um número de WhatsApp.', 'error');
        return;
    }

    // Verifica se o número contém apenas números e tem pelo menos 12 dígitos (código do país + DDD + número)
    const regex = /^[0-9]{12,}$/;
    if (!regex.test(phoneNumber)) {
        showNotification('Por favor, insira um número válido com pelo menos 12 dígitos.', 'error');
        return;
    }

    // Cria o link base
    let link = `https://wa.me/${phoneNumber}`;
    
    // Adiciona a mensagem personalizada ao link, se existir
    if (customMessage !== '') {
        // Codifica a mensagem para URL (substitui espaços e caracteres especiais)
        const encodedMessage = encodeURIComponent(customMessage);
        link += `?text=${encodedMessage}`;
    }
    
    whatsappLink = link;
    
    // Atualiza o link para o WhatsApp
    openLinkButton.setAttribute('href', whatsappLink);
    
    // Exibe o link gerado
    linkDisplay.textContent = whatsappLink;
    
    // Exibe os botões de copiar e abrir
    resultContainer.classList.remove('hidden');
    resultContainer.classList.add('show');
    
    // Remove a animação de pulso do botão gerar
    generateBtn.classList.remove('pulse');
}

// Função para limpar todos os campos e o resultado
function clearAll() {
    // Limpa os campos
    phoneNumberInput.value = '';
    customMessageInput.value = '';
    
    // Oculta o container de resultado
    resultContainer.classList.add('hidden');
    resultContainer.classList.remove('show');
    
    // Adiciona a animação de pulso no botão gerar
    generateBtn.classList.add('pulse');
    
    // Notifica o usuário
    showNotification('Campos limpos com sucesso!', 'success');
}

// Adiciona botão de limpar na interface
window.addEventListener('DOMContentLoaded', function() {
    // Limpa os campos ao carregar a página
    phoneNumberInput.value = '';
    customMessageInput.value = '';
    
    // Oculta o container de resultado
    resultContainer.classList.add('hidden');
    resultContainer.classList.remove('show');
    
    // Cria o botão de limpar
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn clear-btn';
    clearBtn.innerHTML = '<i class="fas fa-trash"></i> Limpar Campos';
    clearBtn.onclick = clearAll;
    
    // Adiciona o botão após o botão gerar
    generateBtn.parentNode.insertBefore(clearBtn, generateBtn.nextSibling);
    
    // Adiciona espaço entre os botões
    const spacer = document.createElement('div');
    spacer.style.height = '10px';
    generateBtn.parentNode.insertBefore(spacer, clearBtn);
});

// Adicione evento de tecla Enter para o campo de mensagem também
customMessageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Previne quebra de linha
        generateLink();
    }
});

// Função para copiar o link para a área de transferência
function copyLink() {
    if (!whatsappLink) return;
    
    navigator.clipboard.writeText(whatsappLink)
        .then(() => {
            showNotification('Link copiado com sucesso!', 'success');
        })
        .catch(err => {
            console.error('Erro ao copiar: ', err);
            showNotification('Erro ao copiar o link.', 'error');
        });
}

// Função para mostrar notificações
function showNotification(message, type) {
    // Cria um elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Adiciona a notificação ao corpo do documento
    document.body.appendChild(notification);
    
    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Adiciona evento de clique ao botão gerar (além do onclick no HTML)
generateBtn.addEventListener('click', generateLink);

// Adiciona evento para limpar campos ao recarregar a página
window.addEventListener('beforeunload', function() {
    // Limpa os campos antes de recarregar
    phoneNumberInput.value = '';
    customMessageInput.value = '';
    
    // Oculta o container de resultado
    resultContainer.classList.add('hidden');
    resultContainer.classList.remove('show');
});