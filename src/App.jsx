import './App.css'
import {useState} from "react";
import moment from "moment-jalaali";
import {printLabel} from "./printer/index.js";

const convertToJalali = (date) => {
    return date ? moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD") : "";
};

const getRandomTime = (hour) => {
    const minutes = Math.floor(Math.random() * 31);
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
        const isWorkday = dayName !== "Thursday" && dayName !== "Friday";
        data.push({
            date: currentDate.format("jYYYY/jMM/jDD"),
            day: persianWeekdays[dayName] || dayName,
            checkIn: isWorkday ? getRandomTime(checkInHour) : '',
            checkOut: isWorkday ? getRandomTime(checkOutHour) : '',
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
        const dataRows = generateDateRows(
            jalaliFromDate,
            jalaliToDate,
            parseInt(minCheckIn),
            parseInt(maxCheckOut)
        );
        setGeneratedData(dataRows);
    };

    const handleRemoveRow = (index) => {
        const data = [...generatedData];
        data[index] = {
            ...data[index],
            checkIn: '',
            checkOut: '',
        };
        setGeneratedData(data);
    };

    // NEW: ویرایش ساعت ورود/خروج
    const handleTimeChange = (index, field, value) => {
        const data = [...generatedData];
        // value مثل "HH:MM"
        data[index] = { ...data[index], [field]: value };
        setGeneratedData(data);
    };

    // NEW: تکرار ردیف
    const handleDuplicateRow = (index) => {
        const data = [...generatedData];
        const clone = { ...data[index] };
        // اگر خواستی زمان‌ها خالی شوند، دو خط زیر را آنکامنت کن:
        // clone.checkIn = '';
        // clone.checkOut = '';
        data.splice(index + 1, 0, clone);
        setGeneratedData(data);
    };

    return (
        <div style={{ padding:'32px', width: '95vw' , display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleSubmit} style={{ padding: "16px", maxWidth: "400px", margin: "auto" }}>
                <div style={{ marginBottom: "16px" }}>
                    <label>از تاریخ:</label>
                    <input
                        type="date"
                        value={fromDate || ''}
                        onChange={(e) => setFromDate(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "16px" }}>
                    <label>تا تاریخ:</label>
                    <input
                        type="date"
                        value={toDate || ''}
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
                <div style={{ width: '100%', maxWidth: 900, marginInlineStart: 16 }}>
                    <table dir="rtl" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse", textAlign: "right" , color:'#111' }}>
                        <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                            <th style={{ border: "1px solid gray", padding: "8px" }}>تاریخ</th>
                            <th style={{ border: "1px solid gray", padding: "8px" }}>روز هفته</th>
                            <th style={{ border: "1px solid gray", padding: "8px" }}>ساعت ورود</th>
                            <th style={{ border: "1px solid gray", padding: "8px" }}>ساعت خروج</th>
                            <th style={{ border: "1px solid gray", padding: "8px", minWidth: 150 }}>عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {generatedData.map((row, index) => (
                            <tr key={index}>
                                <td style={{ border: "1px solid gray", padding: "8px" }}>{row.date}</td>
                                <td style={{ border: "1px solid gray", padding: "8px" }}>{row.day}</td>

                                {/* NEW: فیلدهای قابل ویرایش */}
                                <td style={{ border: "1px solid gray", padding: "8px" }}>
                                    <input
                                        type="time"
                                        value={row.checkIn || ''}
                                        step="60"
                                        onChange={(e) => handleTimeChange(index, 'checkIn', e.target.value)}
                                        style={{ width: '120px', padding: '4px' }}
                                    />
                                </td>
                                <td style={{ border: "1px solid gray", padding: "8px" }}>
                                    <input
                                        type="time"
                                        value={row.checkOut || ''}
                                        step="60"
                                        onChange={(e) => handleTimeChange(index, 'checkOut', e.target.value)}
                                        style={{ width: '120px', padding: '4px' }}
                                    />
                                </td>

                                {/* NEW: دکمه‌های تکرار و خالی‌کردن ساعات */}
                                <td style={{ border: "1px solid gray", padding: "8px", display: 'flex', gap: 8 }}>
                                    <button
                                        type="button"
                                        onClick={() => handleDuplicateRow(index)}
                                        style={{ padding: "6px 10px", backgroundColor: "#198754", color: "white", border: "none", cursor: "pointer" }}
                                        title="تکرار ردیف"
                                    >
                                        تکرار
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRow(index)}
                                        style={{ padding: "6px 10px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}
                                        title="خالی کردن ساعات"
                                    >
                                        پاک‌کردن
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <button
                        style={{ width:'100%', marginTop:'16px', padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
                        onClick={() => printLabel(generatedData)}
                    >
                        پرینت
                    </button>
                </div>
            )}
        </div>
    )
}

export default App