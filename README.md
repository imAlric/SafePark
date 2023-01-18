<p align="center">
<img src="./src/assets/img/logo.png" width="20%"/>
</p>
<p align="center">
<span style="font-weight:bold">SafePark&trade;</span><br/>
sistema web intranet para frente de caixa de um estacionamento.
</p>

<h2>TL;DR;</h2>
<p>
Sistema dedicado a simulação de uma experiência frente de caixa web intranet,
desenvolvido com:
</p>
<ul>
    <li>React.js</li>
    <li>TypeScript</li>
    <li>PHP</li>
    <li>PostgreSQL</li>
</ul>

<h2>Sumário</h2>
<ol>
    <li><a href="#sobre">Sobre o Projeto</a></li>
    <li><a href="#test">Testar o Sistema</a></li>
    <li><a href="#docs">Documentação</a></li>
    <li><a href="#mentions">Créditos e Menções</a></li>
    <li><a href="#final">Considerações Finais</a></li>
</ol>

<h2 id="#sobre">Sobre o Projeto</h2>
<p>
    Este projeto é a simulação de um frente de caixa, hospedado de forma interna no sistema 
    de uma empresa de estacionamento fictícia entitulada SafePark.<br/>
    Ele é pensado e projetado para se obter a experiência mais fluida, prática e rápida, priorizando 
    a performance do sistema e agilidade na execução.<br/>
</p>

<h2 id="#test">Testar o Sistema</h2>
<p>
    O projeto foi desenvolvido com React.js e produzido por meio de Node.js. Seu teste pode ser 
    realizado por meio da execução da build acompanhada com os arquivos do projeto.
</p>

```bash
serve -s build
``` 

<p>
    O back-end da aplicação foi desenvolvido com PHP. Por ventura de incompatibilidade nativa, uma 
    instância do servidor PHP deve ser executado ao mesmo tempo que a instância principal.
</p>

```cmd
php -S localhost:8000
php -S 192.168.0.10:8000
```

<sub>
    Note que ambos Node e PHP devem ser executados sob o mesmo domínio. <br/>
    Ex: <br/> 192.168.0.10:3000 && 192.168.0.10:8000 <br/>ou<br/> localhost:3000 && localhost:8000
</sub>

<p>
    O banco de dados utilizado pela aplicação é o PostgreSQL. O sistema depende dele para o armazenamento dos dados. Crie um banco com o nome "safeparkdb" e importe o arquivo da pasta <a href="https://github.com/imAlric/SafePark/tree/master/database">database</a>. <br/><br/>
    O banco já vem com um usuário padrão para teste. <br/>
    Usuário: admin@safepark.com <br/>
    Senha: admin
</p>

<h2 id="docs">Documentação</h2>
<p>
    Toda a documentação e informações mais detalhadas sobre o projeto e o processo de desenvolvimento dele podem ser encontrados na <a href="https://drive.google.com/drive/folders/1XOFKmz-U-pz288ET3f-djAEdCd5OLKl1?usp=share_link">pasta da documentação</a>, inclusive uma visualização mais aprofundada da wireframe inicial do projeto e do banco de dados.
</p>

<h2 id="mentions">Créditos e Menções</h2>
<h4>Agradecimento</h4>
<p>
    Mais do que gratidão ao grupo HIPE Innovation Center e à RP Info Sistemas, idealizadoras e organizadoras do projeto, o sistema não seria possível sem eles, fato que toda a minha evolução como desenvolvedor e profissional eu devo a ambos, por isso, mais uma vez obrigado.
</p>
<h4>Bibliotecas/Módulos</h4>
<ul>
    <li>FontAwesome <a href="https://fontawesome.com/">https://fontawesome.com/</a></li>
    <li>BoxIcons <a href="https://boxicons.com/">https://boxicons.com/</a></li>
    <li>Bootstrap Icons <a href="https://icons.getbootstrap.com/">https://icons.getbootstrap.com/</a></li>
    <li>iziToast <a href="https://izitoast.marcelodolza.com/">https://izitoast.marcelodolza.com/</a></li>
    <li>React-Bootstrap <a href="https://react-bootstrap.github.io/">https://react-bootstrap.github.io/</a></li>
    <li>React-pdf <a href="https://react-pdf.org/">https://react-pdf.org/</a></li>
    <li>React-Currency-Input <a href="https://github.com/cchanxzy/react-currency-input-field">https://github.com/cchanxzy/react-currency-input-field</a></li>
    <li>React-Input-Mask <a href="https://github.com/sanniassin/react-input-mask">https://github.com/sanniassin/react-input-mask</a></li>
    <li>jsCookie <a href="https://github.com/js-cookie/js-cookie">https://github.com/js-cookie/js-cookie</a></li>
    <li>CryptoJS <a href="https://github.com/brix/crypto-js">https://github.com/brix/crypto-js</a></li>
</ul>

<h2 id="#final">Considerações Finais</h2>
<p>
    Este projeto foi desenvolvido de forma acadêmica. Nem todas as técnicas utilizadas são as melhores práticas, mas, houve um considerável esforço para que o sistema se adequasse às "maneiras corretas". Pretendo futuramente, com maior conhecimento, aprimorar o código do sistema atual nas áreas que eu encontre mais vulnerabilidades ou hajam formas mais práticas de serem feitas. <br/><br/>
    Com isto, finalizo o meu primeiro projeto com React.js, obrigado por ter acompanhado até aqui.
    - Alec
</p>