export default function TaskList({tasks}) {
  const rows = tasks.map(t => {
    return (
      <tr key={t.pomodoro_id}>
        <td>{t.started_at}</td>
        <td>{t.description}</td>
        <td>{t.status}</td>
      </tr>
    )
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Started at</th>
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