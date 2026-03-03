import Form from '../components/Dashboard/Form';
import TeamChart from '../components/Dashboard/TeamChart'
import TeamList from '../components/Dashboard/TeamList'
import HighlightStats from '../components/Dashboard/HighlightStats';

function Dashboard() {

  return (
    <div
      className="dashboard-wrapper"
      role="region"
      aria-label="Dashboard d'équipe"
    >
      <div className='db-banner'>
        <HighlightStats/>
      </div>
      <div className='dashboard-container' id='db-flex'>
        <div className='db-left'>
          <Form />
          <TeamList/>
        </div>
        <TeamChart/>
      </div>
    </div>
  );
};

export default Dashboard;