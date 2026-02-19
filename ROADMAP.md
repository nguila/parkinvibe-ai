
# Roadmap de Desenvolvimento: ParkinVibe AI

Este documento detalha os passos técnicos e estratégicos para transformar esta ideia num produto real.

## 1. Stack Tecnológica Recomendada
- **Frontend:** React (Web/PWA) ou React Native (Mobile Nativo).
- **IA:** Google Gemini API para geração de conteúdos dinâmicos.
- **Backend/Base de Dados:** Firebase (Google) ou Supabase.
  - Oferecem autenticação, base de dados em tempo real e alojamento simplificado.
- **Notificações:** Firebase Cloud Messaging (FCM) para alertas de medicação.

## 2. Passos de Execução
1.  **Prototipagem de UX/UI:** Focar em acessibilidade (botões grandes, alto contraste, comandos de voz).
2.  **Integração de IA:** Configurar prompts no Gemini para gerar exercícios específicos para o estágio da doença do utilizador.
3.  **Desenvolvimento do MVP (Minimum Viable Product):**
    - Implementar Diário de Sintomas.
    - Implementar Alerta de Medicação.
    - Implementar Quiz Mental.
4.  **Testes com Utilizadores:** Feedback de doentes de Parkinson e cuidadores.
5.  **Conformidade (RGPD/HIPAA):** Garantir que os dados de saúde são armazenados de forma segura e privada.

## 3. Onde Alocar e Publicar
- **Web App (PWA):** Vercel ou Netlify (Custo zero inicial).
- **Mobile (iOS/Android):**
  - Apple App Store (Requer conta de programador $99/ano).
  - Google Play Store (Requer conta de programador $25 taxa única).
- **Infraestrutura de IA:** Google Cloud Platform (GCP).

## 4. Diferenciador AI
O diferencial desta app não é apenas o registo, mas a **análise preditiva**. A IA pode notar se o tremor do utilizador está a aumentar com base na velocidade de escrita ou clareza dos quizzes mentais e sugerir uma visita ao médico.
