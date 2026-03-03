import { useAuth } from '../../context/AuthContext';


export default function TeamList(){
    const { users, session } = useAuth();

    console.log('users for list : ',users)
    
    const listEls = users?.map(user => (
        <div key={user.id} className="dbgrid2">
            <li>
            <span className="member-name">{user.name} - </span>
            <span className={`badge ${user.account_type}`}>
                {user.account_type === 'admin' ? '⭐ Admin' : 'Délégué.e'}
            </span>
            </li>
        </div>
    ));

    console.log("list :", listEls)

    return(
        <div
        className="db-grid2">
            <h2>Equipe commerciale</h2>
            <span>{users.length} personnes dans l'équipe : </span>
            <ul className="team-list-wrapper">
                {listEls && listEls.length > 0 ? listEls : <p>Aucun membre trouvé.</p>}
            </ul>
        </div>
    )
}