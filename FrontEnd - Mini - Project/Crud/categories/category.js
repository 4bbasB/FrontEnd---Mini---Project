const URL = "http://localhost:3000/categories";
let categorysTable = document.getElementById("categorysTable");
let categoryCreateForm = document.getElementById("categoryCreateForm");

if (categorysTable && categoryCreateForm) {
    document.addEventListener("DOMContentLoaded", async function () {
        try {
            const response = await fetch(URL);
            const datas = await response.json();
            datas.forEach((data) => {
                categorysTable.innerHTML += `
          <tr>
            <th scope="row">${data.id}</th>
            <td>${data.name}</td>
            <td>${data.image}</td>
            <td style="display: flex; gap: 10px">
                <a class="btn btn-primary update-btn" href=href=${URL + '/' + data.id}>Update</a>
                <a class="btn btn-danger delete-btn" href=${URL + '/' + data.id}>Delete</a>
            </td>
          </tr>
        `;
            });
        } catch (error) {
            console.error("Error fetching categorys:", error);
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
          <form id="categoryUpdateForm" style="display: flex; flex-direction: column;">
            <label>Id</label>
            <input type="text" name="id" value="${data.id}">
            <label>Name</label>
            <input type="text" name="name" value="${data.name}">
            <label>Image</label>
            <input type="text" name="image" value="${data.image}">
          </form>
        `;
                        Swal.fire({
                            title: "Update category",
                            html: swalHtml,
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: "Save",
                            denyButtonText: `Don't save`
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const formData = new FormData(document.getElementById('categoryUpdateForm'));
                                const category = Object.fromEntries(formData.entries());
                                fetch(`${URL}/${id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(category)
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

    categoryCreateForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const category = Object.fromEntries(formData.entries());
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(category)
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log("category created:", responseData);
            } else {
                console.error("Error creating category:", response.status);
            }
        } catch (error) {
            console.error("Error creating category:", error);
        }
    });
} else {
    console.error("Error: categorysTable or categoryCreateForm not found");
}