# ifal-exames

> Releitura do website de exames do IFAL

![DeepScan grade](https://deepscan.io/api/teams/14855/projects/20424/branches/556090/badge/grade.svg?token=a1fa0980263b30233c0ddf1e9c3ed778290db2ee)
![DeepSource Active Issues](https://deepsource.io/gh/gepetojj/ifal-exames.svg/?label=active+issues&show_trend=true&token=muL5iQIqWNYCF0KQSd-tuPBq)
![DeepSource Resolved Issues](https://deepsource.io/gh/gepetojj/ifal-exames.svg/?label=resolved+issues&show_trend=true&token=muL5iQIqWNYCF0KQSd-tuPBq)

![SimpleAnalytics](https://simpleanalyticsbadge.com/ifal.vercel.app?mode=dark)

Acesse a releitura usando o link: [https://ifal.vercel.app](https://ifal.vercel.app).

## Conteúdos

-   [ifal-exames](#ifal-exames)
    -   [Conteúdos](#conteúdos)
    -   [Proposta](#proposta)
    -   [Diferenças com a versão original](#diferenças-com-a-versão-original)
        -   [Performance](#performance)
        -   [Segurança](#segurança)
        -   [Acessibilidade](#acessibilidade)
    -   [Tecnologias](#tecnologias)
    -   [Design](#design)
    -   [Créditos e Licensa](#créditos-e-licensa)

## Proposta

A proposta desta releitura é concertar e/ou melhorar falhas no website original, além de modernizar e usar tecnologias mais recentes. Mas sempre mantendo o visual original.

## Diferenças com a versão original

Lembrete: os testes a seguir foram feitos na página principal de ambos os websites: [ifal.vercel.app/exames/andamento](https://ifal.vercel.app/exames/andamento) e [exame.ifal.edu.br/publico/exames/emandamento](https://exame.ifal.edu.br/publico/exames/emandamento).

### Performance

A releitura ainda não está finalizada, mas com o estado atual já é possível perceber grandes melhorias na performance do site. As métricas levadas em consideração são definidas pelo Web Vitals. Para saber mais, [veja o que é web vitals](https://web.dev/vitals/).

Testes feitos pela [ferramenta do web.dev](https://web.dev/measure/), realizados 3 vezes cada:

Web Vitals da releitura (ifal.vercel.app):

![WebVitals da releitura](https://github.com/gepetojj/ifal-exames/blob/main/.github/assets/wv-rework.png?raw=true)

Web Vitals do website original (exame.ifal.edu.br):

![WebVitals do website original](https://github.com/gepetojj/ifal-exames/blob/main/.github/assets/wv-original.png?raw=true)

Testes feitos pelo [webpagetest.org](https://webpagetest.org/), usando o servidor 'Sao Paulo - EC2' e o Chrome como navegador.

Performance da releitura (ifal.vercel.app):

![Performance da releitura](https://github.com/gepetojj/ifal-exames/blob/main/.github/assets/performance-rework.png?raw=true)

Performance do website original (exame.ifal.edu.br):

![Performance do website original](https://github.com/gepetojj/ifal-exames/blob/main/.github/assets/performance-original.png?raw=true)

### Segurança

Quando um site vai para o ar, é muito importante previnir que ele exponha seus usuários, ou até a própria empresa por trás do projeto. Para ajudar com a segurança o website deve aplicar [headers](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers) que não permitem ações maliciosas. Foi notado que o website original não possui tais headers, então implementei na releitura.

Testes feitos pelo [webpagetest.org](https://webpagetest.org/), usando o servidor 'Sao Paulo - EC2' e o Chrome como navegador.

Segurança da releitura (ifal.vercel.app):

![Segurança da releitura](https://github.com/gepetojj/ifal-exames/blob/main/.github/assets/security-ifalrework.png?raw=true)

Segurança do website original (exame.ifal.edu.br):

![Segurança do website original](https://github.com/gepetojj/ifal-exames/blob/main/.github/assets/security-ifaloriginal.png?raw=true)

### Acessibilidade

Como já mostrado nos testes do Web Vitals, a releitura possui um nível de acessibilidade muito maior que o website original. Além da acessibilidade servida na página em sí, a releitura fornece 3 línguas que podem ser escolhidas pelo usuário: pt-br (Português do Brasil), en (Inglês) e es (Espanhol). Desta forma, o alcance da releitura é expandido.

## Tecnologias

Para este projeto, escolhi o Remix como framework. O Remix é um framework novo no mercado, porém oference muitas melhorias e otimizações para o site, entre elas o SSR (Server-Side Rendering), o que vai garantir muitas melhoras ao website. E claro, o Remix usa o React.js.

O website está disponível como PWA (Progressive Web App), e pode ser instalado em seu computador e celular.

Todas as libs usadas estão disponíveis [aqui](https://github.com/gepetojj/ifal-exames/blob/main/package.json).

## Design

Feito no Figma, confira [aqui](https://www.figma.com/file/KH2HRnZw7UmMBb8aQ1oDUQ/IFAL).

Decidi preservar as cores originais do IFAL, com apenas algumas adicionais para complementar e combinar com a proposta desta releitura.

O objetivo principal é tornar a página mais moderna e facilitar seu uso, tanto para os que dependem da acessibilidade, quanto para os usuários comuns.

Para as bordas, escolhi 1.5px, deixando-as pouco arredondadas e com uma seriedade, passando confiança ao usuário.

Para a fonte, escolhi a Inter. Não é muito diferente da fonte original da página, mas tem um ar mais moderno e passa a mesma seriedade que a original.

Para as cores adicionais, escolhi uma paleta pastel, que é mais confortável para os olhos e quebra um pouco o estilo das cores originais do IFAL.

## Créditos e Licensa

O projeto está protegido pela licensa [MIT](https://github.com/gepetojj/ifal-exames/blob/main/LICENSE), mas é válido lembrar que foi inspirado e usa os nomes e logotipos do Instituto Federal de Alagoas. O website original foi criado pela [Diretoria de Tecnologia da Informação do IFAL](https://www.dti.ifal.edu.br/) e não é open-source.
