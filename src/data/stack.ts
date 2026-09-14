import { TechItem } from '../types';

export const TECH_STACK: TechItem[] = [
  { name: 'React 19', category: 'frontend', level: 'Especialista', icon: 'Atom' },
  { name: 'TypeScript', category: 'frontend', level: 'Especialista', icon: 'FileCode2' },
  { name: 'Tailwind CSS', category: 'frontend', level: 'Avançado', icon: 'Sparkles' },
  { name: 'Vite / Next.js', category: 'frontend', level: 'Avançado', icon: 'Zap' },
  { name: 'Node.js / Express', category: 'backend', level: 'Avançado', icon: 'Server' },
  { name: 'PostgreSQL', category: 'database', level: 'Avançado', icon: 'Database' },
  { name: 'Git & GitHub', category: 'devops', level: 'Especialista', icon: 'GitBranch' },
  { name: 'Hostinger VPS / Linux', category: 'devops', level: 'Avançado', icon: 'Terminal' },
  { name: 'Nginx & SSL', category: 'devops', level: 'Avançado', icon: 'ShieldCheck' },
  { name: 'Docker', category: 'devops', level: 'Intermediário', icon: 'Box' },
];

export const HOSTINGER_STEPS = [
  {
    step: 1,
    title: 'Exportar do AI Studio para o GitHub',
    desc: 'No topo da tela do AI Studio, clique em "Export to GitHub". Isso criará ou atualizará o seu repositório oficial com o código limpo.',
    command: '# No seu computador local (opcional):\ngit clone https://github.com/sgoliveira16/studio-x09.git\ncd studio-x09',
  },
  {
    step: 2,
    title: 'Acessar a VPS Hostinger via Terminal SSH',
    desc: 'Abra seu terminal no Windows/Mac/Linux e acesse o servidor da Hostinger com os dados fornecidos no painel hPanel:',
    command: 'ssh root@SEU_IP_DA_HOSTINGER',
  },
  {
    step: 3,
    title: 'Instalar Node.js, Nginx e Git na VPS',
    desc: 'Se o servidor for recém-criado (Ubuntu 22.04 ou 24.04), execute a instalação básica dos pacotes:',
    command: 'sudo apt update && sudo apt upgrade -y\nsudo apt install -y curl git nginx\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs\nnode -v && npm -v',
  },
  {
    step: 4,
    title: 'Clonar o repositório do Studio x09 e gerar o Build',
    desc: 'Na pasta /var/www, faça o clone do projeto do GitHub e gere a pasta de produção `dist/`:',
    command: 'cd /var/www\nsudo git clone https://github.com/sgoliveira16/studio-x09.git studio-x09\ncd studio-x09\nsudo npm install\nsudo npm run build',
  },
  {
    step: 5,
    title: 'Configurar o Nginx para servir o site',
    desc: 'Crie o arquivo de configuração do site no Nginx para apontar diretamente para a pasta `dist` gerada:',
    command: `cat << 'EOF' | sudo tee /etc/nginx/sites-available/studio-x09
server {
    listen 80;
    server_name studiox09.com.br www.studiox09.com.br;
    root /var/www/studio-x09/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF

sudo ln -s /etc/nginx/sites-available/studio-x09 /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`,
  },
  {
    step: 6,
    title: 'Ativar SSL gratuito (HTTPS) com Let\'s Encrypt',
    desc: 'Instale o Certbot para ter HTTPS seguro e certificado com renovação automática gratuita:',
    command: 'sudo apt install -y certbot python3-certbot-nginx\nsudo certbot --nginx -d studiox09.com.br -d www.studiox09.com.br',
  },
  {
    step: 7,
    title: 'Atualizações futuras com 1 comando',
    desc: 'Sempre que você editar o site e enviar alterações para o GitHub, basta entrar na VPS e rodar:',
    command: 'cd /var/www/studio-x09 && git pull && npm run build',
  },
];
