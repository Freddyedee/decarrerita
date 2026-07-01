export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>¡Entorno de Desarrollo Verificado! </h1>
      <p>Si estás viendo este texto, significa que:</p>
      <ul style={{ lineHeight: '2' }}>
        <li> <strong>Next.js</strong> está compilando correctamente.</li>
        <li> <strong>Docker/Dev Container</strong> está gestionando el tráfico de red.</li>
        <li> <strong>Puertos</strong> mapeados correctamente a través de WSL2.</li>
        <li> <strong>Sistema de archivos</strong> montado con éxito.</li>
      </ul>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Próximo paso sugerido:</h2>
        <p>Ahora que el entorno está estable, estamos listos para conectar tu <strong>Base de Datos PostgreSQL</strong>.</p>
      </div>
    </main>
  );
}