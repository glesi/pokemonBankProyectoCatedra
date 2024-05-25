function realizarDeposito(){
    Swal.fire("SweetAlert2 is working!");
}

const salir = () => {
    Swal.fire({
        title: "Realmente desea salir del sistema?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Si"
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = "login.html";
            }
        });
}