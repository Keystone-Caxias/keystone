function App() {
  const [logado, setLogado] = React.useState(false);
  const [screen, setScreen] = React.useState('painel');
  if (!logado) return <Login onEnter={() => setLogado(true)} />;
  const telas = { painel: <Painel onNavigate={setScreen} />, cadastro: <Cadastro />, admissoes: <Admissoes />, tesouraria: <Tesouraria /> };
  return (
    <Shell screen={screen} onNavigate={setScreen}>
      {telas[screen] || <><Topbar eyebrow="Em definição" title={{ capitulos: 'Capítulos e Arcas', relatorios: 'Relatórios', ajustes: 'Ajustes' }[screen]} /><Placeholder label="Sem especificação recebida" /></>}
    </Shell>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);