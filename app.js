const pose = (number, newsId) => {
  let formdata = new FormData();
  formdata.append("EmployeeId", 3);
  formdata.append("NewsId", 3);
  formdata.append("Status", number);

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  fetch(
    "http://dev-sw6-uapi.ecm.in.th/uapi/drt-ElectronicsDocument/ED-UpdateStatusNews",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

const changeStatus = (newsId) => {
  const switchInput = document.getElementById(`flexSwitchCheckDefault-${newsId}`);
  const modalSwitchInput = document.getElementById(`modalFlexSwitchCheckDefault-${newsId}`);

  if (switchInput.checked) {
    // เมื่อสวิตช์ในตารางถูกเปิด
    // ทำงานที่ต้องการเมื่อสวิตช์ถูกเปิด
    modalSwitchInput.checked = true;
    pose(1, newsId);
  } else {
    // เมื่อสวิตช์ในตารางถูกปิด
    // ทำงานที่ต้องการเมื่อสวิตช์ถูกปิด
    modalSwitchInput.checked = false;
    pose(0, newsId);
  }
};

fetch(
  "http://dev-sw6-uapi.ecm.in.th/uapi/drt-ElectronicsDocument/ED-GetNews?EmployeeId=3"
)
  .then((response) => response.json())
  .then((data) => {
    const tableBody = document.querySelector("#data-table-tbody");

    data.data.forEach((news) => {
      const row = document.createElement("tr");

      const status = document.createElement("td");
      status.textContent = news.Status;

      if (status.textContent == 1) {
        //status on
        status.innerHTML = `
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault-${news.NewsId}" checked onchange="changeStatus(${news.NewsId})">
            <label class="form-check-label" for="flexSwitchCheckDefault-${news.NewsId}"></label>
          </div>`;
      } else {
        //status off
        status.innerHTML = `
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault-${news.NewsId}" onchange="changeStatus(${news.NewsId})">
            <label class="form-check-label" for="flexSwitchCheckDefault-${news.NewsId}"></label>
          </div>`;
      }
      
      row.appendChild(status);

      const newsId = document.createElement("td");
      newsId.textContent = news.NewsId;
      row.appendChild(newsId);

      const newsName = document.createElement("td");
      newsName.textContent = news.NameNews;
      const dataName = news.NameNews;
      row.appendChild(newsName);

      const date = document.createElement("td");
      const updatedDate = new Date(news.UpdatedDate);
      const formattedDate = updatedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      date.textContent = formattedDate;
      row.appendChild(date);

      const manage = document.createElement("td");
      manage.textContent =
        news.ButtonView + ` ` + news.ButtonEdit + ` ` + news.ButtonDelete + ``;
      const newsDetail = news.Detail;
      const modalId = `exampleModal-${news.NewsId}`; // สร้าง id ของโมดัล
      const modalSwitchId = `modalFlexSwitchCheckDefault-${news.NewsId}`; // สร้าง id ของสวิตช์ในโมดัล

      if (news.ButtonView === 1 || news.ButtonEdit === 1 || news.ButtonDelete === 1) {
        manage.innerHTML = `
          <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#${modalId}"  >
            <i class="far fa-file-alt" style="color: #769dbd;"></i>
          </button>
          <button type="button" class="btn" >
            <i class="fas fa-edit" style="color: #769dbd;"></i>
          </button>
          <button type="button" class="btn" >
            <i class="fas fa-trash-alt" style="color: #ff0000;"></i>
          </button>
          
          <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">รายละเอียดข่าวประชาสัมพันธ์</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="mb-3">
                      <label for="news-name" class="col-form-label">ชื่อเรื่อง<span class="red-dot">*&nbsp&nbsp&nbsp</span></label>
                      <input type="text" id="news-name-${news.NewsId}" value="${dataName}" disabled>
                    </div>
                    <div class="mb-3">
                      <label for="detail-text" class="col-form-label">เนื้อหา<span class="red-dot">*&nbsp&nbsp&nbsp&nbsp&nbsp</span></label>
                      <input type="text" id="detail-text-${news.NewsId}" value="${newsDetail}" disabled>
                    </div>
                    </div>
                    <div class="mb-6">
                      <label for="detail-text" class="col-form-label"><span>สถานะ*&nbsp&nbsp&nbsp&nbsp&nbsp</span></label>
                      <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="${modalSwitchId}"
                      onchange="changeStatus(${news.NewsId})" ${news.Status == 1 ? "checked" : ""}>
                      <label class="form-check-label" for="${modalSwitchId}">
                    </div>
                    </div>

                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }else{
        manage.innerHTML = `
        <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#${modalId}" hidden>
          <i class="far fa-file-alt" style="color: #769dbd;"></i>
        </button>
        <button type="button" class="btn" hidden>
          <i class="fas fa-edit" style="color: #769dbd;"></i>
        </button>
        <button type="button" class="btn" hidden>
          <i class="fas fa-trash-alt" style="color: #ff0000;" ></i>
        </button>`
      }

      row.appendChild(manage);
      tableBody.appendChild(row);
    });
  })
  .catch((error) => {
    console.log("An error occurred while fetching data:", error);
  });