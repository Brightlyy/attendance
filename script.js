document.addEventListener('DOMContentLoaded', () => {
  const attendanceForm = document.getElementById('attendanceForm');
  const attendanceTable = $('#attendanceTable').DataTable({
    columns: [
      { title: "Student Name" },
      { title: "Roll No." },
      { title: "Attendance Status" },
      { title: "Date" },
      { title: "Time" },
      { title: "Actions" }
    ]
  });

  attendanceForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const studentName = document.getElementById('studentName').value;
    const rollNo = document.getElementById('rollNo').value;
    const attendanceStatus = document.getElementById('attendanceStatus').value;
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const attendanceRecord = {
      name: studentName,
      rollNo: rollNo,
      status: attendanceStatus,
      date: currentDate,
      time: currentTime
    };

    saveAttendance(attendanceRecord);
    displayAttendance();
    this.reset();
  });

  function saveAttendance(record) {
    let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    records.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }

  function displayAttendance() {
    attendanceTable.clear().draw();
    let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    records.forEach((record, index) => {
      const editBtn = `<button class="btn btn-sm btn-primary edit-btn" data-index="${index}">Edit</button>`;
      const deleteBtn = `<button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>`;
      attendanceTable.row.add([
        record.name,
        record.rollNo,
        record.status,
        record.date,
        record.time,
        `${editBtn} ${deleteBtn}`
      ]).draw();
    });

    attachEditDeleteHandlers();
  }

  function attachEditDeleteHandlers() {
    $('.edit-btn').on('click', function() {
      const index = $(this).data('index');
      const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
      const recordToEdit = records[index];
      if (recordToEdit) {
        document.getElementById('studentName').value = recordToEdit.name;
        document.getElementById('rollNo').value = recordToEdit.rollNo;
        document.getElementById('attendanceStatus').value = recordToEdit.status;

        deleteRecord(index);
        displayAttendance();
      }
    });

    $('.delete-btn').on('click', function() {
      const index = $(this).data('index');
      deleteRecord(index);
      displayAttendance();
    });
  }

  function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    records.splice(index, 1);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }

  displayAttendance();
});
