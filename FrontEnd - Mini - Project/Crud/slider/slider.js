const URL = "http://localhost:3000/sliders";
let slidersTable = document.getElementById("slidersTable");
let sliderCreateForm = document.getElementById("sliderCreateForm");

if (slidersTable && sliderCreateForm) {
    document.addEventListener("DOMContentLoaded", async function () {
        try {
            const response = await fetch(URL);
            const datas = await response.json();
            datas.forEach((data) => {
                slidersTable.innerHTML += `
          <tr>
            <th scope="row">${data.id}</th>
            <td>${data.header}</td>
            <td>${data.description}</td>
            <td>${data.image}</td>
            <td style="display: flex; gap: 10px">
                <a class="btn btn-primary update-btn" href=href=${URL + '/' + data.id}>Update</a>
                <a class="btn btn-danger delete-btn" href=${URL + '/' + data.id}>Delete</a>
            </td>
          </tr>
        `;
            });
        } catch (error) {
            console.error("Error fetching sliders:", error);
        }

        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach((btn) => {
            btn.addEventListener("click", async function (e) {
                e.preventDefault();

                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });

                        const response = await fetch(e.target.href, {
                            method: "DELETE",
                        });
                    }
                });

            });
        });




        const updateButtons = document.querySelectorAll(".update-btn");
        updateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const id = button.href.split('/').pop();
                fetch(`${URL}/${id}`)
                    .then(response => response.json())
                    .then(data => {
                        const swalHtml = `
          <form id="sliderUpdateForm" style="display: flex; flex-direction: column;">
            <label>Id</label>
            <input type="text" name="id" value="${data.id}">
            <label>Header</label>
            <input type="text" name="header" value="${data.header}">
            <label>Description</label>
            <input type="text" name="description" value="${data.description}">
            <label>Image</label>
            <input type="text" name="image" value="${data.image}">
          </form>
        `;
                        Swal.fire({
                            title: "Update Slider",
                            html: swalHtml,
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: "Save",
                            denyButtonText: `Don't save`
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const formData = new FormData(document.getElementById('sliderUpdateForm'));
                                const slider = Object.fromEntries(formData.entries());
                                fetch(`${URL}/${id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(slider)
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        Swal.fire("Saved!", "", "success");
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            } else if (result.isDenied) {
                                Swal.fire("Changes are not saved", "", "info");
                            }
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });
        });


    });

    sliderCreateForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const slider = Object.fromEntries(formData.entries());
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(slider)
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log("Slider created:", responseData);
            } else {
                console.error("Error creating slider:", response.status);
            }
        } catch (error) {
            console.error("Error creating slider:", error);
        }
    });
} else {
    console.error("Error: slidersTable or sliderCreateForm not found");
}