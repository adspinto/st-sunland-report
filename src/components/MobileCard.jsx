import "../App.css";

const Item = ({ item, guildName }) => {
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
          <span>Investimento total</span>
          <span> {item.invst}</span>
        </li>
        <li>
          <span>Investimento salvo</span>
          <span> {item.invst_monday}</span>
        </li>
        <li>
          <span>Investimento semanal</span>
          <span> {item.invst_sofar}</span>
        </li>
        {guildName == "Sunland" && (
          <li>
            <span>Percentual</span>
            <span> {item.percent_invested}</span>
          </li>
        )}
        <li>
          <span>Renome Semanal</span>
          <span> {item.bount_week}</span>
        </li>
      </ul>
    </div>
  );
};

function MobileCard({ data, user }) {
  const guildName = user ? user["custom:guildName"] : "";
  return (
    <div>
      {data &&
        data.map((item) => {
          return <Item guildName={guildName} key={item._id} item={item} />;
        })}
    </div>
  );
}

export default MobileCard;
