import './App.css'
import {useState} from "react";
import moment from "moment-jalaali";
import {printLabel} from "./printer/index.js";

const convertToJalali = (date) => {
  return date ? moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD") : "";
};

const getRandomTime = (hour) => {
  const minutes = Math.floor(Math.random() * 31); // Random minutes between 00-30
  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const persianWeekdays = {
  "Saturday": "شنبه",
  "Sunday": "یکشنبه",
  "Monday": "دوشنبه",
  "Tuesday": "سه‌شنبه",
  "Wednesday": "چهارشنبه",
  "Thursday": "پنج‌شنبه",
  "Friday": "جمعه"
};

const generateDateRows = (start, end, checkInHour, checkOutHour) => {
  let currentDate = moment(start, "jYYYY/jMM/jDD");
  let endDate = moment(end, "jYYYY/jMM/jDD");
  let data = [];

  while (currentDate.isSameOrBefore(endDate, "day")) {
    const dayName = currentDate.format("dddd");
    data.push({
      date: currentDate.format("jYYYY/jMM/jDD"),
      day: persianWeekdays[dayName] || dayName,
      checkIn: dayName !== "Thursday" && dayName !== "Friday" ? getRandomTime(checkInHour) : '',
      checkOut: dayName !== "Thursday" && dayName !== "Friday" ? getRandomTime(checkOutHour) : '',
    });
    currentDate.add(1, "day");
  }
  return data;
};

function App() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [minCheckIn, setMinCheckIn] = useState(9);
  const [maxCheckOut, setMaxCheckOut] = useState(19);
  const [generatedData, setGeneratedData] = useState([]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const jalaliFromDate = convertToJalali(fromDate);
    const jalaliToDate = convertToJalali(toDate);
    const dataRows = generateDateRows(jalaliFromDate, jalaliToDate, parseInt(minCheckIn), parseInt(maxCheckOut));
    setGeneratedData(dataRows);
  };

  const handleRemoveRow = (index) => {
      const data = generatedData
      data[index] = {
        date: data[index].date,
        day: data[index].day,
        checkIn: '',
        checkOut: '',
      }
      setGeneratedData([...data])
  }

  return (
    <div style={{ padding:'32px', width: '95vw' , display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ padding: "16px", maxWidth: "400px", margin: "auto" }}>
        <div style={{ marginBottom: "16px" }}>
          <label>از تاریخ:</label>
          <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>تا تاریخ:</label>
          <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>حداقل ساعت ورود:</label>
          <input
              type="number"
              min="1"
              max="24"
              value={minCheckIn}
              onChange={(e) => setMinCheckIn(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label>حداکثر ساعت خروج:</label>
          <input
              type="number"
              min="1"
              max="24"
              value={maxCheckOut}
              onChange={(e) => setMaxCheckOut(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
          ارسال
        </button>
      </form>
      {generatedData.length > 0 && (
          <div>
          <table dir="rtl" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse", textAlign: "right" , color:'#111' }}>
            <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid gray", padding: "8px" }}>تاریخ</th>
              <th style={{ border: "1px solid gray", padding: "8px" }}>روز هفته</th>
              <th style={{ border: "1px solid gray", padding: "8px" }}>ساعت ورود</th>
              <th style={{ border: "1px solid gray", padding: "8px" }}>ساعت خروج</th>
            </tr>
            </thead>
            <tbody>
            {generatedData.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>{row.date}</td>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>{row.day}</td>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>{row.checkIn}</td>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>{row.checkOut}</td>
                  <td onClick={() => handleRemoveRow(index)} style={{ border: "1px solid gray", padding: "8px" }}><span style={{fontSize:'16px' , cursor:'pointer'}}>&#10060;</span></td>
                </tr>
            ))}
            </tbody>
          </table>
            <button style={{ width:'100%', marginTop:'16px', padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }} onClick={() => printLabel(generatedData)}>
              پرینت
            </button>
          </div>
      )}
    </div>
  )
}

export default App
