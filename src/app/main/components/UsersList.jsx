export default function UsersList({users}) {
  const rows = users.map(t => {
    return (
      <tr key={t.timer_id}>
        <td>{t.username}</td>
        <td>{t.description}</td>
        <td>{t.status}</td>
      </tr>
    )
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Description</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}