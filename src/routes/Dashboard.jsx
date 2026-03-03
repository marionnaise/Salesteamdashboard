import Form from '../components/Dashboard/Form';
import TeamChart from '../components/Dashboard/TeamChart'
import TeamList from '../components/Dashboard/TeamList'

function Dashboard() {

  return (
    <div
      className="dashboard-wrapper"
      role="region"
      aria-label="Dashboard d'équipe"
    >
      <TeamList/>
      <Form />
      <TeamChart/>
    </div>
  );
};

export default Dashboard;