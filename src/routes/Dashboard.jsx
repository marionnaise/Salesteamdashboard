import Form from '../components/Form';
import TeamChart from '../components/TeamChart'

function Dashboard() {

  return (
    <div
      className="dashboard-wrapper"
      role="region"
      aria-label="Dashboard d'équipe"
    >
      <TeamChart/>
      <Form />
    </div>
  );
};

export default Dashboard;