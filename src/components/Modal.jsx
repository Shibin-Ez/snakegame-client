import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const Modal = ({ setIsModalOpen }) => {
  const [records, setRecords] = useState([]);

  const getRecords = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/records`);
    const data = await response.json();
    setRecords(data);
  };

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <div className="modal-bg">
      <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
        <IoClose />
      </button>
      <div className="modal-main">
        <h1>Leaderboard</h1>
        <table className="modal-table">
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
          {records.map((record, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{record.name}</td>
                <td>{record.score}</td>
                <td>{record.time}s</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default Modal;
