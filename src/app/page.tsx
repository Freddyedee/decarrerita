import { listUsers } from '@modules/user/application/listUsers';

export default async function HomePage() {
  const users = await listUsers();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Usuarios de Decarrerita</h1>
        </div>

        <div className="p-6">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="border-b bg-gray-100 text-gray-800 font-semibold uppercase">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id_usuario} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">#{user.id_usuario}</td>
                  <td className="px-6 py-4">{user.nombre} {user.apellido}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.telefono}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      {user.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}