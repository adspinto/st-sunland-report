import "../App.css";

const Item = ({ item }) => {
  return (
    <div className="mobile-list-container">
      <h2>{`${item.name} - ${item.level}`}</h2>
      <ul className="mobile-list-item">
        <li>
          <span>Na Guild Desde </span>
          <span>{item.joined}</span>
        </li>
        <li>
          <span>Ultima Atividade</span>
          <span> {item.activity}</span>
        </li>
        <li>
          <span>Patrimônio</span>
          <span> {item.gld}</span>
        </li>
        <li>
          <span>Investimentos Atuais</span>
          <span> {item.invst}</span>
        </li>
        <li>
          <span>Investimentos Semanal</span>
          <span> {item.invst_monday}</span>
        </li>
        <li>
          <span>Soma Investimentos</span>
          <span> {item.invst_sofar}</span>
        </li>
        <li>
          <span>Percentual</span>
          <span> {item.percent_invested}</span>
        </li>
        <li>
          <span>Renome Semanal</span>
          <span> {item.bount_week}</span>
        </li>
      </ul>
    </div>
  );
};

function MobileCard({ data }) {
  return (
    <div>
      {data &&
        data.map((item) => {
          return <Item key={item._id} item={item} />;
        })}
    </div>
  );
}

export default MobileCard;
